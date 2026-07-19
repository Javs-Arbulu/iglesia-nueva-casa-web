import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { fetchPredicas } from '@/services/youtube'
import type { Predica } from '@/types'
import PredicaCard from '@/components/common/PredicaCard'

/**
 * Sección del Home con las últimas 3 prédicas. Si falla la carga o no hay
 * videos, no renderiza nada (no rompe el Home).
 */
export default function PredicasRecientes() {
  const [predicas, setPredicas] = useState<Predica[]>([])

  useEffect(() => {
    const controller = new AbortController()
    fetchPredicas(controller.signal)
      .then((videos) => setPredicas(videos.slice(0, 3)))
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err)
      })
    return () => controller.abort()
  }, [])

  if (predicas.length === 0) return null

  return (
    <section
      aria-label="Últimas prédicas"
      className="py-20 bg-gray-50 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <div className="inline-block bg-cyan-100 text-cyan-600 px-4 py-2 rounded-full text-sm font-semibold mb-4 uppercase tracking-wide">
              Últimas prédicas
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Mensajes recientes
            </h2>
          </div>
          <Link
            to="/predicas"
            className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold whitespace-nowrap group"
          >
            Ver todas
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>
        </header>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
          {predicas.map((predica) => (
            <li key={predica.id}>
              <PredicaCard predica={predica} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
