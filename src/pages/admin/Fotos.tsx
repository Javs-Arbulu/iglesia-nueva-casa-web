import { useMemo, useRef, useState } from 'react'
import { Loader2, ImagePlus, Trash2, Eye, EyeOff, Pencil, Plus, Check } from 'lucide-react'
import {
  fetchMedia,
  uploadImage,
  deleteImage,
  setMediaPublished,
  updateMedia,
  renameCategory,
  setCategoryPublished,
  mediaUrl,
} from '@/services/media'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/features/toast/context'
import { useAuth } from '@/features/auth/context'
import AsyncState from '@/components/admin/AsyncState'
import PageHeader from '@/components/admin/PageHeader'
import SiteMediaEditor from '@/components/admin/SiteMediaEditor'
import Modal from '@/components/common/Modal'
import { inputCls, primaryBtn, primaryBtnBlock } from '@/lib/adminUi'
import type { MediaItem } from '@/types'

const GALLERY_REC = 'Recomendado: 1200 px de ancho o más para que se vean nítidas.'
const MAX_BATCH = 10
const albumLabel = (c: string) => c.charAt(0).toUpperCase() + c.slice(1)

/**
 * Selector de álbum: desplegable con los álbumes existentes + opción para crear
 * uno nuevo (que abre un campo de texto). Si no hay álbumes aún, muestra
 * directamente el campo de texto.
 */
function AlbumField({
  value,
  onChange,
  albums,
  disabled = false,
}: {
  value: string
  onChange: (v: string) => void
  albums: string[]
  disabled?: boolean
}) {
  const [creatingNew, setCreatingNew] = useState(false)
  const isNew = albums.length === 0 || creatingNew || !albums.includes(value)

  return (
    <div className="space-y-2">
      {albums.length > 0 && (
        <select
          value={isNew ? '__new__' : value}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.value === '__new__') {
              setCreatingNew(true)
              onChange('')
            } else {
              setCreatingNew(false)
              onChange(e.target.value)
            }
          }}
          className={`${inputCls} disabled:opacity-60`}
        >
          {albums.map((a) => (
            <option key={a} value={a}>
              {albumLabel(a)}
            </option>
          ))}
          <option value="__new__">➕ Nuevo álbum…</option>
        </select>
      )}
      {isNew && (
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nombre del nuevo álbum"
          className={`${inputCls} disabled:opacity-60`}
        />
      )}
    </div>
  )
}

