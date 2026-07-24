import { useMemo, useRef, useState } from 'react'
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, FileText, ExternalLink } from 'lucide-react'
import {
  fetchMaterial,
  uploadMaterial,
  updateMaterial,
  setMaterialPublished,
  deleteMaterial,
  getViewUrl,
  type MaterialItem,
} from '@/services/material'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/features/toast/context'
import { useAuth } from '@/features/auth/context'
import AsyncState from '@/components/admin/AsyncState'
import PageHeader from '@/components/admin/PageHeader'
import Modal from '@/components/common/Modal'
import CategoryPicker from '@/components/admin/CategoryPicker'
import { inputCls, primaryBtn, primaryBtnBlock } from '@/lib/adminUi'

const albumLabel = (c: string) => c.charAt(0).toUpperCase() + c.slice(1)
const EMPTY = { title: '', description: '', category: 'General' }

export default function Material() {
  const toast = useToast()
  const { can } = useAuth()
  const canEdit = can('material', 'edit')
  const canDelete = can('material', 'delete')
  const { data: items, status, refresh } = useAsyncData(fetchMaterial, [] as MaterialItem[])
  const [busyId, setBusyId] = useState<string | null>(null)

  // Alta / edición
  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const categories = useMemo(
    () =>
      Array.from(new Set(items.map((i) => i.category)))
        .sort((a, b) => a.localeCompare(b, 'es')),
    [items]
  )

  const openNew = () => {
    setForm(EMPTY)
    setFile(null)
    setEditingId('new')
  }
  const openEdit = (m: MaterialItem) => {
    setForm({ title: m.title, description: m.description ?? '', category: m.category })
    setFile(null)
    setEditingId(m.id)
  }
  const close = () => setEditingId(null)

  const save = async () => {
    if (!form.title.trim()) return
    if (editingId === 'new' && !file) {
      toast.error('Elige un archivo PDF.')
      return
    }
    setSaving(true)
    try {
      if (editingId === 'new' && file) {
        await uploadMaterial(file, {
          title: form.title,
          description: form.description,
          category: form.category,
        })
        toast.success('Material subido.')
      } else if (editingId && editingId !== 'new') {
        await updateMaterial(editingId, {
          title: form.title,
          description: form.description,
          category: form.category,
        })
        toast.success('Material actualizado.')
      }
      await refresh()
      close()
    } catch (err) {
      console.error(err)
      toast.error('No se pudo guardar el material.')
    }
    setSaving(false)
  }

  const togglePublished = async (m: MaterialItem) => {
    setBusyId(m.id)
    try {
      await setMaterialPublished(m.id, !m.published)
      await refresh()
      toast.success(m.published ? 'Material oculto.' : 'Material publicado.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo actualizar.')
    }
    setBusyId(null)
  }

  const remove = async (m: MaterialItem) => {
    if (!window.confirm(`¿Eliminar "${m.title}"?`)) return
    setBusyId(m.id)
    try {
      await deleteMaterial(m)
      await refresh()
      toast.success('Material eliminado.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo eliminar.')
    }
    setBusyId(null)
  }

  const openPdf = async (m: MaterialItem) => {
    setBusyId(m.id)
    try {
      const url = await getViewUrl(m.path)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo abrir el PDF.')
    }
    setBusyId(null)
  }

  return (
    <div>
      <PageHeader
        title="Material"
        action={
          canEdit ? (
            <button onClick={openNew} className={primaryBtn}>
              <Plus className="w-4 h-4" aria-hidden="true" />
              Subir material
            </button>
          ) : undefined
        }
      />

      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
        PDFs para los miembros. Solo los <strong>publicados</strong> y con la cuenta aprobada se
        ven en el área de miembros.
      </p>

      <AsyncState
        status={status}
        isEmpty={items.length === 0}
        errorText="No se pudo cargar el material."
        emptyText="Aún no hay material. Sube el primero con “Subir material”."
      >
        {categories.map((cat) => (
          <section key={cat} className="mb-8">
            <h2 className="font-bold text-gray-900 dark:text-white mb-3">
              {albumLabel(cat)}{' '}
              <span className="text-sm font-normal text-gray-400 dark:text-slate-500">
                · {items.filter((i) => i.category === cat).length}
              </span>
            </h2>
            <ul className="space-y-2">
              {items
                .filter((i) => i.category === cat)
                .map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center gap-2 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-500" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{m.title}</p>
                      {m.description && (
                        <p className="text-sm text-gray-500 dark:text-slate-400 truncate">
                          {m.description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => openPdf(m)}
                      disabled={busyId === m.id}
                      aria-label="Abrir PDF"
                      title="Abrir PDF"
                      className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-60"
                    >
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </button>

                    {canEdit && (
                      <button
                        onClick={() => togglePublished(m)}
                        disabled={busyId === m.id}
                        title={m.published ? 'Publicado (clic para ocultar)' : 'Oculto (clic para publicar)'}
                        className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors disabled:opacity-60 ${
                          m.published
                            ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300'
                            : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {m.published ? (
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                      </button>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => openEdit(m)}
                        aria-label={`Editar ${m.title}`}
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                      >
                        <Pencil className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => remove(m)}
                        disabled={busyId === m.id}
                        aria-label={`Eliminar ${m.title}`}
                        className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-60"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    )}
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </AsyncState>

      {/* Modal alta/edición */}
      <Modal
        open={editingId !== null}
        onClose={close}
        title={editingId === 'new' ? 'Subir material' : 'Editar material'}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="mat-title" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Título
            </label>
            <input
              id="mat-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Categoría
            </label>
            <CategoryPicker
              value={form.category}
              onChange={(v) => setForm((f) => ({ ...f, category: v }))}
              options={categories}
              placeholder="Ej: Estudios, Cursos, Anuncios"
            />
          </div>
          <div>
            <label htmlFor="mat-desc" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Descripción (opcional)
            </label>
            <textarea
              id="mat-desc"
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={`${inputCls} resize-none`}
            />
          </div>

          {editingId === 'new' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
                Archivo PDF
              </label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-cyan-400 hover:text-cyan-500 transition-colors"
              >
                <FileText className="w-5 h-5" aria-hidden="true" />
                {file ? file.name : 'Elegir PDF'}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          <button
            onClick={save}
            disabled={saving || !form.title.trim() || (editingId === 'new' && !file)}
            className={primaryBtnBlock}
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : 'Guardar'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
