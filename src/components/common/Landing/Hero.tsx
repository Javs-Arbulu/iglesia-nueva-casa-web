import { Button } from '@/components/ui/button'
import { MapPin } from 'lucide-react'
import HeroImage from '@/assets/images/Hero.png'

const generateStars = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    animationDelay: Math.random() * 5,
    animationDuration: 3 + Math.random() * 4,
    size: Math.random() * 2 + 1,
  }))
}

const STARS = generateStars()

const HeroSection = () => {
  return (
    <>
      <style>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(10px, -10px);
          }
          50% {
            transform: translate(-5px, 5px);
          }
          75% {
            transform: translate(-10px, -5px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        .star-animated {
          animation: 
            twinkle var(--duration) ease-in-out var(--delay) infinite,
            float var(--float-duration) ease-in-out var(--delay) infinite;
        }
      `}</style>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${HeroImage})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-900/30 via-transparent to-transparent" />
        </div>

        <div className="absolute inset-0 z-0 overflow-hidden">
          {STARS.map((star) => (
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

        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <span className="text-xs md:text-sm font-semibold text-cyan-400 tracking-[0.3em] uppercase">
              # BIENVENIDO A CASA
            </span>
          </div>

          <h1 className="mb-6 leading-tight">
            <div className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
              Aquí no vienes a un lugar,
              <br />
              llegas a una familia.
            </div>
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
                href="https://maps.app.goo.gl/M4FviVnt4jZnmjGq6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Ver Nuestra Ubicación
              </a>
            </Button>

            {/* <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105"
            >
              Conoce al Equipo
            </Button> */}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 -mb-px">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full block h-16 md:h-20 lg:h-24"
            preserveAspectRatio="none"
          >
            <path
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              fill="white"
            />
          </svg>
        </div>
      </section>
    </>
  )
}

export default HeroSection
