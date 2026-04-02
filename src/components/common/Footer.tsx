import { MapPin, Clock, Instagram, Youtube, Facebook } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EXPLORE_LINKS, SOCIAL_HREFS, CHURCH_INFO } from '@/lib/constants'
import type { SocialLink } from '@/types'

const socialLinks: SocialLink[] = [
  {
    icon: <Instagram className="w-5 h-5" aria-hidden="true" />,
    href: SOCIAL_HREFS.instagram,
    label: 'Instagram',
  },
  {
    icon: <Youtube className="w-5 h-5" aria-hidden="true" />,
    href: SOCIAL_HREFS.youtube,
    label: 'YouTube',
  },
  {
    icon: <Facebook className="w-5 h-5" aria-hidden="true" />,
    href: SOCIAL_HREFS.facebook,
    label: 'Facebook',
  },
]

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <p className="text-2xl font-bold">
                <span className="text-gray-900">NUEVA</span>{' '}
                <span className="text-cyan-400">CASA</span>
              </p>
            </div>

            {/* Location & Schedule */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                Ubicación &amp; Horarios
              </h3>

              <div className="flex items-start space-x-3 mb-4">
                <MapPin
                  className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1"
                  aria-hidden="true"
                />
                <address className="not-italic">
                  <p className="font-semibold text-gray-900 mb-1">
                    Nuestra Casa
                  </p>
                  <p className="text-gray-600 text-sm">
                    {CHURCH_INFO.address}
                    <br />
                    {CHURCH_INFO.city}
                  </p>
                </address>
              </div>

              <div className="flex items-start space-x-3">
                <Clock
                  className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">Reuniones</p>
                  <p className="text-gray-600 text-sm">
                    Domingos
                    <br />
                    11AM - Presencial y Online
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
              Explorar
            </h3>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-cyan-400 transition-colors duration-200 inline-block"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-700 hover:text-cyan-400 transition-colors duration-200 inline-block"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Síguenos
              </h3>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={`Síguenos en ${social.label}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-cyan-400 flex items-center justify-center text-gray-700 hover:text-white transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 h-[300px]">
              <iframe
                src={CHURCH_INFO.mapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación de Iglesia Nueva Casa en Google Maps"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} Nueva Casa. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
