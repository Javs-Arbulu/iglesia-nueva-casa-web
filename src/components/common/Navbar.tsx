import { useState, useEffect, useCallback } from 'react'
import { Menu, X, House } from 'lucide-react'
import logoUrl from '@/assets/images/logo-claro-navbar.png'
import logoWebP from '@/assets/images/logo-claro-navbar.webp'
import logoDarkUrl from '@/assets/images/logo.png'
import logoDarkWebP from '@/assets/images/logo.webp'
import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { NAV_LINKS } from '@/lib/constants'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 200)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // Close mobile menu when the user navigates to a new route.
  // Handled via onClick on each Link — no effect needed.

  const isTransparent = isHome && !isScrolled && !isMobileMenuOpen

  // Colores según el contexto: transparente (sobre el hero oscuro) → siempre
  // claros; sólido → se adaptan al tema (oscuros en claro, claros en oscuro).
  const linkColor = isTransparent
    ? 'text-white/90 hover:text-cyan-400'
    : 'text-gray-700 hover:text-cyan-600 dark:text-white/90 dark:hover:text-cyan-400'

  const controlColor = isTransparent
    ? 'text-white/90 hover:text-cyan-400 hover:bg-white/10'
    : 'text-gray-700 hover:text-cyan-600 hover:bg-black/5 dark:text-white/90 dark:hover:text-cyan-400 dark:hover:bg-white/10'

  const brandColor = isTransparent ? 'text-white' : 'text-gray-900 dark:text-white'

  return (
    <nav
      aria-label="Navegación principal"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/70 dark:border-slate-800/70'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 transition-transform duration-300 group-hover:scale-110">
              {/* Logo claro: sobre el hero o en modo oscuro */}
              <picture className={isTransparent ? 'block' : 'hidden dark:block'}>
                <source srcSet={logoWebP} type="image/webp" />
                <img
                  src={logoUrl}
                  alt="Logo Iglesia Nueva Casa"
                  className="w-full h-full object-contain"
                  width={48}
                  height={48}
                />
              </picture>
              {/* Logo oscuro: navbar claro sólido (modo claro) */}
              <picture className={isTransparent ? 'hidden' : 'block dark:hidden'}>
                <source srcSet={logoDarkWebP} type="image/webp" />
                <img
                  src={logoDarkUrl}
                  alt=""
                  className="w-full h-full object-contain"
                  width={48}
                  height={48}
                />
              </picture>
            </div>
            <span
              className={`text-lg md:text-2xl font-bold group-hover:text-cyan-400 transition-colors ${brandColor}`}
            >
              NUEVA CASA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className={`${linkColor} transition-colors duration-200 font-medium text-sm uppercase tracking-wider`}
                  aria-current={
                    location.pathname === link.href ? 'page' : undefined
                  }
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Portal admin + tema (desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle className={controlColor} />
            <Link
              to="/admin"
              aria-label="Portal administrativo"
              title="Portal administrativo"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-400 hover:bg-cyan-500 text-black transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-400/30"
            >
              <House className="w-5 h-5" aria-hidden="true" />
            </Link>
          </div>

          {/* Portal admin + tema + menú (móvil) */}
          <div className="flex items-center gap-1 md:hidden">
            <ThemeToggle className={controlColor} />
            <Link
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Portal administrativo"
              title="Portal administrativo"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-cyan-400 hover:bg-cyan-500 text-black transition-colors"
            >
              <House className="w-5 h-5" aria-hidden="true" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={`${controlColor} p-2 rounded-lg transition-colors`}
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-white/10">
          <nav className="container mx-auto px-4 py-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-cyan-600 dark:text-white/90 dark:hover:text-cyan-400 transition-colors duration-200 font-medium text-base uppercase tracking-wider py-2"
                aria-current={
                  location.pathname === link.href ? 'page' : undefined
                }
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
