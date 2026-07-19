import { useCallback, useEffect, useState } from 'react'
import { Loader2, Check, ShieldCheck } from 'lucide-react'
import { getSupabase } from '@/services/supabase'
import { useAuth } from '@/features/auth/context'
import type { AppRole, Profile, UserWithRoles } from '@/types'

type Status = 'loading' | 'success' | 'error'

const ALL_ROLES: { role: AppRole; label: string }[] = [
  { role: 'admin', label: 'Admin' },
  { role: 'editor', label: 'Editor' },
  { role: 'finanzas', label: 'Finanzas' },
  { role: 'miembro', label: 'Miembro' },
]

export default function Usuarios() {
  const { user } = useAuth()
  const [users, setUsers] = useState<UserWithRoles[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [busyId, setBusyId] = useState<string | null>(null)

  // Devuelve los datos (sin setState) para poder usarlo tanto en el effect
  // (patrón .then) como tras las mutaciones.
  const fetchUsers = useCallback(async (): Promise<UserWithRoles[]> => {
    const supabase = getSupabase()
    const [{ data: profiles, error: pErr }, { data: roleRows, error: rErr }] =
      await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase.from('user_roles').select('user_id, role'),
      ])
    if (pErr || rErr) throw pErr ?? rErr
    const rolesByUser = new Map<string, AppRole[]>()
    for (const r of (roleRows ?? []) as { user_id: string; role: AppRole }[]) {
      rolesByUser.set(r.user_id, [...(rolesByUser.get(r.user_id) ?? []), r.role])
    }
    return ((profiles ?? []) as Profile[]).map((p) => ({
      ...p,
      roles: rolesByUser.get(p.id) ?? [],
    }))
  }, [])

  useEffect(() => {
    let active = true
    fetchUsers()
      .then((data) => {
        if (!active) return
        setUsers(data)
        setStatus('success')
      })
      .catch((err) => {
        if (!active) return
        console.error(err)
        setStatus('error')
      })
    return () => {
      active = false
    }
  }, [fetchUsers])

  const refresh = async () => {
    try {
      setUsers(await fetchUsers())
    } catch (err) {
      console.error(err)
    }
  }

  const toggleRole = async (u: UserWithRoles, role: AppRole) => {
    setBusyId(u.id)
    const supabase = getSupabase()
    const has = u.roles.includes(role)
    const { error } = has
      ? await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', u.id)
          .eq('role', role)
      : await supabase.from('user_roles').insert({ user_id: u.id, role })
    if (error) console.error(error)
    await refresh()
    setBusyId(null)
  }

  const approve = async (u: UserWithRoles) => {
    setBusyId(u.id)
    const supabase = getSupabase()
    await supabase.from('profiles').update({ status: 'active' }).eq('id', u.id)
    if (!u.roles.includes('miembro')) {
      await supabase.from('user_roles').insert({ user_id: u.id, role: 'miembro' })
    }
    await refresh()
    setBusyId(null)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>

      {status === 'loading' && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 py-10">
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          Cargando…
        </div>
      )}

      {status === 'error' && (
        <p className="text-red-500">No se pudieron cargar los usuarios.</p>
      )}

      {status === 'success' && (
        <ul className="space-y-3">
          {users.map((u) => {
            const busy = busyId === u.id
            return (
              <li
                key={u.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-800"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      {u.full_name ?? u.email ?? 'Sin nombre'}
                      {u.id === user?.id && (
                        <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                          (tú)
                        </span>
                      )}
                    </p>
                    {u.email && (
                      <p className="text-sm text-gray-500 dark:text-slate-400 break-all">
                        {u.email}
                      </p>
                    )}
                  </div>
                  {u.status === 'pending' ? (
                    <button
                      onClick={() => approve(u)}
                      disabled={busy}
                      className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 px-3 py-1.5 rounded-full disabled:opacity-60"
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      Aprobar
                    </button>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300 px-3 py-1.5 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      Activo
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {ALL_ROLES.map(({ role, label }) => {
                    const active = u.roles.includes(role)
                    return (
                      <button
                        key={role}
                        onClick={() => toggleRole(u, role)}
                        disabled={busy}
                        aria-pressed={active}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors disabled:opacity-60 ${
                          active
                            ? 'bg-cyan-500 text-white border-cyan-500'
                            : 'bg-transparent text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-cyan-400'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                  {busy && (
                    <Loader2
                      className="w-4 h-4 animate-spin text-cyan-500 self-center"
                      aria-label="Guardando"
                    />
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
