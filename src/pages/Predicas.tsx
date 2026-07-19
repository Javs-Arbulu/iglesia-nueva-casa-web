import { useEffect, useState } from 'react'
import { Loader2, Youtube, AlertCircle } from 'lucide-react'
import { useScrollTop } from '@/hooks/useScroll'
import { fetchPredicas } from '@/services/youtube'
import { SOCIAL_HREFS } from '@/lib/constants'
import type { Predica } from '@/types'
import PredicaCard from '@/components/common/PredicaCard'
import SEO from '@/components/common/SEO'

type Status = 'loading' | 'success' | 'error'

export default function Predicas() {
  useScrollTop()

  const [predicas, setPredicas] = useState<Predica[]>([])
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    const controller = new AbortController()

    fetchPredicas(controller.signal)
      .then((videos) => {
        setPredicas(videos)
        setStatus('success')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.error(err)
        setStatus('error')
      })

    return () => controller.abort()
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-32 pb-16">
      <SEO
        title="Prédicas | Iglesia Nueva Casa"
        description="Mira las prédicas y servicios de la Iglesia Nueva Casa en Lima. Mensajes de esperanza y fe cada semana desde nuestro canal de YouTube."
        url="https://nuevacasa.pe/predicas"
      />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <div className="inline-block bg-cyan-100 text-cyan-600 px-4 py-2 rounded-full text-sm font-semibold mb-4 uppercase tracking-wide">
            Palabra que transforma
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Prédicas y Servicios
          </h1>
          <p className="text-gray-600 dark:text-slate-300 text-lg max-w-3xl mx-auto">
            Revive nuestros mensajes y servicios. Un espacio para crecer en fe
            desde donde estés.
          </p>
        </div>
      </header>

      {/* ── Contenido ──────────────────────────────────────────────────────── */}
      <section
        aria-label="Lista de prédicas"
        aria-busy={status === 'loading'}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500 dark:text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-cyan-400 mb-4" />
            <p>Cargando prédicas...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="max-w-lg mx-auto text-center bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-md">
            <AlertCircle
              className="w-12 h-12 text-red-400 mx-auto mb-4"
              aria-hidden="true"
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No pudimos cargar las prédicas
            </h2>
            <p className="text-gray-600 dark:text-slate-300 mb-6">
              Puedes verlas directamente en nuestro canal de YouTube.
            </p>
            <a
              href={SOCIAL_HREFS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <Youtube className="w-5 h-5" aria-hidden="true" />
              Ir al canal
            </a>
          </div>
        )}

        {status === 'success' && predicas.length === 0 && (
          <p className="text-center text-gray-500 dark:text-slate-400 py-24">
            Aún no hay prédicas publicadas.
          </p>
        )}

        {status === 'success' && predicas.length > 0 && (
          <>
            <ul
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              role="list"
            >
              {predicas.map((predica) => (
                <li key={predica.id}>
                  <PredicaCard predica={predica} />
                </li>
              ))}
            </ul>

            <div className="text-center">
              <a
                href={SOCIAL_HREFS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-lg"
              >
                <Youtube className="w-5 h-5" aria-hidden="true" />
                Ver más en YouTube
              </a>
            </div>
          </>
        )}
      </section>
    </main>
  )
}
