import { useState } from 'react'
import { X, Megaphone } from 'lucide-react'
import { useSiteContent } from '@/hooks/useSiteContent'

/**
 * Banner de anuncios editable desde el admin. Barra inferior fija y descartable
 * (no choca con el navbar fijo superior). Solo aparece si está activado y tiene
 * texto.
 */
export default function AnnouncementBanner() {
  const { announcement } = useSiteContent()
  const [dismissed, setDismissed] = useState(() => {
    try {
      return sessionStorage.getItem('ann-dismissed') === '1'
    } catch {
      return false
    }
  })

  if (!announcement.enabled || !announcement.text.trim() || dismissed) {
    return null
  }

  const close = () => {
    setDismissed(true)
    try {
      sessionStorage.setItem('ann-dismissed', '1')
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-cyan-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center gap-3">
        <Megaphone className="w-5 h-5 shrink-0" aria-hidden="true" />
        <p className="flex-1 text-sm font-medium">
          {announcement.link ? (
            <a
              href={announcement.link}
              className="underline underline-offset-2"
              target={announcement.link.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
            >
              {announcement.text}
            </a>
          ) : (
            announcement.text
          )}
        </p>
        <button
          onClick={close}
          aria-label="Cerrar aviso"
          className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