export default function Fotos() {
  const toast = useToast()
  const { can } = useAuth()
  const canEdit = can('fotos', 'edit')
  const canDelete = can('fotos', 'delete')
  const { data: items, status, refresh } = useAsyncData(fetchMedia, [] as MediaItem[])
  const [tab, setTab] = useState<'galeria' | 'pagina'>('galeria')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [filterAlbum, setFilterAlbum] = useState<string | null>(null)

  // Álbumes (categorías) presentes, con conteo.
  const albums = useMemo(() => {
    const map = new Map<string, number>()
    for (const it of items) map.set(it.category, (map.get(it.category) ?? 0) + 1)
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  }, [items])
  const albumNames = albums.map((a) => a.name)

  // Subida
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadAlbum, setUploadAlbum] = useState('galeria')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [sessionCount, setSessionCount] = useState(0)
  const uploadFileRef = useRef<HTMLInputElement>(null)

  // Edición de foto (alt + álbum)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAlt, setEditAlt] = useState('')
  const [editAlbum, setEditAlbum] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const editing = items.find((i) => i.id === editingId) ?? null

  // Renombrar álbum
  const [renaming, setRenaming] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [renamingBusy, setRenamingBusy] = useState(false)

  // Publicar / ocultar álbum completo
  const [albumBusy, setAlbumBusy] = useState<string | null>(null)
  const toggleAlbumPublished = async (album: string, next: boolean) => {
    setAlbumBusy(album)
    try {
      await setCategoryPublished(album, next)
      await refresh()
      toast.success(
        next
          ? `Álbum “${albumLabel(album)}” publicado.`
          : `Álbum “${albumLabel(album)}” oculto.`
      )
    } catch (err) {
      console.error(err)
      toast.error('No se pudo actualizar el álbum.')
    }
    setAlbumBusy(null)
  }

  const openUpload = (album?: string) => {
    setUploadAlbum(album ?? filterAlbum ?? 'galeria')
    setSessionCount(0)
    setProgress(null)
    setUploadOpen(true)
  }

  const onUploadFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let files = Array.from(e.target.files ?? [])
    if (uploadFileRef.current) uploadFileRef.current.value = ''
    if (files.length === 0) return
    let capped = false
    if (files.length > MAX_BATCH) {
      files = files.slice(0, MAX_BATCH)
      capped = true
    }
    const category = uploadAlbum.trim() || 'galeria'
    setUploading(true)
    setProgress({ done: 0, total: files.length })
    let ok = 0
    let failed = 0
    for (const f of files) {
      try {
        await uploadImage(f, { category })
        ok++
      } catch (err) {
        console.error('Error subiendo', f.name, err)
        failed++
      }
      setProgress((p) => (p ? { ...p, done: p.done + 1 } : p))
    }
    await refresh()
    setUploading(false)
    setProgress(null)
    setSessionCount((n) => n + ok)
    // El modal queda abierto: puedes seguir agregando fotos o cerrarlo.
    if (ok > 0)
      toast.success(`${ok} foto${ok > 1 ? 's' : ''} subida${ok > 1 ? 's' : ''} a “${albumLabel(category)}”.`)
    if (capped)
      toast.error(`Máximo ${MAX_BATCH} por tanda: se subieron las primeras ${MAX_BATCH}.`)
    if (failed > 0)
      toast.error(`No se pudieron subir ${failed} foto${failed > 1 ? 's' : ''}.`)
  }

  const openEdit = (item: MediaItem) => {
    setEditingId(item.id)
    setEditAlt(item.alt ?? '')
    setEditAlbum(item.category)
  }

  const saveEdit = async () => {
    if (!editing) return
    setSavingEdit(true)
    try {
      await updateMedia(editing.id, {
        alt: editAlt.trim() || null,
        category: editAlbum.trim() || 'galeria',
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

  const openRename = (album: string) => {
    setRenaming(album)
    setRenameValue(album)
  }

  const doRename = async () => {
    if (!renaming) return
    const next = renameValue.trim()
    if (!next || next === renaming) {
      setRenaming(null)
      return
    }
    setRenamingBusy(true)
    try {
      await renameCategory(renaming, next)
      await refresh()
      if (filterAlbum === renaming) setFilterAlbum(next)
      toast.success(`Álbum renombrado a “${albumLabel(next)}”.`)
      setRenaming(null)
    } catch (err) {
      console.error(err)
      toast.error('No se pudo renombrar el álbum.')
    }
    setRenamingBusy(false)
  }

  const renderTile = (item: MediaItem) => (
    <li
      key={item.id}
      className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-800"
    >
      <img
        src={mediaUrl(item.path)}
        alt={item.alt ?? ''}
        loading="lazy"
        className={`w-full h-full object-cover ${item.published ? '' : 'opacity-50'}`}
      />
      {!item.published && (
        <span className="absolute top-2 left-2 text-[10px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded-full">
          Oculta
        </span>
      )}
      <div className="absolute bottom-2 right-2 flex gap-1">
        {canEdit && (
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
        )}
        {canEdit && (
        <button
          onClick={() => openEdit(item)}
          disabled={busyId === item.id}
          aria-label="Editar"
          title="Editar descripción y álbum"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 text-gray-700 dark:text-slate-200 shadow disabled:opacity-60"
        >
          <Pencil className="w-4 h-4" aria-hidden="true" />
        </button>
        )}
        {canDelete && (
        <button
          onClick={() => remove(item)}
          disabled={busyId === item.id}
          aria-label="Eliminar"
          title="Eliminar"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 dark:bg-slate-900/90 text-red-500 shadow disabled:opacity-60"
        >
          <Trash2 className="w-4 h-4" aria-hidden="true" />
        </button>
        )}
      </div>
    </li>
  )

  const visibleAlbums = filterAlbum
    ? albums.filter((a) => a.name === filterAlbum)
    : albums

  return (
    <div>
      <PageHeader
        title="Fotos"
        action={
          tab === 'galeria' && canEdit ? (
            <button onClick={() => openUpload()} className={primaryBtn}>
              <ImagePlus className="w-4 h-4" aria-hidden="true" />
              Subir fotos
            </button>
          ) : undefined
        }
      />

      {/* Pestañas (la de "Página" solo con permiso de edición) */}
      {canEdit && (
        <div className="inline-flex rounded-full bg-gray-100 dark:bg-slate-800 p-1 mb-5">
          {(['galeria', 'pagina'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                tab === t
                  ? 'bg-white dark:bg-slate-700 shadow text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-slate-400'
              }`}
            >
              {t === 'galeria' ? 'Galería' : 'Página'}
            </button>
          ))}
        </div>
      )}

      {tab === 'pagina' && canEdit && <SiteMediaEditor />}

      {tab === 'galeria' && (
        <>
          {/* Filtro por álbum */}
          {albums.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setFilterAlbum(null)}
                className={`text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  filterAlbum === null
                    ? 'bg-cyan-500 text-white border-cyan-500'
                    : 'bg-transparent text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-cyan-400'
                }`}
              >
                Todos
              </button>
              {albums.map((a) => (
                <button
                  key={a.name}
                  onClick={() => setFilterAlbum(a.name)}
                  className={`text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                    filterAlbum === a.name
                      ? 'bg-cyan-500 text-white border-cyan-500'
                      : 'bg-transparent text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700 hover:border-cyan-400'
                  }`}
                >
                  {albumLabel(a.name)} ({a.count})
                </button>
              ))}
            </div>
          )}

          <AsyncState
            status={status}
            isEmpty={items.length === 0}
            errorText="No se pudieron cargar las fotos."
            emptyText="Aún no hay fotos. Sube la primera con “Subir fotos”."
          >
            {visibleAlbums.map((al) => {
              const albumPhotos = items.filter((i) => i.category === al.name)
              const albumPublished =
                albumPhotos.length > 0 && albumPhotos.every((p) => p.published)
              return (
                <section key={al.name} className="mb-8">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h2 className="font-bold text-gray-900 dark:text-white">
                      {albumLabel(al.name)}{' '}
                      <span className="text-sm font-normal text-gray-400 dark:text-slate-500">
                        · {al.count} foto{al.count > 1 ? 's' : ''}
                      </span>
                    </h2>
                    {canEdit && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleAlbumPublished(al.name, !albumPublished)}
                        disabled={albumBusy === al.name}
                        title={
                          albumPublished
                            ? 'Álbum visible en la página (clic para ocultar)'
                            : 'Álbum oculto (clic para publicar)'
                        }
                        className={`inline-flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-full transition-colors disabled:opacity-60 ${
                          albumPublished
                            ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300'
                            : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {albumBusy === al.name ? (
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        ) : albumPublished ? (
                          <Check className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        )}
                        {albumPublished ? 'Publicado' : 'Publicar'}
                      </button>
                      <button
                        onClick={() => openUpload(al.name)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 px-2.5 py-1 rounded-full"
                      >
                        <Plus className="w-4 h-4" aria-hidden="true" />
                        Agregar
                      </button>
                      <button
                        onClick={() => openRename(al.name)}
                        className="text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 px-2.5 py-1 rounded-full"
                      >
                        Renombrar
                      </button>
                    </div>
                    )}
                  </div>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {albumPhotos.map(renderTile)}
                  </ul>
                </section>
              )
            })}
          </AsyncState>
        </>
      )}

      {/* Modal: subir fotos a un álbum */}
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Subir fotos">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Álbum
            </label>
            <AlbumField
              value={uploadAlbum}
              onChange={setUploadAlbum}
              albums={albumNames}
              disabled={uploading}
            />
            <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
              Elige un álbum o crea uno nuevo. {GALLERY_REC}
            </p>
          </div>

          {progress ? (
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-slate-200">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Subiendo {progress.done}/{progress.total}…
              </p>
              <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-500 transition-all"
                  style={{
                    width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={() => uploadFileRef.current?.click()}
              className={primaryBtnBlock}
            >
              <ImagePlus className="w-5 h-5" aria-hidden="true" />
              {sessionCount > 0 ? 'Agregar más fotos' : 'Elegir fotos'}
            </button>
          )}

          <p className="text-center text-xs text-gray-400 dark:text-slate-500">
            Hasta {MAX_BATCH} fotos por tanda. Puedes repetir para subir más.
          </p>

          {sessionCount > 0 && !progress && (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-700 dark:text-green-300">
              <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
              {sessionCount} foto{sessionCount > 1 ? 's' : ''} subida
              {sessionCount > 1 ? 's' : ''} en esta sesión.
            </div>
          )}

          <input
            ref={uploadFileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onUploadFiles}
            className="hidden"
          />

          {sessionCount > 0 && !progress && (
            <button
              onClick={() => setUploadOpen(false)}
              className="w-full py-2.5 rounded-full font-semibold text-sm bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 transition-colors"
            >
              Listo
            </button>
          )}
        </div>
      </Modal>

      {/* Modal: editar foto */}
      <Modal open={!!editing} onClose={() => setEditingId(null)} title="Editar foto">
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
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
                Álbum
              </label>
              <AlbumField
                value={editAlbum}
                onChange={setEditAlbum}
                albums={albumNames}
              />
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

      {/* Modal: renombrar álbum */}
      <Modal open={!!renaming} onClose={() => setRenaming(null)} title="Renombrar álbum">
        <div className="space-y-4">
          <div>
            <label htmlFor="rename-album" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Nuevo nombre
            </label>
            <input
              id="rename-album"
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className={inputCls}
            />
            <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
              Se moverán todas las fotos de este álbum al nuevo nombre.
            </p>
          </div>
          <button onClick={doRename} disabled={renamingBusy} className={primaryBtnBlock}>
            {renamingBusy ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              'Renombrar'
            )}
          </button>
        </div>
      </Modal>
    </div>
  )
}
