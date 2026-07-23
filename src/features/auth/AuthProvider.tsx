import { useEffect, useState, useCallback, useRef, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '@/services/supabase'
import type { AppRole, Profile } from '@/types'
import type { ModuleAction } from '@/lib/modules'
import { AuthContext, type AuthContextValue } from './context'

/** Permisos efectivos del usuario por módulo (unión de todos sus roles). */
type PermMap = Record<string, { view: boolean; edit: boolean; delete: boolean }>

const isConfigured = () =>
  Boolean(
    import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
  )

/**
 * Provee sesión + perfil + roles a toda la app. Es tolerante a que Supabase no
 * esté configurado (no rompe el sitio público): en ese caso queda sin sesión.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [roles, setRoles] = useState<AppRole[]>([])
  const [perms, setPerms] = useState<PermMap>({})
  // Si Supabase no está configurado, no hay nada que cargar → loading arranca false.
  const [loading, setLoading] = useState(isConfigured)
  const [configured] = useState(isConfigured)
  // Usuario cuyo perfil/roles ya cargamos (evita recargar en cada token refresh).
  const loadedUid = useRef<string | null>(null)

  const loadProfileAndRoles = useCallback(async (uid: string) => {
    try {
      const supabase = getSupabase()
      const [{ data: prof }, { data: roleRows }, { data: customRows }] =
        await Promise.all([
          supabase.from('profiles').select('*').eq('id', uid).maybeSingle(),
          supabase.from('user_roles').select('role').eq('user_id', uid),
          supabase.from('user_custom_roles').select('role_key').eq('user_id', uid),
        ])
      const sysRoles = ((roleRows ?? []) as { role: AppRole }[]).map((r) => r.role)
      const customKeys = ((customRows ?? []) as { role_key: string }[]).map((r) => r.role_key)
      setProfile((prof as Profile | null) ?? null)
      setRoles(sysRoles)

      // Permisos efectivos = unión (OR) de la matriz de todos los roles del usuario.
      const allKeys = [...new Set<string>([...sysRoles, ...customKeys])]
      const map: PermMap = {}
      if (allKeys.length > 0) {
        const { data: permRows } = await supabase
          .from('role_permissions')
          .select('module_id, can_view, can_edit, can_delete')
          .in('role_key', allKeys)
        for (const p of (permRows ?? []) as {
          module_id: string
          can_view: boolean
          can_edit: boolean
          can_delete: boolean
        }[]) {
          const cur = map[p.module_id] ?? { view: false, edit: false, delete: false }
          map[p.module_id] = {
            view: cur.view || p.can_view,
            edit: cur.edit || p.can_edit,
            delete: cur.delete || p.can_delete,
          }
        }
      }
      setPerms(map)
    } catch (err) {
      console.error('No se pudieron cargar perfil/roles:', err)
      setProfile(null)
      setRoles([])
      setPerms({})
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let supabase
    try {
      supabase = getSupabase()
    } catch {
      return
    }

    // onAuthStateChange emite INITIAL_SESSION al suscribirse, así que cubre la
    // sesión actual sin necesidad de getSession().
    // IMPORTANTE: el callback corre dentro del lock de auth de Supabase; NO se
    // debe await-ear otra llamada a Supabase aquí (deadlock). Lo diferimos con
    // setTimeout para que las consultas puedan tomar el lock.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (!s) {
        loadedUid.current = null
        setProfile(null)
        setRoles([])
        setPerms({})
        setLoading(false)
        return
      }
      // Solo (re)cargamos perfil/roles cuando cambia el usuario (login/sesión
      // inicial), no en cada refresh de token. Marcamos loading hasta tenerlos,
      // para que el redirect post-login espere a conocer los roles.
      if (s.user.id !== loadedUid.current) {
        loadedUid.current = s.user.id
        setLoading(true)
        setTimeout(() => loadProfileAndRoles(s.user.id), 0)
      }
    })

    return () => {
      sub.subscription.unsubscribe()
    }
  }, [loadProfileAndRoles])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
      })
      return { error: error?.message ?? null }
    } catch {
      return { error: 'Supabase no está configurado.' }
    }
  }, [])

  const signUp = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
      try {
        const { error } = await getSupabase().auth.signUp({
          email,
          password,
          options: { data: { first_name: firstName, last_name: lastName } },
        })
        return { error: error?.message ?? null }
      } catch {
        return { error: 'Supabase no está configurado.' }
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    try {
      await getSupabase().auth.signOut()
    } catch {
      /* ignore */
    }
  }, [])

  const hasRole = useCallback(
    (...wanted: AppRole[]) => wanted.some((r) => roles.includes(r)),
    [roles]
  )

  // El admin siempre puede todo (espejo del backstop de la RLS). El resto,
  // según la matriz de permisos.
  const can = useCallback(
    (moduleId: string, action: ModuleAction) =>
      roles.includes('admin') ? true : (perms[moduleId]?.[action] ?? false),
    [roles, perms]
  )

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    profile,
    roles,
    loading,
    configured,
    signIn,
    signUp,
    signOut,
    hasRole,
    can,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
