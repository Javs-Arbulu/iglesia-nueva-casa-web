import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Heart, Users, Sparkles, ArrowLeft } from 'lucide-react'
import Autoplay from 'embla-carousel-autoplay'
import Carouse1 from '@/assets/images/Carrusel1.jpg'
import Carouse2 from '@/assets/images/Carrusel2.jpg'
import Carouse3 from '@/assets/images/Carrusel3.jpg'

const ADNIntro = () => {
  const carouselImages = [
    { src: Carouse1, alt: 'Enseñanza' },
    { src: Carouse2, alt: 'Bautizo' },
    { src: Carouse3, alt: 'Equipo' },
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
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: 'Servicio',
      description: 'Vivimos para servir a Dios y a los demás.',
      iconColor: 'text-yellow-300',
    },
  ]

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* RIGHT - CARRUSEL (ahora a la izquierda) */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              {/* IMAGE CAROUSEL */}
              <Carousel
                opts={{ loop: true }}
                plugins={[
                  Autoplay({
                    delay: 4500,
                    stopOnInteraction: false,
                  }),
                ]}
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

              {/* OVERLAY */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

              {/* VALUES – DESKTOP */}
              <div className="hidden sm:block absolute bottom-6 left-6 right-6 z-10 overflow-hidden">
                <Carousel
                  opts={{
                    loop: true,
                    slidesToScroll: 1,
                    align: 'start',
                  }}
                  plugins={[
                    Autoplay({
                      delay: 3500,
                      stopOnInteraction: false,
                    }),
                  ]}
                >
                  <CarouselContent className="-ml-4">
                    {values.map((value, index) => (
                      <CarouselItem key={index} className="basis-1/2 pl-4">
                        <div className="h-full backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-4">
                          <div className={`${value.iconColor} mb-2`}>
                            {value.icon}
                          </div>
                          <h3 className="text-white font-bold mb-1">
                            {value.title}
                          </h3>
                          <p className="text-white/90 text-sm">
                            {value.description}
                          </p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>

              {/* VALUES – MOBILE */}
              <div className="sm:hidden absolute bottom-6 left-6 right-6 z-10">
                <Carousel
                  opts={{ loop: true }}
                  plugins={[
                    Autoplay({
                      delay: 3000,
                      stopOnInteraction: false,
                    }),
                  ]}
                >
                  <CarouselContent>
                    {values.map((value, index) => (
                      <CarouselItem key={index}>
                        <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-4">
                          <div className={`${value.iconColor} mb-2`}>
                            {value.icon}
                          </div>
                          <h3 className="text-white font-bold mb-1">
                            {value.title}
                          </h3>
                          <p className="text-white/90 text-sm">
                            {value.description}
                          </p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
          </div>

          {/* LEFT - TEXTO (ahora a la derecha) */}
          <div className="relative order-1 lg:order-2 lg:flex lg:flex-col lg:items-end">
            {/* Tag */}
            <div className="flex items-center space-x-2 mb-6 lg:flex-row-reverse lg:space-x-reverse">
              <div className="w-2 h-2 bg-cyan-400 rounded-full" />
              <span className="text-gray-600 font-semibold text-sm uppercase tracking-wider">
                Nuestra Esencia
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight lg:text-right">
              <div className="text-gray-900">Descubre</div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Quiénes
              </div>
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Somos
              </div>
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-8 max-w-xl lg:text-right">
              Somos más que un edificio o una reunión de fin de semana. Somos
              una familia unida por un propósito. Explora los valores que
              definen el latido de nuestra cultura.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 lg:justify-end">
              <Button
                size="lg"
                className="bg-cyan-400 hover:bg-cyan-500 text-black font-bold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-400/30"
              >
                <span className="ml-2 inline-flex">
                  <ArrowLeft className="w-4 h-4" />
                </span>{' '}
                Ver Nuestro ADN
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ADNIntro
