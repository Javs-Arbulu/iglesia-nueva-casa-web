import { useState, useEffect, useCallback } from 'react'
import { Menu, X } from 'lucide-react'
import logoUrl from '@/assets/images/logo-claro-navbar.png'
import logoWebP from '@/assets/images/logo-claro-navbar.webp'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '../ui/button'
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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const isTransparent = isHome && !isScrolled && !isMobileMenuOpen

  return (
    <nav
      aria-label="Navegación principal"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent
          ? 'bg-transparent'
          : 'bg-black/95 backdrop-blur-md shadow-lg'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 transition-transform duration-300 group-hover:scale-110">
              <picture>
                <source srcSet={logoWebP} type="image/webp" />
                <img
                  src={logoUrl}
                  alt="Logo Iglesia Nueva Casa"
                  className="w-full h-full object-contain"
                  width={48}
                  height={48}
                />
              </picture>
            </div>
            <span className="text-lg md:text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              NUEVA CASA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className="text-white/90 hover:text-cyan-400 transition-colors duration-200 font-medium text-sm uppercase tracking-wider"
                  aria-current={
                    location.pathname === link.href ? 'page' : undefined
                  }
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA Button Desktop */}
          <div className="hidden md:block">
            <Button
              asChild
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold rounded-full px-6 transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-400/30"
            >
              <Link to="/contacto">Ingresar</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
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

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="bg-black/95 backdrop-blur-md border-t border-white/10">
          <nav className="container mx-auto px-4 py-6 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="block text-white/90 hover:text-cyan-400 transition-colors duration-200 font-medium text-base uppercase tracking-wider py-2"
                aria-current={
                  location.pathname === link.href ? 'page' : undefined
                }
              >
                {link.name}
              </Link>
            ))}
            <Button
              asChild
              className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-semibold rounded-full py-6 transition-all duration-300 shadow-lg shadow-cyan-400/30 mt-4"
            >
              <Link to="/contacto">Ingresar</Link>
            </Button>
          </nav>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
