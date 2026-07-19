import { useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '@/services/supabase'
import type { AppRole, Profile } from '@/types'
import { AuthContext, type AuthContextValue } from './context'

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
  // Si Supabase no está configurado, no hay nada que cargar → loading arranca false.
  const [loading, setLoading] = useState(isConfigured)
  const [configured] = useState(isConfigured)

  const loadProfileAndRoles = useCallback(async (uid: string) => {
    try {
      const supabase = getSupabase()
      const [{ data: prof }, { data: roleRows }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', uid).maybeSingle(),
        supabase.from('user_roles').select('role').eq('user_id', uid),
      ])
      setProfile((prof as Profile | null) ?? null)
      setRoles(((roleRows ?? []) as { role: AppRole }[]).map((r) => r.role))
    } catch (err) {
      console.error('No se pudieron cargar perfil/roles:', err)
      setProfile(null)
      setRoles([])
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
      if (s) {
        setTimeout(() => loadProfileAndRoles(s.user.id), 0)
      } else {
        setProfile(null)
        setRoles([])
        setLoading(false)
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

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    profile,
    roles,
    loading,
    configured,
    signIn,
    signOut,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
