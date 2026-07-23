import { Fragment } from 'react'
import { Megaphone } from 'lucide-react'
import { useSiteContent } from '@/hooks/useSiteContent'

/** Cuántas veces se repite el mensaje por grupo (para llenar la barra). */
const REPEATS = 6

/**
 * Banner de anuncios editable desde el admin. Barra inferior fija (no choca con
 * el navbar superior) que NO se puede cerrar y muestra el texto en marquesina
 * (bucle continuo, siempre lleno). Solo aparece si está activado y tiene texto.
 */
export default function AnnouncementBanner() {
  const { announcement } = useSiteContent()

  if (!announcement.enabled || !announcement.text.trim()) {
    return null
  }

  const { text } = announcement
  // El enlace REDIRIGE a una URL/destino (no es un ancla de sección de la
  // página): una URL externa se normaliza a https:// y abre en pestaña nueva;
  // una ruta interna ("/contacto") navega a esa página.
  const raw = announcement.link?.trim() ?? ''
  const href = raw
    ? /^https?:\/\//i.test(raw)
      ? raw
      : raw.startsWith('/')
        ? raw
        : `https://${raw}`
    : null
  const external = href ? /^https?:\/\//i.test(href) : false

  // Una unidad = mensaje + separador. El track (visual, decorativo) repite dos
  // grupos idénticos para el loop -50%; la accesibilidad se cubre aparte.
  const message = href ? (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel="noopener noreferrer"
      tabIndex={-1}
      className="underline underline-offset-2"
    >
      {text}
    </a>
  ) : (
    <span>{text}</span>
  )

  const group = (key: string) =>
    Array.from({ length: REPEATS }, (_, i) => (
      <Fragment key={`${key}-${i}`}>
        <span className="px-6">{message}</span>
        <span className="text-white/50" aria-hidden="true">
          •
        </span>
      </Fragment>
    ))

  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 bg-cyan-500 text-white shadow-lg dark:bg-cyan-800 dark:text-cyan-50 dark:border-t dark:border-white/10"
      role="region"
      aria-label="Anuncio"
    >
      <div className="flex items-center py-3">
        <Megaphone className="w-5 h-5 shrink-0 ml-4 mr-2" aria-hidden="true" />
        {/* Copia accesible (una sola vez) para lectores de pantalla */}
        <span className="sr-only">
          {href ? (
            <a href={href} target={external ? '_blank' : undefined} rel="noopener noreferrer">
              {text}
            </a>
          ) : (
            text
          )}
        </span>
        {/* Marquesina visual (decorativa) */}
        <div
          className="marquee flex-1 min-w-0"
          aria-hidden="true"
          style={{ ['--marquee-duration' as string]: `${announcement.speed}s` }}
        >
          <div className="marquee__track text-sm font-medium">
            {group('a')}
            {group('b')}
          </div>
        </div>
      </div>
    </div>
  )
}
