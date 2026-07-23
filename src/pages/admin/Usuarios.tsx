import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Check, Pencil, Save, Ban, CheckCheck, HelpCircle, ShieldCheck } from 'lucide-react'
import { getSupabase } from '@/services/supabase'
import { useAuth } from '@/features/auth/context'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/features/toast/context'
import {
  fetchCustomRoles,
  fetchUserCustomRoles,
  setUserCustomRole,
  type Role,
} from '@/services/roles'
import AsyncState from '@/components/admin/AsyncState'
import PageHeader from '@/components/admin/PageHeader'
import Modal from '@/components/common/Modal'
import { inputCls, listCardCls } from '@/lib/adminUi'
import type { AppRole, Profile, UserWithRoles } from '@/types'

type UserRow = UserWithRoles & { customRoles: string[] }
interface UsersData {
  users: UserRow[]
  catalog: Role[]
}

const ALL_ROLES: { role: AppRole; label: string }[] = [
  { role: 'admin', label: 'Admin' },
  { role: 'editor', label: 'Editor' },
  { role: 'finanzas', label: 'Finanzas' },
  { role: 'miembro', label: 'Miembro' },
]

const ROLE_STYLES: Record<AppRole, string> = {
  admin: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  editor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  finanzas: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  miembro: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}
const CUSTOM_STYLE = 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'

async function loadUsersData(): Promise<UsersData> {
  const supabase = getSupabase()
  const [{ data: profiles, error: pErr }, { data: roleRows, error: rErr }, custom, catalog] =
    await Promise.all([
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('user_roles').select('user_id, role'),
      fetchUserCustomRoles(),
      fetchCustomRoles(),
    ])
  if (pErr || rErr) throw pErr ?? rErr
  const sysByUser = new Map<string, AppRole[]>()
  for (const r of (roleRows ?? []) as { user_id: string; role: AppRole }[]) {
    sysByUser.set(r.user_id, [...(sysByUser.get(r.user_id) ?? []), r.role])
  }
  const customByUser = new Map<string, string[]>()
  for (const r of custom) {
    customByUser.set(r.user_id, [...(customByUser.get(r.user_id) ?? []), r.role_key])
  }
  const users = ((profiles ?? []) as Profile[]).map((p) => ({
    ...p,
    roles: sysByUser.get(p.id) ?? [],
    customRoles: customByUser.get(p.id) ?? [],
  }))
  return { users, catalog }
}

