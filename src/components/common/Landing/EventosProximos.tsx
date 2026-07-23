import { useEffect, useState } from 'react'
import { Calendar, MapPin } from 'lucide-react'
import { fetchRecentEvents, isPastEvent, formatEventDate } from '@/services/events'
import { useHomeText } from '@/hooks/useSiteText'
import type { Evento } from '@/types'

/**
 * Sección del Home con los eventos publicados. Muestra los próximos a color y
 * los ya realizados en blanco y negro (no los oculta). Si no hay (o falla), no
 * renderiza nada (no rompe el Home).
 */
export default function EventosProximos() {
  const [events, setEvents] = useState<Evento[]>([])
  const t = useHomeText().events

  useEffect(() => {
    let active = true
    fetchRecentEvents(3)
      .then((data) => {
        if (active) setEvents(data)
      })
      .catch((err) => console.error(err))
    return () => {
      active = false
    }
  }, [])

  if (events.length === 0) return null

  return (
    <section
      aria-label="Próximos eventos"
      className="pb-16 bg-white dark:bg-slate-900"
    >
      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <div className="inline-block bg-cyan-100 text-cyan-600 px-4 py-2 rounded-full text-sm font-semibold mb-4 uppercase tracking-wide">
            {t.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {t.title}
          </h2>
        </header>

        <ul
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
          role="list"
        >
          {events.map((ev) => {
            const past = isPastEvent(ev.starts_at)
            return (
              <li key={ev.id}>
                <article
                  className={`group h-full flex flex-col bg-gray-50 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-md transition-all duration-300 border border-gray-100 dark:border-slate-700 ${
                    past ? 'opacity-75' : 'hover:shadow-2xl hover:-translate-y-1'
                  }`}
                >
                  {/* Portada: imagen o degradado con la fecha (en gris si ya pasó) */}
                  <div
                    className={`relative aspect-video overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600 ${
                      past ? 'grayscale' : ''
                    }`}
                  >
                    {ev.image_url ? (
                      <img
                        src={ev.image_url}
                        alt=""
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          past ? '' : 'group-hover:scale-105'
                        }`}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <Calendar className="w-14 h-14 text-white/40" />
                      </div>
                    )}
                    <span
                      className={`absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full backdrop-blur px-3 py-1 text-xs font-semibold capitalize shadow-sm ${
                        past
                          ? 'bg-white/90 dark:bg-slate-900/90 text-gray-500 dark:text-slate-400'
                          : 'bg-white/90 dark:bg-slate-900/90 text-cyan-700 dark:text-cyan-300'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      {formatEventDate(ev.starts_at)}
                    </span>
                    {past && (
                      <span className="absolute top-3 right-3 rounded-full bg-gray-900/70 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
                        Finalizado
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col flex-1 p-5">
                    <h3
                      className={`text-lg font-bold mb-1 line-clamp-2 transition-colors ${
                        past
                          ? 'text-gray-600 dark:text-slate-400'
                          : 'text-gray-900 dark:text-white group-hover:text-cyan-600'
                      }`}
                    >
                      {ev.title}
                    </h3>
                    {ev.location && (
                      <p className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 mb-2">
                        <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span className="truncate">{ev.location}</span>
                      </p>
                    )}
                    {ev.description && (
                      <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {ev.description}
                      </p>
                    )}
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
