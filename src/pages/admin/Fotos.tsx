import { useCallback, useEffect, useRef, useState } from 'react'
import { Loader2, ImagePlus, Trash2, Eye, EyeOff } from 'lucide-react'
import {
  fetchMedia,
  uploadImage,
  deleteImage,
  setMediaPublished,
  mediaUrl,
} from '@/services/media'
import type { MediaItem } from '@/types'

type Status = 'loading' | 'success' | 'error'

export default function Fotos() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [uploading, setUploading] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(() => fetchMedia(), [])

  useEffect(() => {
    let active = true
    load()
      .then((d) => {
        if (!active) return
        setItems(d)
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
  }, [load])

  const refresh = async () => {
    try {
      setItems(await load())
    } catch (err) {
      console.error(err)
    }
  }

  const onFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploading(true)
    for (const f of files) {
      try {
        await uploadImage(f)
      } catch (err) {
        console.error('Error subiendo', f.name, err)
      }
    }
    await refresh()
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  const togglePublished = async (item: MediaItem) => {
    setBusyId(item.id)
    try {
      await setMediaPublished(item, !item.published)
      await refresh()
    } catch (err) {
      console.error(err)
    }
    setBusyId(null)
  }

  const remove = async (item: MediaItem) => {
    if (!window.confirm('¿Eliminar esta imagen?')) return
    setBusyId(item.id)
    try {
      await deleteImage(item)
      await refresh()
    } catch (err) {
      console.error(err)
    }
    setBusyId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Fotos</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold text-sm px-4 py-2 rounded-full transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="w-4 h-4" aria-hidden="true" />
          )}
          Subir fotos
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onFiles}
          className="hidden"
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
        Las imágenes se optimizan automáticamente al subir. Toca “Subir fotos”
        para elegirlas de tu galería o cámara.
      </p>

      {status === 'loading' && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 py-10">
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          Cargando…
        </div>
      )}
      {status === 'error' && (
        <p className="text-red-500">No se pudieron cargar las fotos.</p>
      )}
      {status === 'success' && items.length === 0 && (
        <p className="text-gray-500 dark:text-slate-400">Aún no hay fotos.</p>
      )}

      {status === 'success' && items.length > 0 && (
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
      )}
    </div>
  )
}
