import React, { useState } from 'react'

export default function ADNSection() {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)

  // Rotate continuously when not selected
  React.useEffect(() => {
    if (selectedValue) return

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.3) % 360)
    }, 30)

    return () => clearInterval(interval)
  }, [selectedValue])

  const valores = [
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

  return (
    <div
      id="adn"
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 relative overflow-hidden"
    >
      <style>{`
        @keyframes fadeInZoom {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Visual */}
          <div className="relative h-[500px] flex items-center justify-center order-2 lg:order-1">
            {/* Center Icon */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-24 h-24 bg-slate-800 border-4 border-slate-700 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-4xl">👥</span>
              </div>
            </div>

            {/* Ellipse rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="w-[500px] h-[320px] border border-slate-700/30 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[370px] border border-slate-700/20 rounded-full"></div>
            </div>

            {/* Expanded Card in Center */}
            {selectedValue && (
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
                style={{
                  animation: 'fadeInZoom 0.3s ease-out',
                }}
              >
                <div className="bg-white rounded-2xl p-6 shadow-2xl w-80 border-4 border-cyan-400 relative">
                  {/* Close button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedValue(null)
                    }}
                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    ✕
                  </button>

                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`${valores.find((v) => v.id === selectedValue)?.color} w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}
                    >
                      {valores.find((v) => v.id === selectedValue)?.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {valores.find((v) => v.id === selectedValue)?.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {valores.find((v) => v.id === selectedValue)?.description}
                  </p>
                </div>
              </div>
            )}

            {/* Values positioned around ellipse */}
            {valores.map((valor) => {
              const isSelected = selectedValue === valor.id
              const isAnySelected = selectedValue !== null

              const radiusX = 250
              const radiusY = 160

              // Calculate position with rotation - freeze when any is selected
              const currentAngle = isAnySelected
                ? valor.angle
                : (valor.angle + rotation) % 360
              const pos = getEllipsePosition(currentAngle, radiusX, radiusY)

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
                  onClick={() => setSelectedValue(valor.id)}
                >
                  <div className="flex flex-col items-center cursor-pointer group">
                    {/* Icon Button */}
                    <button
                      className={`${valor.color} w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-xl transition-all duration-200 ${
                        isAnySelected && !isSelected
                          ? 'scale-90 opacity-40'
                          : 'scale-100 hover:scale-110 group-hover:shadow-2xl'
                      }`}
                    >
                      {valor.icon}
                    </button>

                    {/* Label below icon */}
                    <p
                      className={`text-white font-semibold text-center mt-2 text-xs whitespace-nowrap transition-opacity duration-200 ${
                        isAnySelected && !isSelected
                          ? 'opacity-40'
                          : 'opacity-100'
                      }`}
                    >
                      {valor.title}
                    </p>

                    {/* Click indicator pulse */}
                    {!isAnySelected && (
                      <div className="absolute -inset-2 border-2 border-cyan-400/50 rounded-xl opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none"></div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Decorative ellipse */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10">
              <ellipse
                cx="50%"
                cy="50%"
                rx="250"
                ry="160"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="8 8"
                className="text-cyan-400"
              />
            </svg>
          </div>

          {/* Right Side - Text */}
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 uppercase tracking-wide">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              Nuestra Identidad
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Nuestro <span className="text-cyan-400">ADN</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Los pilares que nos definen. Pasa el cursor sobre cada valor para
              descubrir nuestra esencia y lo que nos hace únicos como comunidad.
            </p>

            {/* Instruction hint */}
            {!selectedValue && (
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 inline-block animate-pulse">
                <p className="text-cyan-400 text-sm font-medium flex items-center gap-2">
                  <span className="text-xl">👆</span>
                  Haz clic en cada valor para conocer más
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
    </div>
  )
}
