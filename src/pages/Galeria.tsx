import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useScrollTop } from '@/hooks/useScroll'
import { fetchGallery, mediaUrl } from '@/services/media'
import type { MediaItem } from '@/types'
import Modal from '@/components/common/Modal'
import SEO from '@/components/common/SEO'

type Status = 'loading' | 'success' | 'error'

export default function Galeria() {
  useScrollTop()
  const [items, setItems] = useState<MediaItem[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [zoom, setZoom] = useState<MediaItem | null>(null)

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
        {status === 'success' && items.length > 0 && (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map((item) => (
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
