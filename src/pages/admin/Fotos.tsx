import { useRef, useState } from 'react'
import { Loader2, ImagePlus, Trash2, Eye, EyeOff, Pencil } from 'lucide-react'
import {
  fetchMedia,
  uploadImage,
  deleteImage,
  setMediaPublished,
  updateMedia,
  mediaUrl,
} from '@/services/media'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/features/toast/context'
import AsyncState from '@/components/admin/AsyncState'
import PageHeader from '@/components/admin/PageHeader'
import Modal from '@/components/common/Modal'
import { inputCls, primaryBtn, primaryBtnBlock } from '@/lib/adminUi'
import type { MediaItem } from '@/types'

const CATEGORIES = ['galeria', 'eventos', 'ministerios']

export default function Fotos() {
  const toast = useToast()
  const { data: items, status, refresh } = useAsyncData(fetchMedia, [] as MediaItem[])
  const [uploading, setUploading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Edición de alt / categoría en modal.
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAlt, setEditAlt] = useState('')
  const [editCategory, setEditCategory] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const editing = items.find((i) => i.id === editingId) ?? null

  const openEdit = (item: MediaItem) => {
    setEditingId(item.id)
    setEditAlt(item.alt ?? '')
    setEditCategory(item.category)
  }

  const saveEdit = async () => {
    if (!editing) return
    setSavingEdit(true)
    try {
      await updateMedia(editing.id, {
        alt: editAlt.trim() || null,
        category: editCategory.trim() || 'galeria',
      })
      await refresh()
      toast.success('Foto actualizada.')
      setEditingId(null)
    } catch (err) {
      console.error(err)
      toast.error('No se pudo actualizar la foto.')
    }
    setSavingEdit(false)
  }

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploading(true)
    let ok = 0
    let failed = 0
    for (const f of files) {
      try {
        await uploadImage(f)
        ok++
      } catch (err) {
        console.error('Error subiendo', f.name, err)
        failed++
      }
    }
    await refresh()
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
    if (ok > 0) toast.success(`${ok} foto${ok > 1 ? 's' : ''} subida${ok > 1 ? 's' : ''}.`)
    if (failed > 0) toast.error(`No se pudieron subir ${failed} foto${failed > 1 ? 's' : ''}.`)
  }

  const togglePublished = async (item: MediaItem) => {
    setBusyId(item.id)
    try {
      await setMediaPublished(item, !item.published)
      await refresh()
      toast.success(item.published ? 'Foto ocultada.' : 'Foto publicada.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo actualizar la foto.')
    }
    setBusyId(null)
  }

  const remove = async (item: MediaItem) => {
    if (!window.confirm('¿Eliminar esta imagen?')) return
    setBusyId(item.id)
    try {
      await deleteImage(item)
      await refresh()
      toast.success('Foto eliminada.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo eliminar la foto.')
    }
    setBusyId(null)
  }

  return (
    <div>
      <PageHeader
        title="Fotos"
        action={
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className={primaryBtn}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImagePlus className="w-4 h-4" aria-hidden="true" />
            )}
            Subir fotos
          </button>
        }
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onFiles}
        className="hidden"
      />

      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
        Las imágenes se optimizan automáticamente al subir. Toca “Subir fotos”
        para elegirlas de tu galería o cámara.
      </p>

      <AsyncState
        status={status}
        isEmpty={items.length === 0}
        errorText="No se pudieron cargar las fotos."
        emptyText="Aún no hay fotos."
      >
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-800"
            >
              <img
                src={mediaUrl(item.path)}
                alt={item.alt ?? ''}
                loading="lazy"
                className={`w-full h-full object-cover ${
                  item.published ? '' : 'opacity-50'
                }`}
              />
              {!item.published && (
                <span className="absolute top-2 left-2 text-[10px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded-full">
                  Oculta
                </span>
              )}
              <div className="absolute bottom-2 right-2 flex gap-1">
                <button
                  onClick={() => togglePublished(item)}
                  disabled={busyId === item.id}
                  aria-label={item.published ? 'Ocultar' : 'Publicar'}
                  title={item.published ? 'Ocultar' : 'Publicar'}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-slate-200 shadow disabled:opacity-60"
                >
                  {item.published ? (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
                <button
                  onClick={() => openEdit(item)}
                  disabled={busyId === item.id}
                  aria-label="Editar"
                  title="Editar descripción y categoría"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-slate-200 shadow disabled:opacity-60"
                >
                  <Pencil className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => remove(item)}
                  disabled={busyId === item.id}
                  aria-label="Eliminar"
                  title="Eliminar"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 text-red-500 shadow disabled:opacity-60"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </AsyncState>

      <Modal
        open={!!editing}
        onClose={() => setEditingId(null)}
        title="Editar foto"
      >
        {editing && (
          <div className="space-y-4">
            <img
              src={mediaUrl(editing.path)}
              alt={editing.alt ?? ''}
              className="w-full max-h-56 object-contain rounded-xl bg-gray-100 dark:bg-slate-800"
            />
            <div>
              <label htmlFor="edit-alt" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
                Descripción (texto alternativo)
              </label>
              <input
                id="edit-alt"
                type="text"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
                placeholder="Ej: Bautismos en el servicio dominical"
                className={inputCls}
              />
              <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                Ayuda a la accesibilidad y al SEO de la galería.
              </p>
            </div>
            <div>
              <label htmlFor="edit-cat" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
                Categoría
              </label>
              <input
                id="edit-cat"
                list="media-cats"
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className={inputCls}
              />
              <datalist id="media-cats">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <button onClick={saveEdit} disabled={savingEdit} className={primaryBtnBlock}>
              {savingEdit ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                'Guardar'
              )}
            </button>
          </div>
        )}
      </Modal>
    </div>
  )
}
