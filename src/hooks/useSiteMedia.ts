import { useEffect, useState } from 'react'
import { loadContent, pickSiteMedia, type SiteMedia } from '@/services/content'

const EMPTY: SiteMedia = {
  hero: null,
  volunteering: null,
  nosotros: null,
  carousel: null,
}

/**
 * Overrides de imágenes del sitio (carrusel, Hero, voluntariado). Arranca vacío
 * (cada componente usa su imagen por defecto) y se actualiza con lo guardado en
 * la base. Comparte la caché de contenido con el resto del sitio.
 */
export function useSiteMedia(): SiteMedia {
  const [media, setMedia] = useState<SiteMedia>(EMPTY)

  useEffect(() => {
    let active = true
    loadContent().then((blocks) => {
      if (active) setMedia(pickSiteMedia(blocks))
    })
    return () => {
      active = false
    }
  }, [])

  return media
}
