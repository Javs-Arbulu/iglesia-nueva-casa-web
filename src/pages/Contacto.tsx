import { useState, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { MapPin, Clock, Send, Loader2 } from 'lucide-react'
import { useScrollToHash } from '@/hooks/useScroll'
import { CHURCH_INFO } from '@/lib/constants'
import { getSupabase } from '@/services/supabase'
import type { ContactFormData, ContactFormErrors } from '@/types'
import SEO from '@/components/common/SEO'

// ─── Validation ────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {}

  if (!data.nombre.trim()) {
    errors.nombre = 'El nombre es requerido.'
  }
  if (!data.email.trim()) {
    errors.email = 'El correo es requerido.'
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Ingresa un correo válido.'
  }
  if (!data.asunto.trim()) {
    errors.asunto = 'El asunto es requerido.'
  }
  if (!data.mensaje.trim()) {
    errors.mensaje = 'El mensaje no puede estar vacío.'
  } else if (data.mensaje.trim().length < 10) {
    errors.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
  }

  return errors
}

const INITIAL_FORM: ContactFormData = {
  nombre: '',
  email: '',
  asunto: '',
  mensaje: '',
}

// ─── Sub-components ────────────────────────────────────────────────────────────

interface FieldErrorProps {
  message?: string
  id: string
}

