import { useState, useCallback, useEffect } from 'react'
import type { ADNValor } from '@/types'

const valores: ADNValor[] = [
  {
    id: 'pasion',
    title: 'Pasión por servir',
    icon: '🤝',
    color: 'bg-cyan-400',
    angle: 90,
    description:
      'Servimos con amor y dedicación, poniendo las necesidades de los demás por encima de las nuestras.',
  },
  {
    id: 'generosidad',
    title: 'Generosidad',
    icon: '∞',
    color: 'bg-blue-500',
    angle: 141,
    description:
      'Damos libremente de nuestro tiempo, talentos y recursos para bendecir a otros.',
  },
  {
    id: 'alegria',
    title: 'Alegría de Vivir',
    icon: '🎉',
    color: 'bg-orange-500',
    angle: 39,
    description:
      'Celebramos la vida con gozo genuino, reflejando la luz de Cristo en todo momento.',
  },
  {
    id: 'autenticidad',
    title: 'Autenticidad',
    icon: '👆',
    color: 'bg-teal-500',
    angle: 180,
    description:
      'Somos reales y transparentes, creando espacios donde puedes ser tú mismo sin máscaras.',
  },
  {
    id: 'humildad',
    title: 'Humildad',
    icon: '🙏',
    color: 'bg-purple-500',
    angle: 0,
    description:
      'Reconocemos que todo lo que somos y tenemos viene de Dios, manteniendo un corazón humilde.',
  },
  {
    id: 'gracia',
    title: 'Gracia Audaz',
    icon: '❤️',
    color: 'bg-red-500',
    angle: 219,
    description:
      'Extendemos gracia sin límites, perdonando como hemos sido perdonados.',
  },
  {
    id: 'relevancia',
    title: 'Relevancia',
    icon: '🎯',
    color: 'bg-pink-500',
    angle: 270,
    description:
      'Nos conectamos con la cultura actual sin comprometer nuestros valores eternos.',
  },
]

const RADIUS_X = 250
const RADIUS_Y = 160

const getEllipsePosition = (
  angle: number,
  radiusX: number,
  radiusY: number
) => {
  const rad = (angle * Math.PI) / 180
  return {
    x: Math.cos(rad) * radiusX,
    y: Math.sin(rad) * radiusY,
  }
}

export default function ADNSection() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)

  // Rotate continuously only when nothing is selected
  useEffect(() => {
    if (selectedId) return

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.3) % 360)
    }, 30)

    return () => clearInterval(interval)
  }, [selectedId])

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedId(null)
  }, [])

  const selectedValor = valores.find((v) => v.id === selectedId) ?? null
  const isAnySelected = selectedId !== null

  return (
    <section
      id="adn"
      aria-label="Nuestro ADN — valores de la iglesia"
      className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-20 lg:py-24 relative overflow-hidden"
    >
      {/* Dot grid pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Visual — orbital ellipse */}
          <div
            className="relative h-[500px] flex items-center justify-center order-2 lg:order-1"
            role="region"
            aria-label="Diagrama orbital de valores"
          >
            {/* Center icon */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              aria-hidden="true"
            >
              <div className="w-24 h-24 bg-slate-800 border-4 border-slate-700 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-4xl">👥</span>
              </div>
            </div>

            {/* Ellipse rings */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              aria-hidden="true"
            >
              <div className="w-[500px] h-[320px] border border-slate-700/30 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[370px] border border-slate-700/20 rounded-full" />
            </div>

            {/* Detail card — shown when a value is selected */}
            {selectedValor && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
                style={{ animation: 'fadeInZoom 0.3s ease-out' }}
                role="dialog"
                aria-modal="false"
                aria-label={`Detalle: ${selectedValor.title}`}
              >
                <div className="bg-white rounded-2xl p-6 shadow-2xl w-80 border-4 border-cyan-400 relative">
                  <button
                    onClick={handleClose}
                    aria-label="Cerrar detalle"
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    ✕
                  </button>

                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`${selectedValor.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}
                      aria-hidden="true"
                    >
                      {selectedValor.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedValor.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedValor.description}
                  </p>
                </div>
              </div>
            )}

            {/* Value nodes positioned around the ellipse */}
            {valores.map((valor) => {
              const isSelected = selectedId === valor.id
              const currentAngle = isAnySelected
                ? valor.angle
                : (valor.angle + rotation) % 360
              const pos = getEllipsePosition(currentAngle, RADIUS_X, RADIUS_Y)

              return (
                <div
                  key={valor.id}
                  className="absolute top-1/2 left-1/2"
                  style={{
                    transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                    opacity: isSelected ? 0 : 1,
                    zIndex: isSelected ? 0 : 20,
                    transition: isAnySelected ? 'opacity 0.2s' : 'none',
                  }}
                >
                  <button
                    onClick={() => handleSelect(valor.id)}
                    className="flex flex-col items-center cursor-pointer group"
                    aria-label={`Ver ${valor.title}`}
                    aria-pressed={isSelected}
                    disabled={isAnySelected && !isSelected}
                  >
                    {/* Icon */}
                    <div
                      className={`${valor.color} w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-xl transition-all duration-200 ${
                        isAnySelected && !isSelected
                          ? 'scale-90 opacity-40'
                          : 'scale-100 hover:scale-110 group-hover:shadow-2xl'
                      }`}
                      aria-hidden="true"
                    >
                      {valor.icon}
                    </div>

                    {/* Label */}
                    <p
                      className={`text-white font-semibold text-center mt-2 text-xs whitespace-nowrap transition-opacity duration-200 ${
                        isAnySelected && !isSelected
                          ? 'opacity-40'
                          : 'opacity-100'
                      }`}
                    >
                      {valor.title}
                    </p>

                    {/* Hover ring */}
                    {!isAnySelected && (
                      <div
                        className="absolute -inset-2 border-2 border-cyan-400/50 rounded-xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </div>
              )
            })}

            {/* Decorative SVG ellipse */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-10"
              aria-hidden="true"
            >
              <ellipse
                cx="50%"
                cy="50%"
                rx={RADIUS_X}
                ry={RADIUS_Y}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="8 8"
                className="text-cyan-400"
              />
            </svg>
          </div>

          {/* Text content */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 uppercase tracking-wide">
              <span
                className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                aria-hidden="true"
              />
              Nuestra Identidad
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Nuestro <span className="text-cyan-400">ADN</span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Los pilares que nos definen. Haz clic en cada valor para descubrir
              nuestra esencia y lo que nos hace únicos como comunidad.
            </p>

            {!selectedId && (
              <div
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 inline-block animate-pulse"
                role="status"
                aria-live="polite"
              >
                <p className="text-cyan-400 text-sm font-medium flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">
                    👆
                  </span>
                  Haz clic en cada valor para conocer más
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  )
}
