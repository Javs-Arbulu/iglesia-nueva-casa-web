import { BookOpen, Lock, Compass, Globe } from 'lucide-react'

const OurPurpose = () => {
  const purposes = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Conocer a Dios',
      description:
        'Más que una religión, es una relación personal y transformadora que cambia todo.',
      gradient: 'from-blue-500 to-cyan-400',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Encontrar Libertad',
      description:
        'Vivir sin ataduras en un ambiente seguro, lleno de gracia y aceptación real.',
      gradient: 'from-purple-500 to-pink-400',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: 'Descubrir Propósito',
      description:
        'Entender tu diseño único y el plan extraordinario que Dios tiene para tu vida.',
      gradient: 'from-orange-500 to-yellow-400',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Hacer la Diferencia',
      description:
        'Impactar la vida de otros y cambiar el mundo usando tus talentos y pasión.',
      gradient: 'from-green-500 to-emerald-400',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
  ]

  return (
    <section className="pt-20 pb-20 bg-white relative overflow-hidden -mt-px">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-100 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Nuestro Propósito
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Existimos para conectar a las personas con la vida que Jesús ofrece.
            <br />
            Un camino simple de cuatro pasos para crecer.
          </p>
        </div>

        {/* Grid de Propósitos - 1 columna móvil, 2 tablet, 4 desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-12">
          {purposes.map((purpose, index) => (
            <div
              key={index}
              className="relative bg-white rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100"
            >
              {/* Gradient Border Effect */}
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${purpose.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Decorative Corner */}
              <div
                className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${purpose.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`}
              />

              {/* Icon */}
              <div className="relative">
                <div
                  className={`w-14 h-14 lg:w-16 lg:h-16 ${purpose.iconBg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 shadow-md group-hover:shadow-xl`}
                >
                  <div
                    className={`${purpose.iconColor} transition-transform duration-300 group-hover:rotate-12`}
                  >
                    {purpose.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all duration-300">
                {purpose.title}
              </h3>
              <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                {purpose.description}
              </p>

              {/* Bottom Accent Line */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${purpose.gradient} rounded-b-3xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}
              />
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {/* <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-400/30 hover:shadow-cyan-500/50"
          >
            Planear una Visita
            <span className="ml-2">→</span>
          </Button>
        </div> */}
      </div>
    </section>
  )
}

export default OurPurpose