const FieldError = ({ message, id }: FieldErrorProps) =>
  message ? (
    <p id={id} role="alert" className="mt-1 text-red-500 text-sm">
      {message}
    </p>
  ) : null

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function Contacto() {
  // Scroll to #info when navigated with that hash
  useScrollToHash()

  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<ContactFormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Anti-spam: honeypot (campo oculto que solo los bots llenan) + tiempo mínimo
  // de llenado. Ninguno se envía a Supabase.
  const honeypotRef = useRef<HTMLInputElement>(null)
  const formLoadedAt = useRef(Date.now())

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
      // Clear error for the field being edited
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    },
    []
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setSubmitError(null)

      // Honeypot: si el campo oculto trae valor, es un bot. Simulamos éxito
      // para no darle pistas y no tocamos Supabase.
      if (honeypotRef.current?.value) {
        setSubmitted(true)
        setFormData(INITIAL_FORM)
        return
      }

      // Envío sospechosamente rápido (bots). Un humano tarda más en llenarlo.
      if (Date.now() - formLoadedAt.current < 3000) {
        setSubmitError('Por favor, tómate un momento y vuelve a intentarlo.')
        return
      }

      const validationErrors = validateForm(formData)

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }

      setIsLoading(true)
      try {
        const { error } = await getSupabase()
          .from('contact_submissions')
          .insert({
            nombre: formData.nombre.trim(),
            email: formData.email.trim().toLowerCase(),
            asunto: formData.asunto.trim(),
            mensaje: formData.mensaje.trim(),
          })

        if (error) throw error

        setSubmitted(true)
        setFormData(INITIAL_FORM)
        setErrors({})
      } catch (err) {
        console.error('Error al enviar el formulario:', err)
        setSubmitError(
          'No pudimos enviar tu mensaje. Por favor intenta de nuevo más tarde.'
        )
      } finally {
        setIsLoading(false)
      }
    },
    [formData]
  )

  const inputBase =
    'w-full px-5 py-4 rounded-xl bg-gray-50 border border-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:border-slate-700 dark:focus:bg-slate-800 transition-all'

  const inputError = 'border-red-400 bg-red-50 focus:ring-red-400'

  return (
    <>
      <SEO
        title="Contacto | Iglesia Nueva Casa"
        description="Ponte en contacto con la Iglesia Nueva Casa en Lima. Visítanos cada domingo o envíanos un mensaje. Estamos en San Martín de Porres."
        url="https://nuevacasa.pe/contacto"
      />
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        aria-label="Contacto — cabecera"
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 dark:from-cyan-900 dark:via-blue-900 dark:to-indigo-950"
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
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

        {/* Wave transition */}
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
              className="fill-gray-50 dark:fill-slate-950"
            />
          </svg>
        </div>
      </section>

      {/* ── Contact Section ────────────────────────────────────────────────── */}
      <section
        id="info"
        aria-label="Formulario de contacto e información"
        className="py-20 bg-gray-50 dark:bg-slate-950 relative overflow-hidden -mt-px"
      >
        <div
          className="absolute top-20 right-20 w-72 h-72 bg-cyan-200/30 rounded-full blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-5 gap-8">
              {/* ── Contact Form (3/5 cols) ───────────────────────────────── */}
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 lg:p-10 shadow-lg border border-gray-100 dark:border-slate-800">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                    Envíanos un mensaje
                  </h2>

                  {/* Success message */}
                  {submitted && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="mb-6 bg-green-50 dark:bg-green-500/10 border border-green-200 text-green-700 dark:text-green-300 rounded-xl px-6 py-4 font-medium"
                    >
                      ¡Mensaje enviado! Nos pondremos en contacto pronto.
                    </div>
                  )}

                  {/* Error message */}
                  {submitError && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="mb-6 bg-red-50 dark:bg-red-500/10 border border-red-200 text-red-700 dark:text-red-300 rounded-xl px-6 py-4 font-medium"
                    >
                      {submitError}
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    aria-label="Formulario de contacto"
                  >
                    <div className="space-y-6">
                      {/* Name & Email */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="nombre"
                            className="block text-gray-900 dark:text-white font-semibold mb-3 text-base"
                          >
                            Nombre Completo{' '}
                            <span aria-hidden="true" className="text-red-500">
                              *
                            </span>
                          </label>
                          <input
                            id="nombre"
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Escribe tu nombre"
                            autoComplete="name"
                            aria-required="true"
                            aria-describedby={
                              errors.nombre ? 'nombre-error' : undefined
                            }
                            aria-invalid={!!errors.nombre}
                            className={`${inputBase} ${errors.nombre ? inputError : ''}`}
                          />
                          <FieldError
                            message={errors.nombre}
                            id="nombre-error"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="email"
                            className="block text-gray-900 dark:text-white font-semibold mb-3 text-base"
                          >
                            Correo Electrónico{' '}
                            <span aria-hidden="true" className="text-red-500">
                              *
                            </span>
                          </label>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            autoComplete="email"
                            aria-required="true"
                            aria-describedby={
                              errors.email ? 'email-error' : undefined
                            }
                            aria-invalid={!!errors.email}
                            className={`${inputBase} ${errors.email ? inputError : ''}`}
                          />
                          <FieldError message={errors.email} id="email-error" />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label
                          htmlFor="asunto"
                          className="block text-gray-900 dark:text-white font-semibold mb-3 text-base"
                        >
                          Asunto{' '}
                          <span aria-hidden="true" className="text-red-500">
                            *
                          </span>
                        </label>
                        <input
                          id="asunto"
                          type="text"
                          name="asunto"
                          value={formData.asunto}
                          onChange={handleChange}
                          placeholder="¿En qué podemos ayudarte?"
                          aria-required="true"
                          aria-describedby={
                            errors.asunto ? 'asunto-error' : undefined
                          }
                          aria-invalid={!!errors.asunto}
                          className={`${inputBase} ${errors.asunto ? inputError : ''}`}
                        />
                        <FieldError message={errors.asunto} id="asunto-error" />
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="mensaje"
                          className="block text-gray-900 dark:text-white font-semibold mb-3 text-base"
                        >
                          Mensaje{' '}
                          <span aria-hidden="true" className="text-red-500">
                            *
                          </span>
                        </label>
                        <textarea
                          id="mensaje"
                          name="mensaje"
                          value={formData.mensaje}
                          onChange={handleChange}
                          rows={7}
                          placeholder="Escribe tu mensaje aquí..."
                          aria-required="true"
                          aria-describedby={
                            errors.mensaje ? 'mensaje-error' : undefined
                          }
                          aria-invalid={!!errors.mensaje}
                          className={`${inputBase} resize-none ${errors.mensaje ? inputError : ''}`}
                        />
                        <FieldError
                          message={errors.mensaje}
                          id="mensaje-error"
                        />
                      </div>

                      {/* Honeypot anti-spam — oculto para humanos, visible para bots */}
                      <div
                        aria-hidden="true"
                        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
                      >
                        <label htmlFor="website">No llenar este campo</label>
                        <input
                          ref={honeypotRef}
                          id="website"
                          name="website"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </div>

                      {/* Submit */}
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading}
                        className="w-full bg-cyan-400 hover:bg-cyan-500 text-white font-semibold px-8 py-6 rounded-full text-base transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {isLoading ? (
                          <>
                            <Loader2
                              className="w-5 h-5 mr-2 animate-spin"
                              aria-hidden="true"
                            />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" aria-hidden="true" />
                            Enviar Mensaje
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              {/* ── Right Info (2/5 cols) ─────────────────────────────────── */}
              <aside
                className="lg:col-span-2 space-y-6"
                aria-label="Información de contacto"
              >
                {/* Location Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-300">
                  <div className="p-6 pb-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                        <MapPin
                          className="w-6 h-6 text-cyan-600"
                          aria-hidden="true"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        Nuestra Ubicación
                      </h3>
                    </div>
                  </div>

                  <div className="relative">
                    <iframe
                      src={CHURCH_INFO.mapsEmbed}
                      title="Ubicación de la Iglesia Nueva Casa en Google Maps"
                      className="w-full h-56 border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                    />
                    <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                      <address className="not-italic bg-white dark:bg-slate-900 rounded-xl px-5 py-3 shadow-lg flex items-center gap-3">
                        <MapPin
                          className="w-5 h-5 text-cyan-400 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-gray-900 dark:text-white font-semibold text-sm">
                          {CHURCH_INFO.address}
                        </span>
                      </address>
                    </div>
                  </div>
                </div>

                {/* Schedule Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Clock
                        className="w-6 h-6 text-purple-600"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Horarios de Reunión
                    </h3>
                  </div>

                  <ul className="space-y-4">
                    {CHURCH_INFO.schedules.map((schedule, index) => (
                      <li
                        key={index}
                        className={
                          index < CHURCH_INFO.schedules.length - 1
                            ? 'border-b border-gray-100 dark:border-slate-800 pb-4'
                            : 'pt-2'
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-base mb-1">
                              {schedule.name}
                            </p>
                            <p className="text-cyan-500 text-sm">
                              {schedule.day}
                            </p>
                          </div>
                          <div className="text-right">
                            <time className="font-bold text-gray-900 dark:text-white text-lg">
                              {schedule.time}
                            </time>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