export default function Usuarios() {
  const { user, can } = useAuth()
  const canEdit = can('usuarios', 'edit')
  const toast = useToast()
  const { data, status, refresh } = useAsyncData(loadUsersData, {
    users: [],
    catalog: [],
  } as UsersData)
  const users = data.users
  const catalog = data.catalog
  const labelByKey = new Map(catalog.map((r) => [r.key, r.label]))
  const [busy, setBusy] = useState(false)

  // Filtros
  const [query, setQuery] = useState('')
  const [pendingOnly, setPendingOnly] = useState(false)

  // Selección múltiple
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const toggleSelect = (id: string) =>
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  const clearSelection = () => setSelected(new Set())

  // Edición en modal
  const [editingId, setEditingId] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')

  const editing = users.find((u) => u.id === editingId) ?? null

  const pendingCount = users.filter((u) => u.status === 'pending').length
  const q = query.trim().toLowerCase()
  const visibleUsers = users.filter((u) => {
    if (pendingOnly && u.status !== 'pending') return false
    if (!q) return true
    return (
      (u.full_name ?? '').toLowerCase().includes(q) ||
      (u.email ?? '').toLowerCase().includes(q)
    )
  })
  const selectedUsers = users.filter((u) => selected.has(u.id))

  const openEdit = (u: UserRow) => {
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
    if (error) {
      console.error(error)
      toast.error('No se pudieron guardar los datos.')
    } else {
      toast.success('Datos guardados.')
    }
    await refresh()
    setBusy(false)
  }

  const toggleRole = async (u: UserRow, role: AppRole) => {
    if (u.id === user?.id && role === 'admin' && u.roles.includes(role)) return
    setBusy(true)
    const supabase = getSupabase()
    const has = u.roles.includes(role)
    const { error } = has
      ? await supabase.from('user_roles').delete().eq('user_id', u.id).eq('role', role)
      : await supabase.from('user_roles').insert({ user_id: u.id, role })
    if (error) {
      console.error(error)
      toast.error('No se pudo actualizar el rol.')
    } else {
      toast.success(has ? `Rol “${role}” quitado.` : `Rol “${role}” asignado.`)
    }
    await refresh()
    setBusy(false)
  }

  const toggleCustomRole = async (u: UserRow, roleKey: string) => {
    setBusy(true)
    const has = u.customRoles.includes(roleKey)
    try {
      await setUserCustomRole(u.id, roleKey, has)
      toast.success(has ? 'Rol quitado.' : 'Rol asignado.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo actualizar el rol.')
    }
    await refresh()
    setBusy(false)
  }

  const approveUsers = async (targets: UserRow[]) => {
    const pending = targets.filter((u) => u.status === 'pending')
    if (pending.length === 0) return
    setBusy(true)
    try {
      const supabase = getSupabase()
      const ids = pending.map((u) => u.id)
      const { error: pErr } = await supabase
        .from('profiles')
        .update({ status: 'active' })
        .in('id', ids)
      if (pErr) throw pErr
      const toAdd = pending
        .filter((u) => !u.roles.includes('miembro'))
        .map((u) => ({ user_id: u.id, role: 'miembro' as AppRole }))
      if (toAdd.length) {
        const { error: rErr } = await supabase.from('user_roles').insert(toAdd)
        if (rErr) throw rErr
      }
      toast.success(
        pending.length === 1 ? 'Usuario aprobado.' : `${pending.length} usuarios aprobados.`
      )
    } catch (err) {
      console.error(err)
      toast.error('No se pudieron aprobar los usuarios.')
    }
    clearSelection()
    await refresh()
    setBusy(false)
  }

  const deactivateUsers = async (targets: UserRow[]) => {
    const active = targets.filter((u) => u.status === 'active' && u.id !== user?.id)
    if (active.length === 0) {
      if (targets.some((u) => u.id === user?.id))
        toast.error('No puedes desactivar tu propia cuenta.')
      return
    }
    setBusy(true)
    try {
      const { error } = await getSupabase()
        .from('profiles')
        .update({ status: 'pending' })
        .in(
          'id',
          active.map((u) => u.id)
        )
      if (error) throw error
      toast.success(
        active.length === 1 ? 'Usuario desactivado.' : `${active.length} usuarios desactivados.`
      )
    } catch (err) {
      console.error(err)
      toast.error('No se pudieron desactivar los usuarios.')
    }
    clearSelection()
    await refresh()
    setBusy(false)
  }

  return (
    <div>
      <PageHeader title="Usuarios" />

      {/* Docs: cómo agregar un rol nuevo */}
      <details className="mb-4 rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <summary className="cursor-pointer select-none px-4 py-3 font-semibold text-gray-800 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-500" aria-hidden="true" />
          ¿Cómo agregar un rol nuevo?
        </summary>
        <div className="px-4 pb-4 text-sm text-gray-600 dark:text-slate-300 space-y-3">
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              Ve a{' '}
              <Link to="/admin/roles" className="font-semibold text-cyan-600 dark:text-cyan-400">
                Roles y permisos
              </Link>{' '}
              → <strong>Nuevo rol</strong> y ponle nombre.
            </li>
            <li>Marca qué módulos puede <strong>Ver / Editar / Eliminar</strong> y guarda.</li>
            <li>
              Vuelve aquí, edita a la persona (✏️) y asígnale el rol en{' '}
              <strong>Roles personalizados</strong>.
            </li>
            <li>Verá los cambios al <strong>recargar o volver a entrar</strong>.</li>
          </ol>
          <p className="flex items-start gap-2 text-xs text-gray-400 dark:text-slate-500">
            <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            El rol <strong>Admin</strong> siempre tiene acceso total. La seguridad de los datos la
            aplica la base de datos (RLS), no solo el menú.
          </p>
        </div>
      </details>

      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre o email…"
          aria-label="Buscar usuarios"
          className={`${inputCls} flex-1 min-w-[12rem]`}
        />
        <button
          onClick={() => setPendingOnly((v) => !v)}
          aria-pressed={pendingOnly}
          className={`shrink-0 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-colors ${
            pendingOnly
              ? 'bg-amber-500 text-white border-amber-500'
              : 'bg-transparent text-gray-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-amber-400'
          }`}
        >
          Solo pendientes{pendingCount > 0 ? ` (${pendingCount})` : ''}
        </button>
      </div>

      {canEdit && pendingCount > 0 && (
        <button
          onClick={() => approveUsers(users)}
          disabled={busy}
          className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 px-3 py-2 rounded-full disabled:opacity-60"
        >
          <CheckCheck className="w-4 h-4" aria-hidden="true" />
          Aprobar todos los pendientes ({pendingCount})
        </button>
      )}

      {canEdit && selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-3 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 p-2">
          <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300 px-1">
            {selected.size} seleccionado{selected.size > 1 ? 's' : ''}
          </span>
          <button
            onClick={() => approveUsers(selectedUsers)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 text-sm font-semibold bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 rounded-full disabled:opacity-60"
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            Aprobar
          </button>
          <button
            onClick={() => deactivateUsers(selectedUsers)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-1.5 rounded-full disabled:opacity-60"
          >
            <Ban className="w-4 h-4" aria-hidden="true" />
            Desactivar
          </button>
          <button
            onClick={clearSelection}
            className="text-sm font-semibold text-gray-500 dark:text-slate-400 px-2 py-1.5"
          >
            Limpiar
          </button>
        </div>
      )}

      <AsyncState
        status={status}
        isEmpty={visibleUsers.length === 0}
        errorText="No se pudieron cargar los usuarios."
        emptyText={
          users.length === 0 ? 'Aún no hay usuarios.' : 'Ningún usuario coincide con el filtro.'
        }
      >
        <ul className={listCardCls}>
          {visibleUsers.map((u) => (
            <li key={u.id} className="flex items-center gap-3 p-3">
              {canEdit && (
                <input
                  type="checkbox"
                  checked={selected.has(u.id)}
                  onChange={() => toggleSelect(u.id)}
                  aria-label={`Seleccionar ${u.full_name ?? u.email ?? 'usuario'}`}
                  className="w-4 h-4 shrink-0 rounded accent-cyan-500"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {u.full_name ?? u.email ?? 'Sin nombre'}
                  {u.id === user?.id && (
                    <span className="ml-2 text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                      (tú)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{u.email}</p>
                {(u.roles.length > 0 || u.customRoles.length > 0) && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {u.roles.map((r) => (
                      <span
                        key={r}
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${ROLE_STYLES[r]}`}
                      >
                        {r}
                      </span>
                    ))}
                    {u.customRoles.map((k) => (
                      <span
                        key={k}
                        className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${CUSTOM_STYLE}`}
                      >
                        {labelByKey.get(k) ?? k}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {u.status === 'pending' && (
                <span className="shrink-0 text-[11px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 px-2.5 py-1 rounded-full">
                  Pendiente
                </span>
              )}

              {canEdit && (
                <button
                  onClick={() => openEdit(u)}
                  aria-label={`Editar ${u.full_name ?? u.email ?? 'usuario'}`}
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <Pencil className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </AsyncState>

      {/* Modal de edición */}
      <Modal open={!!editing} onClose={() => setEditingId(null)} title="Editar usuario">
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

            {editing.status === 'pending' ? (
              <button
                onClick={() => approveUsers([editing])}
                disabled={busy}
                className="w-full inline-flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                Aprobar (activar + rol miembro)
              </button>
            ) : (
              editing.id !== user?.id && (
                <button
                  onClick={() => deactivateUsers([editing])}
                  disabled={busy}
                  className="w-full inline-flex items-center justify-center gap-2 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60"
                >
                  <Ban className="w-4 h-4" aria-hidden="true" />
                  Desactivar (revocar acceso)
                </button>
              )
            )}

            {/* Datos */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-first" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
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
                  <label htmlFor="edit-last" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
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
                <label htmlFor="edit-phone" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
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

            {/* Roles de sistema */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                Roles de sistema
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
                      title={lockedSelfAdmin ? 'No puedes quitarte tu propio rol de admin' : undefined}
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

            {/* Roles personalizados */}
            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
                Roles personalizados
              </p>
              {catalog.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-slate-500">
                  Aún no hay roles personalizados.{' '}
                  <Link to="/admin/roles" className="font-semibold text-cyan-600 dark:text-cyan-400">
                    Crear uno
                  </Link>
                  .
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {catalog.map((r) => {
                    const active = editing.customRoles.includes(r.key)
                    return (
                      <button
                        key={r.key}
                        onClick={() => toggleCustomRole(editing, r.key)}
                        disabled={busy}
                        aria-pressed={active}
                        className={`text-sm font-medium px-3 py-1.5 rounded-full border transition-colors disabled:opacity-60 ${
                          active
                            ? 'bg-violet-500 text-white border-violet-500'
                            : 'bg-transparent text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-violet-400'
                        }`}
                      >
                        {r.label}
                      </button>
                    )
                  })}
                </div>
              )}
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
