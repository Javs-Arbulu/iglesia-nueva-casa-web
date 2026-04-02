import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls to the top of the page on every route change.
 * Useful for pages that need to always start at the top.
 */
export function useScrollTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
}

/**
 * Scrolls to a given hash anchor when the URL contains one,
 * otherwise scrolls to the top of the page.
 *
 * @param hash - The hash to scroll to (e.g. '#adn').
 *               Defaults to the current location hash.
 */
export function useScrollToHash(hash?: string) {
  const location = useLocation()
  const targetHash = hash ?? location.hash

  useEffect(() => {
    if (!targetHash) return

    const id = targetHash.replace('#', '')
    const el = document.getElementById(id)

    if (el) {
      // Small delay to ensure DOM has settled after navigation
      const timer = setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [targetHash])
}
