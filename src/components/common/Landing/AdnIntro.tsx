import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Heart, Users, Sparkles, Play } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import Carouse1 from '@/assets/images/Carrusel1.jpg'
import Carouse2 from '@/assets/images/Carrusel2.jpg'
import Carouse3 from '@/assets/images/Carrusel3.jpg'

const ADNIntro = () => {
  const carouselImages = [
    {
      src: Carouse1,
      alt: 'Enseñanza',
    },
    {
      src: Carouse2,
      alt: 'Bautizo',
    },
    {
      src: Carouse3,
      alt: 'Equipo',
    },
  ]

  const values = [
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'Amor Genuino',
      description:
        'Amar a Dios y amar a las personas es nuestra prioridad número uno.',
      iconColor: 'text-pink-400',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Comunidad',
      description: 'No fuimos diseñados para vivir solos, crecemos juntos.',
      iconColor: 'text-cyan-300',
    },
  ]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* LEFT */}
          <div>
            {/* Tag */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span className="text-gray-600 font-semibold text-sm uppercase tracking-wider">
                Nuestra Esencia
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
              <div className="text-gray-900">Descubre</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Quiénes
              </div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Somos
              </div>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
              Somos más que un edificio o una reunión de fin de semana. Somos
              una familia unida por un propósito. Explora los valores que
              definen el latido de nuestra cultura.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                size="lg"
                className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-400/30"
              >
                Ver Nuestro ADN
                <span className="ml-2">→</span>
              </Button>

              <button className="flex items-center space-x-3 text-gray-700 hover:text-cyan-500 font-semibold transition-colors group">
                <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 transition-colors shadow-lg">
                  <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                </div>
                <span>Ver Video Intro</span>
              </button>
            </div>
          </div>

          {/* RIGHT - CAROUSEL */}
          <div className="relative">
            {/* Decorative icon */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center z-20">
              <Sparkles className="w-10 h-10 text-cyan-400" />
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 4500,
                    stopOnInteraction: false,
                  }),
                ]}
                opts={{ loop: true }}
                className="w-full"
              >
                <CarouselContent>
                  {carouselImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-[600px] object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Gradient overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* Value cards */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-1 sm:grid-cols-2 gap-4 z-10">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-4 hover:bg-white/30 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`${value.iconColor} mb-2`}>
                      {value.icon}
                    </div>
                    <h3 className="text-white font-bold text-base mb-1">
                      {value.title}
                    </h3>
                    <p className="text-white/90 text-xs leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-3xl blur-2xl -z-10 scale-95" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default ADNIntro
