'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import logoUrl from '@/assets/images/logo-claro-navbar.png'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? 'bg-black/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110">
              <img
                src={logoUrl}
                alt="Iglesia Joven Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-lg md:text-2xl font-bold">
              <span className="text-white group-hover:text-cyan-400 transition-colors">
                NUEVA CASA
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/90 hover:text-cyan-400 transition-colors duration-200 font-medium text-sm uppercase tracking-wider"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Button Desktop */}
          <div className="hidden md:block">
            {/* <Button className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold rounded-full px-6 transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-400/30">
              Visítanos
            </Button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="bg-black/95 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-white/90 hover:text-cyan-400 transition-colors duration-200 font-medium text-base uppercase tracking-wider py-2"
              >
                {link.name}
              </a>
            ))}
            {/* <Button className="w-full bg-cyan-400 hover:bg-cyan-500 text-black font-semibold rounded-full py-6 transition-all duration-300 shadow-lg shadow-cyan-400/30 mt-4">
              Visítanos
            </Button> */}
          </div>
        </div>
      </div>
    </nav>
  )
}

const navLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Nosotros', href: '#nosotros' },
  { name: 'Eventos', href: '#eventos' },
  { name: 'Ministerios', href: '#ministerios' },
  { name: 'Contacto', href: '/contacto' },
]

export default Navbar
