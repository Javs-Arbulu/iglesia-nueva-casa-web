import { useEffect, useState } from 'react'
import { Loader2, Plus, Pencil, Trash2, Save, ShieldCheck } from 'lucide-react'
import {
  fetchRoles,
  fetchPermissions,
  buildMatrix,
  createRole,
  updateRoleLabel,
  deleteRole,
  saveRolePermissions,
  type Role,
  type Matrix,
} from '@/services/roles'
import { MODULES, type ModuleAction } from '@/lib/modules'
import { useToast } from '@/features/toast/context'
import { useAuth } from '@/features/auth/context'
import PageHeader from '@/components/admin/PageHeader'
import Modal from '@/components/common/Modal'
import { inputCls, primaryBtn, primaryBtnBlock, cardCls } from '@/lib/adminUi'

const ACTION_LABEL: Record<ModuleAction, string> = {
  view: 'Ver',
  edit: 'Editar',
  delete: 'Eliminar',
}

export default function Roles() {
  const toast = useToast()
  const { can } = useAuth()
  const canEdit = can('roles', 'edit')
  const [roles, setRoles] = useState<Role[] | null>(null)
  const [matrix, setMatrix] = useState<Matrix>({})
  const [selectedKey, setSelectedKey] = useState<string>('')
  const [saving, setSaving] = useState(false)

  // Modales
  const [formOpen, setFormOpen] = useState<false | 'new' | 'rename'>(false)
  const [formLabel, setFormLabel] = useState('')
  const [formBusy, setFormBusy] = useState(false)

  const load = async (preferKey?: string) => {
    const [rs, ps] = await Promise.all([fetchRoles(), fetchPermissions()])
    setRoles(rs)
    setMatrix(buildMatrix(ps))
    setSelectedKey((cur) => preferKey ?? (rs.some((r) => r.key === cur) ? cur : rs[0]?.key ?? ''))
  }

  useEffect(() => {
    let active = true
    Promise.all([fetchRoles(), fetchPermissions()])
      .then(([rs, ps]) => {
        if (!active) return
        setRoles(rs)
        setMatrix(buildMatrix(ps))
        setSelectedKey(rs[0]?.key ?? '')
      })
      .catch((err) => {
        if (!active) return
        console.error(err)
        setRoles([])
      })
    return () => {
      active = false
    }
  }, [])

  const selectedRole = roles?.find((r) => r.key === selectedKey) ?? null
  const isAdmin = selectedKey === 'admin'

  const setAct = (moduleId: string, action: ModuleAction, val: boolean) =>
    setMatrix((m) => {
      const role = m[selectedKey] ?? {}
      const prev = role[moduleId] ?? { view: false, edit: false, delete: false }
      return { ...m, [selectedKey]: { ...role, [moduleId]: { ...prev, [action]: val } } }
    })

  const savePerms = async () => {
    if (!selectedKey) return
    setSaving(true)
    try {
      await saveRolePermissions(selectedKey, matrix[selectedKey] ?? {})
      toast.success('Permisos guardados.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudieron guardar los permisos.')
    }
    setSaving(false)
  }

  const submitForm = async () => {
    const label = formLabel.trim()
    if (!label) return
    setFormBusy(true)
    try {
      if (formOpen === 'new') {
        await createRole(label)
        await load()
        toast.success('Rol creado.')
      } else if (formOpen === 'rename') {
        await updateRoleLabel(selectedKey, label)
        await load(selectedKey)
        toast.success('Rol renombrado.')
      }
      setFormOpen(false)
    } catch (err) {
      console.error(err)
      toast.error('No se pudo guardar el rol (¿nombre repetido?).')
    }
    setFormBusy(false)
  }

  const removeRole = async () => {
    if (!selectedRole || selectedRole.is_system) return
    if (!window.confirm(`¿Eliminar el rol “${selectedRole.label}”? Se quitará a quien lo tenga.`))
      return
    setSaving(true)
    try {
      await deleteRole(selectedRole.key)
      await load()
      toast.success('Rol eliminado.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo eliminar el rol.')
    }
    setSaving(false)
  }

  if (!roles) {
    return (
      <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 py-10">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        Cargando…
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Roles y permisos"
        action={
          canEdit ? (
            <button
              onClick={() => {
                setFormLabel('')
                setFormOpen('new')
              }}
              className={primaryBtn}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Nuevo rol
            </button>
          ) : undefined
        }
      />

      {/* Selector de rol */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {roles.map((r) => (
          <button
            key={r.key}
            onClick={() => setSelectedKey(r.key)}
            className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              selectedKey === r.key
                ? 'bg-cyan-500 text-white'
                : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:border-cyan-400'
            }`}
          >
            {r.label}
            {r.is_system && (
              <span
                className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                  selectedKey === r.key ? 'bg-white/25' : 'bg-gray-100 dark:bg-slate-800'
                }`}
              >
                sistema
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedRole && (
        <div className={cardCls}>
          {/* Encabezado del rol */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white">
              {selectedRole.label}
            </h2>
            {canEdit && !selectedRole.is_system && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setFormLabel(selectedRole.label)
                    setFormOpen('rename')
                  }}
                  aria-label="Renombrar rol"
                  className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <Pencil className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={removeRole}
                  disabled={saving}
                  aria-label="Eliminar rol"
                  className="w-9 h-9 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-60"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {isAdmin ? (
            <div className="flex items-start gap-2 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 p-3 text-sm text-cyan-800 dark:text-cyan-200">
              <ShieldCheck className="w-5 h-5 shrink-0" aria-hidden="true" />
              El rol <strong>Admin</strong> siempre tiene acceso total a todos los módulos; no
              requiere configuración.
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-100 dark:divide-slate-800">
                {MODULES.map((m) => (
                  <li
                    key={m.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-2.5"
                  >
                    <span className="text-sm font-medium text-gray-800 dark:text-slate-100">
                      {m.label}
                    </span>
                    <div className="flex flex-wrap gap-1.5 shrink-0">
                      {m.actions.map((a) => {
                        const on = matrix[selectedKey]?.[m.id]?.[a] ?? false
                        return (
                          <button
                            key={a}
                            onClick={() => setAct(m.id, a, !on)}
                            disabled={!canEdit}
                            aria-pressed={on}
                            className={`text-xs font-semibold px-2.5 py-1.5 rounded-full border transition-colors disabled:opacity-70 disabled:cursor-default ${
                              on
                                ? 'bg-cyan-500 text-white border-cyan-500'
                                : 'bg-transparent text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-cyan-400'
                            }`}
                          >
                            {ACTION_LABEL[a]}
                          </button>
                        )
                      })}
                    </div>
                  </li>
                ))}
              </ul>

              {canEdit && (
              <button
                onClick={savePerms}
                disabled={saving}
                className={`${primaryBtnBlock} mt-4`}
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="w-5 h-5" aria-hidden="true" />
                )}
                Guardar permisos
              </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Modal crear / renombrar */}
      <Modal
        open={formOpen !== false}
        onClose={() => setFormOpen(false)}
        title={formOpen === 'rename' ? 'Renombrar rol' : 'Nuevo rol'}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="role-label" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Nombre del rol
            </label>
            <input
              id="role-label"
              type="text"
              value={formLabel}
              onChange={(e) => setFormLabel(e.target.value)}
              placeholder="Ej: Líder de jóvenes"
              className={inputCls}
            />
            {formOpen === 'new' && (
              <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                Luego marca qué módulos puede ver/editar/eliminar.
              </p>
            )}
          </div>
          <button
            onClick={submitForm}
            disabled={formBusy || !formLabel.trim()}
            className={primaryBtnBlock}
          >
            {formBusy ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              (formOpen === 'rename' ? 'Guardar' : 'Crear rol')
            )}
          </button>
        </div>
      </Modal>
    </div>
  )
}
