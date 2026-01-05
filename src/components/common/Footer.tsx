import { MapPin, Clock, Instagram, Youtube, Facebook } from 'lucide-react'

const Footer = () => {
  const exploreLinks = [
    { name: 'Nosotros', href: '#nosotros' },
    { name: 'Ministerios', href: '#ministerios' },
    { name: 'Sermones', href: '#sermones' },
    { name: 'Dar', href: '#dar' },
    { name: 'Eventos', href: '#eventos' },
  ]

  const socialLinks = [
    {
      icon: <Instagram className="w-5 h-5" />,
      href: 'https://www.instagram.com/iglesianuevacasa/',
      label: 'Instagram',
    },
    {
      icon: <Youtube className="w-5 h-5" />,
      href: 'https://www.youtube.com/@iglesianuevacasa',
      label: 'YouTube',
    },
    {
      icon: <Facebook className="w-5 h-5" />,
      href: 'https://www.facebook.com/IglesiaNuevaCasa',
      label: 'Facebook',
    },
  ]

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="text-2xl font-bold">
                <span className="text-gray-900">NUEVA</span>{' '}
                <span className="text-cyan-400">CASA</span>
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                Ubicación & Horarios
              </h3>
              <div className="flex items-start space-x-3 mb-4">
                <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Nuestra Casa
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Jr. Juan Luis Hague 3545, San Martin de Porres
                    <br />
                    Lima, Perú
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Reuniones
                  </h4>
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
              {exploreLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-700 hover:text-cyan-400 transition-colors duration-200 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Social Links */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                Síguenos
              </h3>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
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
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 h-[300px] relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.2845906339053!2d-77.08588162493928!3d-12.02391808821105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105cf0013e3b017%3A0xd8bf89dbf07c73a3!2sIglesia%20Nueva%20Casa!5e0!3m2!1ses!2spe!4v1767561626307!5m2!1ses!2spe"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Nueva Casa"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 text-sm">
            <p className="text-gray-500">
              © 2026 Nueva Casa. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
