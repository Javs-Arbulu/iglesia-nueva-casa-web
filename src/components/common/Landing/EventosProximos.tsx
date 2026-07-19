import { useEffect, useState } from 'react'
import { Calendar, MapPin } from 'lucide-react'
import { fetchUpcomingEvents, formatEventDate } from '@/services/events'
import type { Evento } from '@/types'

/**
 * Sección del Home con los próximos eventos publicados. Si no hay (o falla),
 * no renderiza nada (no rompe el Home).
 */
export default function EventosProximos() {
  const [events, setEvents] = useState<Evento[]>([])

  useEffect(() => {
    let active = true
    fetchUpcomingEvents(4)
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
      className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <div className="inline-block bg-cyan-100 text-cyan-600 px-4 py-2 rounded-full text-sm font-semibold mb-4 uppercase tracking-wide">
            Agenda
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Próximos eventos
          </h2>
        </header>

        <ul className="grid sm:grid-cols-2 gap-4 max-w-4xl mx-auto" role="list">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-5 border border-gray-100 dark:border-slate-700"
            >
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-2 capitalize">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                {formatEventDate(ev.starts_at)}
              </p>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                {ev.title}
              </h3>
              {ev.location && (
                <p className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 mb-2">
                  <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {ev.location}
                </p>
              )}
              {ev.description && (
                <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {ev.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
