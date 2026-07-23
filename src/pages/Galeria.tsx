import { useEffect, useMemo, useState } from 'react'
import { Loader2, ArrowLeft, Images } from 'lucide-react'
import { useScrollTop } from '@/hooks/useScroll'
import { fetchGallery, mediaUrl } from '@/services/media'
import type { MediaItem } from '@/types'
import Modal from '@/components/common/Modal'
import SEO from '@/components/common/SEO'

type Status = 'loading' | 'success' | 'error'

const albumLabel = (c: string) => c.charAt(0).toUpperCase() + c.slice(1)

interface Album {
  name: string
  cover: MediaItem
  count: number
}

export default function Galeria() {
  useScrollTop()
  const [items, setItems] = useState<MediaItem[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [zoom, setZoom] = useState<MediaItem | null>(null)
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetchGallery()
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
  }, [])

  // Álbumes (por categoría) con portada = primera foto y conteo.
  const albums = useMemo<Album[]>(() => {
    const map = new Map<string, MediaItem[]>()
    for (const it of items) {
      const list = map.get(it.category) ?? []
      list.push(it)
      map.set(it.category, list)
    }
    return [...map.entries()]
      .map(([name, list]) => ({ name, cover: list[0], count: list.length }))
      .sort((a, b) => a.name.localeCompare(b.name, 'es'))
  }, [items])

  // Con un solo álbum no tiene sentido la capa de portadas: entramos directo.
  const singleAlbum = albums.length === 1
  const effectiveAlbum = singleAlbum ? albums[0].name : selectedAlbum
  const showAlbumGrid = albums.length > 1 && selectedAlbum === null
  const albumPhotos = effectiveAlbum
    ? items.filter((i) => i.category === effectiveAlbum)
    : []

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-32 pb-16">
      <SEO
        title="Galería | Iglesia Nueva Casa"
        description="Momentos de la comunidad de la Iglesia Nueva Casa en Lima."
        url="https://nuevacasa.pe/galeria"
      />
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <div className="inline-block bg-cyan-100 text-cyan-600 px-4 py-2 rounded-full text-sm font-semibold mb-4 uppercase tracking-wide">
          Nuestra comunidad
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          Galería
        </h1>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mb-4" />
            <p>Cargando fotos…</p>
          </div>
        )}
        {status === 'error' && (
          <p className="text-center text-gray-500 dark:text-slate-400 py-24">
            No pudimos cargar la galería.
          </p>
        )}
        {status === 'success' && items.length === 0 && (
          <p className="text-center text-gray-500 dark:text-slate-400 py-24">
            Pronto compartiremos fotos de nuestra comunidad.
          </p>
        )}

        {/* Vista de álbumes (portadas) */}
        {status === 'success' && showAlbumGrid && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {albums.map((al) => (
              <li key={al.name}>
                <button
                  onClick={() => setSelectedAlbum(al.name)}
                  className="group block w-full text-left rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <img
                      src={mediaUrl(al.cover.path)}
                      alt={al.cover.alt ?? ''}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />
                    <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/60 text-white text-[11px] font-semibold px-2 py-0.5">
                      <Images className="w-3 h-3" aria-hidden="true" />
                      {al.count}
                    </span>
                  </div>
                  <p className="p-3 font-bold text-gray-900 dark:text-white truncate">
                    {albumLabel(al.name)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Vista de un álbum (sus fotos) */}
        {status === 'success' && !showAlbumGrid && albumPhotos.length > 0 && (
          <>
            {!singleAlbum && (
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Volver a álbumes
                </button>
                <span className="text-gray-300 dark:text-slate-600" aria-hidden="true">
                  /
                </span>
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {albumLabel(effectiveAlbum as string)}
                </h2>
              </div>
            )}
            <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {albumPhotos.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setZoom(item)}
                    className="block w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                    aria-label={item.alt ?? 'Ver foto'}
                  >
                    <img
                      src={mediaUrl(item.path)}
                      alt={item.alt ?? ''}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <Modal open={!!zoom} onClose={() => setZoom(null)} title="Foto">
        {zoom && (
          <img
            src={mediaUrl(zoom.path)}
            alt={zoom.alt ?? ''}
            className="w-full h-auto rounded-xl"
          />
        )}
      </Modal>
    </main>
  )
}
