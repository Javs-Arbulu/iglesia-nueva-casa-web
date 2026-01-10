import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Send } from 'lucide-react'

export default function ContactoSection() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = () => {
    console.log('Form submitted:', formData)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="text-xs md:text-sm font-semibold text-cyan-200 tracking-[0.3em] uppercase">
                # CONTACTO
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Estamos para ti
            </h1>
            <p className="text-white/90 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              Ponte en contacto con nosotros o visítanos en una de nuestras
              reuniones.
              <br />
              Queremos conocerte y caminar contigo.
            </p>
          </div>
        </div>

        {/* SVG Wave Transition */}
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
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden -mt-px">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* Contact Form - Takes 3 columns */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                    Envíanos un mensaje
                  </h2>

                  <div className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-900 font-semibold mb-3 text-base">
                          Nombre Completo
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          placeholder="Escribe tu nombre"
                          className="w-full px-5 py-4 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-900 font-semibold mb-3 text-base">
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ejemplo@correo.com"
                          className="w-full px-5 py-4 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-gray-900 font-semibold mb-3 text-base">
                        Asunto
                      </label>
                      <input
                        type="text"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        placeholder="¿En qué podemos ayudarte?"
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-gray-900 font-semibold mb-3 text-base">
                        Mensaje
                      </label>
                      <textarea
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        rows={7}
                        placeholder="Escribe tu mensaje aquí..."
                        className="w-full px-5 py-4 rounded-xl bg-gray-50 border-0 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all resize-none"
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <Button
                      onClick={handleSubmit}
                      size="lg"
                      className="w-full bg-cyan-400 hover:bg-cyan-500 !text-white font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensaje
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Side Info - Takes 2 columns */}
              <div className="lg:col-span-2 space-y-6">
                {/* Location Card */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-cyan-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Nuestra Ubicación
                      </h3>
                    </div>
                  </div>

                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1597931752949-98c74b5b159f?w=800&h=400&fit=crop"
                      alt="Iglesia"
                      className="w-full h-56 object-cover"
                    />

                    {/* Address Badge Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white rounded-xl px-5 py-3 shadow-lg flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                        <span className="text-gray-900 font-semibold text-sm">
                          Jr. Juan Luis Hague 3545, San Martin de Porres
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Card */}
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Horarios de Reunión
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Servicio Dominical */}
                    <div className="border-b border-gray-100 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900 text-base mb-1">
                            Servicio Dominical
                          </p>
                          <p className="text-cyan-500 text-sm">
                            Todos los domingos
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-lg">
                            11:00 AM
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reunión de Jóvenes */}
                    <div className="pt-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-gray-900 text-base mb-1">
                            Reunión de Adolescentes
                          </p>
                          <p className="text-cyan-500 text-sm">Cada sábado</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-lg">
                            5:00 PM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
