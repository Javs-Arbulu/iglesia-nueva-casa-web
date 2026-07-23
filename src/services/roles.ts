import { getSupabase } from '@/services/supabase'
import { MODULES } from '@/lib/modules'

export interface Role {
  key: string
  label: string
  is_system: boolean
  sort: number
}

export interface PermRow {
  role_key: string
  module_id: string
  can_view: boolean
  can_edit: boolean
  can_delete: boolean
}

export interface Actions {
  view: boolean
  edit: boolean
  delete: boolean
}

/** Matriz editable: rol → módulo → acciones. */
export type Matrix = Record<string, Record<string, Actions>>

/** Solo los roles personalizados (no de sistema), para asignarlos a usuarios. */
export async function fetchCustomRoles(): Promise<Role[]> {
  const { data, error } = await getSupabase()
    .from('roles')
    .select('*')
    .eq('is_system', false)
    .order('label', { ascending: true })
  if (error) throw error
  return (data as Role[]) ?? []
}

/** Todas las asignaciones de roles personalizados (user_id → role_key). */
export async function fetchUserCustomRoles(): Promise<{ user_id: string; role_key: string }[]> {
  const { data, error } = await getSupabase()
    .from('user_custom_roles')
    .select('user_id, role_key')
  if (error) throw error
  return (data as { user_id: string; role_key: string }[]) ?? []
}

/** Asigna o quita un rol personalizado a un usuario. `currentlyHas` = ya lo tiene. */
export async function setUserCustomRole(
  userId: string,
  roleKey: string,
  currentlyHas: boolean
): Promise<void> {
  const sb = getSupabase()
  const { error } = currentlyHas
    ? await sb.from('user_custom_roles').delete().eq('user_id', userId).eq('role_key', roleKey)
    : await sb.from('user_custom_roles').insert({ user_id: userId, role_key: roleKey })
  if (error) throw error
}

export async function fetchRoles(): Promise<Role[]> {
  const { data, error } = await getSupabase()
    .from('roles')
    .select('*')
    .order('sort', { ascending: true })
    .order('label', { ascending: true })
  if (error) throw error
  return (data as Role[]) ?? []
}

export async function fetchPermissions(): Promise<PermRow[]> {
  const { data, error } = await getSupabase().from('role_permissions').select('*')
  if (error) throw error
  return (data as PermRow[]) ?? []
}

/** Convierte las filas de permisos en la matriz anidada para editar. */
export function buildMatrix(rows: PermRow[]): Matrix {
  const m: Matrix = {}
  for (const r of rows) {
    m[r.role_key] = m[r.role_key] ?? {}
    m[r.role_key][r.module_id] = {
      view: r.can_view,
      edit: r.can_edit,
      delete: r.can_delete,
    }
  }
  return m
}

/** Genera una clave url-safe a partir del nombre del rol. */
export function slugRole(label: string): string {
  return (
    label
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // quita acentos
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40) || 'rol'
  )
}

export async function createRole(label: string): Promise<void> {
  const { error } = await getSupabase().from('roles').insert({
    key: slugRole(label),
    label: label.trim(),
    is_system: false,
    sort: 200,
  })
  if (error) throw error
}

export async function updateRoleLabel(key: string, label: string): Promise<void> {
  const { error } = await getSupabase()
    .from('roles')
    .update({ label: label.trim() })
    .eq('key', key)
  if (error) throw error
}

export async function deleteRole(key: string): Promise<void> {
  const { error } = await getSupabase().from('roles').delete().eq('key', key)
  if (error) throw error
}

/** Guarda (upsert) todos los permisos de un rol según la matriz actual. */
export async function saveRolePermissions(
  roleKey: string,
  perms: Record<string, Actions>
): Promise<void> {
  const rows = MODULES.map((m) => ({
    role_key: roleKey,
    module_id: m.id,
    can_view: perms[m.id]?.view ?? false,
    can_edit: perms[m.id]?.edit ?? false,
    can_delete: perms[m.id]?.delete ?? false,
  }))
  const { error } = await getSupabase()
    .from('role_permissions')
    .upsert(rows, { onConflict: 'role_key,module_id' })
  if (error) throw error
}
