import { Button } from '@/components/ui/button'
import VolunteeringImage from '@/assets/images/volunteering.png'
import VolunteeringImageMobile from '@/assets/images/volunteering-mobile.png'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Volunteering = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section className="relative w-full min-h-[450px] md:min-h-[300px] lg:min-h-[300px] xl:min-h-[450px]">
      {/* Background Image - Fixed */}
      <div className="fixed inset-0 -z-10">
        <img
          src={isMobile ? VolunteeringImageMobile : VolunteeringImage}
          alt="Servolución"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="w-full max-w-3xl">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight mb-6">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-orange-500">
                Servolución
              </div>
            </h1>

            {/* Description */}
            <p className="text-white/90 text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 max-w-2xl">
              No es solo lo que hacemos, es quienes somos. Llevamos una fe
              activa que sale de las cuatro paredes para impactar nuestra
              ciudad.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/ministerios">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30"
                >
                  Únete al Equipo
                  <span className="ml-2">→</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Volunteering
