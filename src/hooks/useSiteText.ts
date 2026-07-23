import { useEffect, useState } from 'react'
import { loadContent } from '@/services/content'
import {
  pickHomeText,
  pickNosotrosText,
  pickMinisteriosText,
  DEFAULT_HOME,
  DEFAULT_NOSOTROS,
  DEFAULT_MINISTERIOS,
  type HomeText,
  type NosotrosText,
  type MinisteriosText,
} from '@/services/siteText'

/**
 * Textos editables de una pantalla. Arranca con los valores por defecto (sin
 * parpadeo) y se actualiza con lo guardado en la base. Comparte la caché de
 * contenido con el resto del sitio.
 */
function useScreenText<T>(
  fallback: T,
  pick: (blocks: Record<string, unknown>) => T
): T {
  const [text, setText] = useState<T>(fallback)
  useEffect(() => {
    let active = true
    loadContent().then((blocks) => {
      if (active) setText(pick(blocks))
    })
    return () => {
      active = false
    }
  }, [pick])
  return text
}

export const useHomeText = (): HomeText => useScreenText(DEFAULT_HOME, pickHomeText)
export const useNosotrosText = (): NosotrosText =>
  useScreenText(DEFAULT_NOSOTROS, pickNosotrosText)
export const useMinisteriosText = (): MinisteriosText =>
  useScreenText(DEFAULT_MINISTERIOS, pickMinisteriosText)
