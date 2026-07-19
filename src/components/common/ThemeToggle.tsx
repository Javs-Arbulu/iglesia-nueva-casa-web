import { useState, useCallback } from 'react'
import { Moon, Sun } from 'lucide-react'

// La View Transitions API aún no está en todos los tipos de TS; la accedemos
// de forma segura con este tipo mínimo.
type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => { ready: Promise<void> }
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  } catch {
    /* localStorage puede fallar en modo privado — no es crítico */
  }
}

interface ThemeToggleProps {
  className?: string
}

/**
 * Botón de modo claro/oscuro con la animación de "revelado circular" usando la
 * View Transitions API (inspirado en theme-toggle.rdsx.dev): al pulsar, un
 * círculo se expande desde el botón revelando el nuevo tema. Degrada a un
 * cambio instantáneo si el navegador no soporta la API o si el usuario prefiere
 * menos movimiento.
 */
export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  const toggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const next = !isDark
      const switchTheme = () => {
        applyTheme(next)
        setIsDark(next)
      }

      const doc = document as DocumentWithViewTransition
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches

      if (!doc.startViewTransition || prefersReducedMotion) {
        switchTheme()
        return
      }

      // Centro del botón como origen del círculo.
      const { top, left, width, height } =
        event.currentTarget.getBoundingClientRect()
      const x = left + width / 2
      const y = top + height / 2
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      const transition = doc.startViewTransition(switchTheme)
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 500,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        )
      })
    },
    [isDark]
  )

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
      className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-colors ${className}`}
    >
      <Sun
        className={`w-5 h-5 transition-all duration-300 ${
          isDark
            ? 'rotate-90 scale-0 opacity-0'
            : 'rotate-0 scale-100 opacity-100'
        }`}
        aria-hidden="true"
      />
      <Moon
        className={`absolute w-5 h-5 transition-all duration-300 ${
          isDark
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        }`}
        aria-hidden="true"
      />
    </button>
  )
}
