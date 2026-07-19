import { useCallback, useEffect, useState } from 'react'
import { Loader2, Check, Pencil, Save } from 'lucide-react'
import { getSupabase } from '@/services/supabase'
import { useAuth } from '@/features/auth/context'
import Modal from '@/components/common/Modal'
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
  const [busy, setBusy] = useState(false)

  // Edición en modal
  const [editingId, setEditingId] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  const editing = users.find((u) => u.id === editingId) ?? null

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

  const openEdit = (u: UserWithRoles) => {
    setEditingId(u.id)
    setFirstName(u.first_name ?? '')
    setLastName(u.last_name ?? '')
    setPhone(u.phone ?? '')
  }

  const saveProfile = async () => {
    if (!editing) return
    setBusy(true)
    const fn = firstName.trim()
    const ln = lastName.trim()
    const fullName = [fn, ln].filter(Boolean).join(' ')
    const { error } = await getSupabase()
      .from('profiles')
      .update({
        first_name: fn || null,
        last_name: ln || null,
        full_name: fullName || null,
        phone: phone.trim() || null,
      })
      .eq('id', editing.id)
    if (error) console.error(error)
    await refresh()
    setBusy(false)
  }

  const toggleRole = async (u: UserWithRoles, role: AppRole) => {
    // No permitir que te quites tu propio rol de admin (evita auto-bloqueo).
    if (u.id === user?.id && role === 'admin' && u.roles.includes(role)) return
    setBusy(true)
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
    setBusy(false)
  }

  const approve = async (u: UserWithRoles) => {
    setBusy(true)
    const supabase = getSupabase()
    await supabase.from('profiles').update({ status: 'active' }).eq('id', u.id)
    if (!u.roles.includes('miembro')) {
      await supabase.from('user_roles').insert({ user_id: u.id, role: 'miembro' })
    }
    await refresh()
    setBusy(false)
  }

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'

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
        <ul className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 divide-y divide-gray-100 dark:divide-slate-800 overflow-hidden">
          {users.map((u) => (
            <li key={u.id} className="flex items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {u.full_name ?? u.email ?? 'Sin nombre'}
                  {u.id === user?.id && (
                    <span className="ml-2 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                      (tú)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400 truncate">
                  {u.email}
                  {u.roles.length > 0 && (
                    <span className="text-gray-400 dark:text-slate-500">
                      {' · '}
                      {u.roles.join(', ')}
                    </span>
                  )}
                </p>
              </div>

              {u.status === 'pending' && (
                <span className="shrink-0 text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 px-2.5 py-1 rounded-full">
                  Pendiente
                </span>
              )}

              <button
                onClick={() => openEdit(u)}
                aria-label={`Editar ${u.full_name ?? u.email ?? 'usuario'}`}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <Pencil className="w-4 h-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal de edición */}
      <Modal
        open={!!editing}
        onClose={() => setEditingId(null)}
        title="Editar usuario"
      >
        {editing && (
          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400 break-all">
                {editing.email}
              </p>
              <span
                className={`inline-block mt-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  editing.status === 'pending'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
                    : 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300'
                }`}
              >
                {editing.status === 'pending' ? 'Pendiente' : 'Activo'}
              </span>
            </div>

            {editing.status === 'pending' && (
              <button
                onClick={() => approve(editing)}
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                Aprobar (activar + rol miembro)
              </button>
            )}

            {/* Datos */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="edit-first"
                    className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1"
                  >
                    Nombre
                  </label>
                  <input
                    id="edit-first"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label
                    htmlFor="edit-last"
                    className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1"
                  >
                    Apellido
                  </label>
                  <input
                    id="edit-last"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="edit-phone"
                  className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1"
                >
                  Teléfono
                </label>
                <input
                  id="edit-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={saveProfile}
                  disabled={busy}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-slate-900 transition-colors disabled:opacity-60"
                >
                  <Save className="w-4 h-4" aria-hidden="true" />
                  Guardar datos
                </button>
              </div>
            </div>

            {/* Roles */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                Roles
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_ROLES.map(({ role, label }) => {
                  const active = editing.roles.includes(role)
                  const lockedSelfAdmin =
                    editing.id === user?.id && role === 'admin' && active
                  return (
                    <button
                      key={role}
                      onClick={() => toggleRole(editing, role)}
                      disabled={busy || lockedSelfAdmin}
                      aria-pressed={active}
                      title={
                        lockedSelfAdmin
                          ? 'No puedes quitarte tu propio rol de admin'
                          : undefined
                      }
                      className={`text-sm font-medium px-3 py-1.5 rounded-full border transition-colors disabled:opacity-60 ${
                        lockedSelfAdmin ? 'cursor-not-allowed' : ''
                      } ${
                        active
                          ? 'bg-cyan-500 text-white border-cyan-500'
                          : 'bg-transparent text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-cyan-400'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {busy && (
              <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Guardando…
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
