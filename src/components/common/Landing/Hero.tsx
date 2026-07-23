import { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import HeroImage from '@/assets/images/Hero.jpg'
import HeroImageWebP from '@/assets/images/Hero.webp'
import { CHURCH_INFO, SOCIAL_HREFS } from '@/lib/constants'
import { useSiteMedia } from '@/hooks/useSiteMedia'
import type { Star } from '@/types'

const generateStars = (): Star[] =>
  Array.from({ length: 30 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    animationDelay: Math.random() * 5,
    animationDuration: 3 + Math.random() * 4,
    size: Math.random() * 2 + 1,
  }))

// Generated once at module level — stable across re-renders
const STARS = generateStars()

const HeroSection = () => {
  // Keep stars stable even if the component re-mounts (e.g. HMR)
  const stars = useMemo(() => STARS, [])
  const { hero } = useSiteMedia()

  return (
    <section
      aria-label="Sección principal de bienvenida"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        {hero ? (
          <img
            src={hero.url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            fetchPriority="high"
          />
        ) : (
          <picture>
            <source srcSet={HeroImageWebP} type="image/webp" />
            <img
              src={HeroImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover object-center"
              fetchPriority="high"
            />
          </picture>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/30 dark:from-black/55 dark:via-black/70 dark:to-black/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/30 via-transparent to-transparent" />
      </div>

      {/* Animated stars — CSS keyframes defined in main.css */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {stars.map((star) => (
          <div
            key={star.id}
            className="star-animated absolute bg-white rounded-full"
            style={
              {
                top: `${star.top}%`,
                left: `${star.left}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                '--delay': `${star.animationDelay}s`,
                '--duration': `${star.animationDuration}s`,
                '--float-duration': `${star.animationDuration * 1.5}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-block mb-6">
          <span className="text-xs md:text-sm font-semibold text-cyan-400 tracking-[0.3em] uppercase">
            # BIENVENIDO A CASA
          </span>
        </div>

        <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
          Aquí no vienes a un lugar,
          <br />
          llegas a{' '}
          <span className="font-hand font-bold text-cyan-300 text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
            una familia.
          </span>
        </h1>

        <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-3xl mx-auto mb-10 px-4 leading-relaxed">
          Somos una comunidad apasionada por Jesús, caminando juntos para
          transformar vidas en nuestra comunidad.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            asChild
            className="bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-cyan-400/50"
          >
            <a
              href={CHURCH_INFO.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPin className="w-5 h-5 mr-2" aria-hidden="true" />
              Ver Nuestra Ubicación
            </a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-2 border-white text-white bg-black/40 hover:bg-white hover:text-black font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-black/20"
          >
            <a
              href={SOCIAL_HREFS.youtubeLive}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver Servicios en Vivo
            </a>
          </Button>
        </div>
      </div>

      {/* Wave divider */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 -mb-px"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full block h-16 md:h-20 lg:h-24"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            className="fill-white dark:fill-slate-900"
          />
        </svg>
      </div>
    </section>
  )
}

export default HeroSection
