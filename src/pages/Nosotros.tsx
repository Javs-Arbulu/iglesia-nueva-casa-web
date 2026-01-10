import { Button } from '@/components/ui/button'
import { Users, Zap, TrendingUp } from 'lucide-react'
import ADNSection from './ADN'
import { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'

export default function Nosotros() {
  const location = useLocation()
  useEffect(() => {
    if (location.hash === '#adn') {
      const el = document.getElementById('adn')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [location])
  const visionItems = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Comunidad Auténtica',
      description:
        'Un espacio seguro donde puedes participar antes de creer. Fomentamos relaciones genuinas y duraderas.',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      gradient: 'from-cyan-500 to-blue-400',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fe en Acción',
      description:
        'No solo hablamos de fe, la vivimos. Llevamos un mensaje de esperanza a las calles y servimos a nuestra ciudad.',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      gradient: 'from-yellow-500 to-orange-400',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Liderazgo Joven',
      description:
        'Creemos en tu potencial. Capacitamos y empoderamos a los líderes de mañana, hoy mismo.',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      gradient: 'from-purple-500 to-pink-400',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-6">
                <span className="text-xs md:text-sm font-semibold text-cyan-200 tracking-[0.3em] uppercase">
                  # SOBRE NOSOTROS
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                No solo una iglesia,{' '}
                <span className="text-cyan-200">una familia.</span>
              </h1>
              <p className="text-white/90 text-base md:text-lg mb-8 leading-relaxed">
                Bienvenido a un lugar donde puedes ser tú mismo. Creemos y
                pertenecemos a la próxima generación para vivir con propósito y
                pasión por Jesús. Aquí encontrarás amigos, fe y un futuro
                brillante.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <Button
                  size="lg"
                  className="bg-white !text-cyan-600 hover:bg-cyan-50 hover:!text-cyan-700 font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  Únete este Domingo
                </Button> */}
                <Link to="/contacto#info">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white !text-blue hover:bg-white/10 hover:!text-white font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 backdrop-blur-sm"
                  >
                    Ver Horarios
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl ring-8 ring-white/20">
                <img
                  src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop"
                  alt="Comunidad Joven"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-xl">
                  <p className="text-gray-900 font-semibold">Comunidad Joven</p>
                  <p className="text-cyan-600 text-sm font-medium">
                    Reuniones cada Domingo 11AM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div id="adn">
        <ADNSection />
      </div>
      {/* Vision Section */}
      <section className="pt-20 pb-20 bg-white relative overflow-hidden -mt-px">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nuestra Visión
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Más que reuniones, construimos una comunidad viva y apasionada
              donde cada persona encuentra su propósito.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {visionItems.map((item, index) => (
              <div
                key={index}
                className="relative bg-white rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100"
              >
                {/* Gradient Border Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Decorative Corner */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`}
                />

                {/* Icon */}
                <div className="relative">
                  <div
                    className={`w-14 h-14 lg:w-16 lg:h-16 ${item.iconBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 shadow-md group-hover:shadow-xl`}
                  >
                    <div
                      className={`${item.iconColor} transition-transform duration-300 group-hover:rotate-12`}
                    >
                      {item.icon}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                  {item.description}
                </p>

                {/* Bottom Accent Line */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-400 rounded-full blur-3xl" />
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="w-16 h-16 bg-cyan-400/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🤝</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Estamos emocionados de conocerte
                </h2>
                <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  No tienes que hacer esto solo. Ven tal como eres y sé parte de
                  algo más grande. Tu historia importa aquí.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* <Button
                    size="lg"
                    className="bg-cyan-400 hover:bg-cyan-500 text-white font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    Planificar Visita
                  </Button> */}
                  <Link to="/contacto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 border border-white/20"
                    >
                      Contáctanos
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
