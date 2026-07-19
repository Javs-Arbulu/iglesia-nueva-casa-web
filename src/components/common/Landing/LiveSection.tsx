import { useEffect, useState } from 'react'
import { Radio, Youtube, CalendarClock } from 'lucide-react'
import { fetchLiveStatus } from '@/services/youtube'
import { SOCIAL_HREFS, CHURCH_INFO } from '@/lib/constants'
import type { LiveStatus } from '@/types'

/**
 * Sección "En vivo" del Home. Detecta si el canal está transmitiendo:
 * - En vivo → embebe la transmisión actual.
 * - Fuera de aire → muestra un placeholder de marca con el próximo horario.
 */
export default function LiveSection() {
  const [status, setStatus] = useState<LiveStatus>({ live: false })

  useEffect(() => {
    const controller = new AbortController()
    fetchLiveStatus(controller.signal)
      .then(setStatus)
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err)
      })
    return () => controller.abort()
  }, [])

  const nextService = CHURCH_INFO.schedules[0]

  return (
    <section
      aria-label="Transmisión en vivo"
      className="py-20 bg-slate-900 relative overflow-hidden"
    >
      <div
        className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        <header className="text-center mb-10">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-4 uppercase tracking-wide border ${
              status.live
                ? 'bg-red-500/20 border-red-400/40 text-red-300'
                : 'bg-white/10 border-white/20 text-gray-300'
            }`}
          >
            <Radio
              className={`w-4 h-4 ${status.live ? 'animate-pulse' : ''}`}
              aria-hidden="true"
            />
            {status.live ? 'En vivo ahora' : 'En vivo'}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {status.live
              ? 'Estamos transmitiendo'
              : 'Acompáñanos en el servicio'}
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            {status.live
              ? '¡Únete ahora mismo a la transmisión en vivo!'
              : `Transmitimos nuestros servicios por YouTube. Vuelve ${nextService.day.toLowerCase()} a las ${nextService.time}.`}
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          {status.live && status.videoId ? (
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${status.videoId}?autoplay=0`}
                title="Transmisión en vivo de la Iglesia Nueva Casa"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          ) : (
            /* Placeholder de marca cuando no hay transmisión */
            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center text-center px-6">
              <div
                className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-5"
                aria-hidden="true"
              >
                <CalendarClock className="w-8 h-8 text-cyan-400" />
              </div>
              <p className="text-white text-lg md:text-xl font-semibold mb-1">
                No hay transmisión en este momento
              </p>
              <p className="text-gray-400">
                {nextService.name} · {nextService.day} {nextService.time}
              </p>
            </div>
          )}

          <div className="text-center mt-8">
            <a
              href={SOCIAL_HREFS.youtubeLive}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-4 rounded-full transition-colors shadow-lg"
            >
              <Youtube className="w-5 h-5" aria-hidden="true" />
              {status.live ? 'Abrir en YouTube' : 'Ver transmisiones en YouTube'}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
