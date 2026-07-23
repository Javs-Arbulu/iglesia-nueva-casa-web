import { MapPin, Clock, Instagram, Youtube, Facebook } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EXPLORE_LINKS, SOCIAL_HREFS, CHURCH_INFO } from '@/lib/constants'
import { useSiteContent } from '@/hooks/useSiteContent'
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
  const { contact } = useSiteContent()

  return (
    <footer className="bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <p className="text-2xl font-bold">
                <span className="text-gray-900 dark:text-white">NUEVA</span>{' '}
                <span className="text-cyan-400">CASA</span>
              </p>
            </div>

            {/* Location & Schedule */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">
                Ubicación &amp; Horarios
              </h3>

              <div className="flex items-start space-x-3 mb-4">
                <MapPin
                  className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1"
                  aria-hidden="true"
                />
                <address className="not-italic">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">
                    Nuestra Casa
                  </p>
                  <p className="text-gray-600 dark:text-slate-300 text-sm">
                    {contact.address}
                    <br />
                    {contact.city}
                  </p>
                </address>
              </div>

              <div className="flex items-start space-x-3">
                <Clock
                  className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Reuniones</p>
                  <div className="text-gray-600 dark:text-slate-300 text-sm space-y-1.5">
                    {contact.schedules.map((s, i) => (
                      <p key={i}>
                        {s.name && (
                          <span className="block font-medium text-gray-700 dark:text-slate-200">
                            {s.name}
                          </span>
                        )}
                        {[s.day, s.time].filter(Boolean).join(' · ')}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4">
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
                      className="text-gray-700 dark:text-slate-200 hover:text-cyan-400 transition-colors duration-200 inline-block"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-gray-700 dark:text-slate-200 hover:text-cyan-400 transition-colors duration-200 inline-block"
                    >
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-4">
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
                    className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-slate-800 hover:bg-cyan-400 flex items-center justify-center text-gray-700 dark:text-slate-200 hover:text-white transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-md border border-gray-200 dark:border-slate-800 h-[300px]">
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
        <div className="pt-8 border-t border-gray-200 dark:border-slate-800 text-center">
          <p className="text-gray-500 dark:text-slate-400 text-sm">
            &copy; {currentYear} Nueva Casa. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
