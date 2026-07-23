import { Button } from '@/components/ui/button'
import VolunteeringImage from '@/assets/images/volunteering.jpg'
import VolunteeringImageWebP from '@/assets/images/volunteering.webp'
import VolunteeringImageMobile from '@/assets/images/volunteering-mobile.jpg'
import VolunteeringImageMobileWebP from '@/assets/images/volunteering-mobile.webp'
import { Link } from 'react-router-dom'
import { useSiteMedia } from '@/hooks/useSiteMedia'
import { useHomeText } from '@/hooks/useSiteText'

/**
 * "Servolución" parallax-style banner section.
 *
 * The parallax effect uses CSS background-attachment: fixed.
 * WebP is served via inline style on desktop; mobile uses the smaller image
 * without parallax (fixed attachment doesn't work well on iOS).
 * The <picture> element is kept as a hidden preload hint for the fallback PNG.
 */
const Volunteering = () => {
  const { volunteering } = useSiteMedia()
  const t = useHomeText().volunteering

  return (
    <section
      aria-label="Sección Servolución — únete al equipo"
      className="relative w-full min-h-[450px] md:min-h-[300px] xl:min-h-[450px] overflow-hidden"
    >
      {/* Background — parallax on desktop, static on mobile */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {/* Desktop: parallax via background-attachment: fixed */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: volunteering
              ? `url(${volunteering.url})`
              : `url(${VolunteeringImageWebP}), url(${VolunteeringImage})`,
            backgroundAttachment: 'fixed',
          }}
        />
        {/* Mobile: static cover image (no fixed attachment — broken on iOS) */}
        {volunteering ? (
          <img
            src={volunteering.url}
            alt=""
            className="md:hidden w-full h-full object-cover object-center"
            loading="lazy"
          />
        ) : (
          <picture className="md:hidden">
            <source srcSet={VolunteeringImageMobileWebP} type="image/webp" />
            <img
              src={VolunteeringImageMobile}
              alt=""
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
          </picture>
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent dark:from-black/90 dark:via-black/65 dark:to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="w-full max-w-3xl">
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-orange-500">
                {t.title}
              </span>
            </h2>

            <p className="text-white/90 text-lg md:text-xl lg:text-2xl leading-relaxed mb-8 max-w-2xl">
              {t.paragraph}
            </p>

            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/30"
            >
              <Link to="/ministerios">
                {t.button}
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Volunteering
