import { useEffect, useState } from 'react'
import {
  loadContent,
  pickAnnouncement,
  pickContact,
  defaults,
  type Announcement,
  type ContactContent,
} from '@/services/content'

/**
 * Contenido editable del sitio (anuncio + datos de contacto). Arranca con los
 * valores por defecto (sin parpadeo) y se actualiza con los de la base.
 */
export function useSiteContent(): {
  announcement: Announcement
  contact: ContactContent
} {
  const [announcement, setAnnouncement] = useState<Announcement>(
    defaults.announcement
  )
  const [contact, setContact] = useState<ContactContent>(defaults.contact)

  useEffect(() => {
    let active = true
    loadContent().then((blocks) => {
      if (!active) return
      setAnnouncement(pickAnnouncement(blocks))
      setContact(pickContact(blocks))
    })
    return () => {
      active = false
    }
  }, [])

  return { announcement, contact }
}
