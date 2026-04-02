import { useState } from 'react'
import { Calendar, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useScrollTop } from '@/hooks/useScroll'
import { MINISTERIO_TABS } from '@/lib/constants'
import type { Ministerio, MinisterioTab } from '@/types'
import SEO from '@/components/common/SEO'

const ministerios: Ministerio[] = [
  {
    category: 'GENERACIONES',
    title: 'Jóvenes',
    icon: '👥',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
    description:
      'Una comunidad vibrante para la siguiente generación. No caminamos solos, crecemos juntos.',
    schedule: 'Sábados 6:00 PM',
    bgColor: 'from-cyan-50 to-blue-50',
  },
  {
    category: 'GENERACIONES',
    title: 'Niños',
    icon: '😊',
    image:
      'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop',
    description:
      'Formando corazones desde la infancia con historias bíblicas, juegos y mucha diversión.',
    schedule: 'Domingos 10:00 AM',
    bgColor: 'from-orange-50 to-yellow-50',
  },
  {
    category: 'SERVICIO',
    title: 'Alabanza',
    icon: '🎵',
    image:
      'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop',
    description:
      'Exaltando a Dios a través del arte y la música. Si tocas un instrumento o cantas, este es tu lugar.',
    schedule: 'Jueves 7:00 PM',
    bgColor: 'from-purple-50 to-pink-50',
  },
  {
    category: 'COMUNIDAD',
    title: 'Grupos Pequeños',
    icon: '🏠',
    image:
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&h=400&fit=crop',
    description:
      'Vida en comunidad fuera de las cuatro paredes del templo. Comparte, ríe y crece en casas.',
    schedule: 'Diferentes horarios',
    bgColor: 'from-green-50 to-teal-50',
  },
  {
    category: 'SERVICIO',
    title: 'Servicio Social',
    icon: '🤝',
    image:
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop',
    description:
      'Siendo las manos y pies de Jesús en la ciudad a través de ayuda humanitaria y brigadas.',
    schedule: 'Sábados 9:00 AM',
    bgColor: 'from-red-50 to-orange-50',
  },
]

export default function Ministerios() {
  useScrollTop()

  const [activeTab, setActiveTab] = useState<MinisterioTab>('Todos')

  const filteredMinisterios =
    activeTab === 'Todos'
      ? ministerios
      : ministerios.filter((m) => m.category === activeTab.toUpperCase())

  return (
    <main className="min-h-screen bg-gray-50 pt-32 pb-16">
      <SEO
        title="Ministerios | Iglesia Nueva Casa"
        description="Explora los ministerios de la Iglesia Nueva Casa: Jóvenes, Niños, Alabanza, Grupos Pequeños y Servicio Social. Encuentra tu lugar en la familia."
        url="https://nuevacasa.pe/ministerios"
      />
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <div className="inline-block bg-cyan-100 text-cyan-600 px-4 py-2 rounded-full text-sm font-semibold mb-4 uppercase tracking-wide">
            Nuestra Comunidad
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Descubre tu lugar en la familia
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Hay un espacio para ti. Ya sea que busques crecer espiritualmente,
            servir a otros o conectar con personas de tu edad.
          </p>
        </div>

        {/* Filter tabs */}
        <nav
          aria-label="Filtrar ministerios"
          className="flex justify-center gap-2 mt-12 flex-wrap"
        >
          {MINISTERIO_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              aria-pressed={activeTab === tab}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-cyan-500 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </header>

      {/* ── Ministerios Grid ───────────────────────────────────────────────── */}
      <section
        aria-label="Lista de ministerios"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <ul
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          role="list"
        >
          {filteredMinisterios.map((ministerio) => (
            <li
              key={ministerio.title}
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={ministerio.image}
                  alt={`Ministerio ${ministerio.title}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-cyan-400 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {ministerio.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl" aria-hidden="true">
                    {ministerio.icon}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {ministerio.title}
                  </h2>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {ministerio.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                    <time>{ministerio.schedule}</time>
                  </div>
                  <Link
                    to="/contacto"
                    className="text-cyan-500 hover:text-cyan-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all"
                    aria-label={`Saber más sobre ${ministerio.title}`}
                  >
                    Saber más
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </li>
          ))}

          {/* CTA Card */}
          <li className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl p-8 flex flex-col items-center justify-center text-center text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div
              className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm"
              aria-hidden="true"
            >
              <span className="text-5xl">+</span>
            </div>
            <h2 className="text-2xl font-bold mb-3">
              ¿Quieres ser parte de un equipo?
            </h2>
            <p className="text-white/90 mb-6 leading-relaxed">
              Descubre el propósito que Dios tiene para ti sirviendo a los demás
              en nuestras diferentes áreas.
            </p>
            <Link
              to="/contacto"
              className="bg-white text-cyan-600 px-8 py-3 rounded-full font-semibold hover:bg-cyan-50 transition-colors shadow-lg"
            >
              Empezar ahora
            </Link>
          </li>
        </ul>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────────────────── */}
      <section
        aria-label="Únete a la comunidad"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20"
      >
        <div className="bg-white rounded-3xl p-12 text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            No esperes más para conectar
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Cada semana cientos de jóvenes se reúnen para compartir su fe.
            ¡Estamos listos para recibirte!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/contacto"
              className="bg-cyan-400 text-white px-8 py-3 rounded-full hover:bg-cyan-500 transition-colors font-semibold shadow-lg flex items-center gap-2"
            >
              Ver voluntariado
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </Link>
            <Link
              to="/contacto"
              className="bg-gray-100 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-200 transition-colors font-semibold"
            >
              Contacto directo
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
