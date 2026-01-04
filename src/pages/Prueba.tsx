import React, { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Users, Lightbulb, Heart, Sparkles, Globe } from 'lucide-react'

const IglesiaJovenPage = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      animationDelay: Math.random() * 3,
      animationDuration: 2 + Math.random() * 3,
      opacity: Math.random() * 0.7 + 0.3,
    }))
  }, [])

  const teamMembers = [
    {
      name: 'Carlos Méndez',
      role: 'Pastor Principal',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    {
      name: 'Araceli Méndez',
      role: 'Pastora',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    {
      name: 'David Ruiz',
      role: 'Líder de Alabanza',
      image:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    },
    {
      name: 'Sofía Torres',
      role: 'Líder de Jóvenes',
      image:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    },
  ]

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Amar sin condiciones',
      description:
        'Creemos en el amor incondicional de Dios y lo reflejamos en nuestra comunidad, aceptando a cada persona tal como es.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Nunca caminarás solo',
      description:
        'Creamos un ambiente donde nadie camina solo. Cada persona importa y tiene un lugar en nuestra familia.',
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Servicio excelente',
      description:
        'Nos esforzamos por la excelencia en todo lo que hacemos, dando lo mejor de nosotros para honrar a Dios.',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Pasión por la vida',
      description:
        'Vivimos con pasión y propósito, sabiendo que cada día es una oportunidad para impactar vidas y vivir plenamente.',
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Creatividad',
      description:
        'Usamos la creatividad que Dios nos ha dado, innovando en la forma de compartir el mensaje del Evangelio.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Impacto Global',
      description:
        'Buscamos ser luz no solo en nuestra ciudad, sino extender nuestro alcance para transformar el mundo.',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2000')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/30 via-transparent to-transparent" />
        </div>

        <div className="absolute inset-0 z-0">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                animationDelay: `${star.animationDelay}s`,
                animationDuration: `${star.animationDuration}s`,
                opacity: star.opacity,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <span className="text-xs md:text-sm font-semibold text-cyan-400 tracking-[0.3em] uppercase">
              # BIENVENIDO A CASA
            </span>
          </div>

          <h1 className="mb-6 leading-tight">
            <div className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-2">
              SOMOS
            </div>
            <div className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold">
              <span className="text-white">IGLESIA </span>
              <span className="text-cyan-400">JOVEN</span>
            </div>
          </h1>

          <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-10 px-4 leading-relaxed">
            No se trata de un edificio, se trata de una familia. Una comunidad
            apasionada por Jesús y por ver nuestra ciudad transformada.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-400/50"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Ver Nuestra Ubicación
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105"
            >
              Conoce al Equipo
            </Button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Historia Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-cyan-400 font-semibold text-sm tracking-wider uppercase">
                Nuestra Historia
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                Todo comenzó en una{' '}
                <span className="text-cyan-400">pequeña sala.</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Hace 10 años, un grupo de 15 personas se reunió en un sueño:
                crear una iglesia que fuera diferente, donde cada persona
                pudiera sentirse en casa y experimentar el amor de Dios sin
                barreras.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Creemos que la iglesia no es un evento al que asistes, sino una
                familia a la que perteneces. Nuestra historia es el reflejo de
                que juntos podemos lograr lo imposible.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800"
                alt="Reunión pequeña"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Nueva Generación Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800"
                alt="Grupo de jóvenes"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <span className="text-cyan-400 font-semibold text-sm tracking-wider uppercase">
                Visión Futura
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                Una iglesia para la nueva generación.
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Creemos que Dios tiene un plan increíble para cada joven. Por
                eso creamos un espacio donde la nueva generación puede crecer,
                descubrir su propósito y desarrollar su potencial.
              </p>
              <Button className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold rounded-full">
                Conoce nuestra visión →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestro ADN Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Nuestro ADN</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Estos valores son nuestra identidad y lo que nos define como
              comunidad. No solo son palabras, es quienes somos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-cyan-400 mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold">Conoce al Equipo</h2>
            <Button variant="link" className="text-cyan-400 font-semibold">
              Ver todo el staff →
            </Button>
          </div>

          <p className="text-gray-600 mb-12 max-w-2xl">
            Detrás de cada evento hay un equipo apasionado dedicado a servir.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="rounded-3xl overflow-hidden mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-cyan-400 text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para visitarnos?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Nos encantaría conocerte en persona este domingo. Tenemos un Café
            esperándote y un lugar reservado para ti.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-8 py-6 rounded-full text-base"
            >
              Planear mi Visita
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-6 rounded-full text-base"
            >
              Ver Horarios
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default IglesiaJovenPage
