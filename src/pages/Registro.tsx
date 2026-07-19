import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { House, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/features/auth/context'
import SEO from '@/components/common/SEO'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Registro() {
  const { signUp } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  // Anti-spam
  const honeypotRef = useRef<HTMLInputElement>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (honeypotRef.current?.value) {
      setDone(true) // bot: fingimos éxito, no creamos nada
      return
    }
    if (!firstName.trim()) return setError('Ingresa tu nombre.')
    if (!lastName.trim()) return setError('Ingresa tu apellido.')
    if (!EMAIL_REGEX.test(email)) return setError('Ingresa un correo válido.')
    if (password.length < 8) {
      return setError('La contraseña debe tener al menos 8 caracteres.')
    }
    if (password !== confirm) return setError('Las contraseñas no coinciden.')

    setSubmitting(true)
    const { error: err } = await signUp(
      email.trim().toLowerCase(),
      password,
      firstName.trim(),
      lastName.trim()
    )
    setSubmitting(false)
    if (err) {
      setError(
        err.toLowerCase().includes('already')
          ? 'Ese correo ya está registrado.'
          : 'No pudimos completar el registro. Intenta de nuevo.'
      )
      return
    }
    setDone(true)
  }

  const inputCls =
    'w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 dark:from-cyan-900 dark:via-blue-900 dark:to-indigo-950">
      <SEO title="Registro | Iglesia Nueva Casa" url="https://nuevacasa.pe/registro" />
      <div className="w-full max-w-sm">
        <Link to="/" className="flex flex-col items-center mb-8 text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
            <House className="w-7 h-7" aria-hidden="true" />
          </div>
          <span className="font-bold text-xl">Nueva Casa</span>
          <span className="text-white/70 text-sm">Crear cuenta</span>
        </Link>

        {done ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl text-center">
            <CheckCircle2
              className="w-12 h-12 text-green-500 mx-auto mb-4"
              aria-hidden="true"
            />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              ¡Registro recibido!
            </h1>
            <p className="text-gray-600 dark:text-slate-300 mb-6">
              Un administrador revisará tu cuenta y te dará acceso. Si te pedimos
              confirmar tu correo, revisa tu bandeja de entrada.
            </p>
            <Link
              to="/"
              className="inline-block bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            noValidate
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Crear cuenta
            </h1>

            {error && (
              <p
                role="alert"
                className="text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2"
              >
                {error}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1"
                >
                  Nombre
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1"
                >
                  Apellido
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1"
              >
                Correo
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1"
              >
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label
                htmlFor="confirm"
                className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1"
              >
                Repite la contraseña
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Honeypot anti-spam (oculto para humanos) */}
            <div
              aria-hidden="true"
              className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
            >
              <label htmlFor="company">No llenar</label>
              <input
                ref={honeypotRef}
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold py-3 rounded-full transition-colors disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                'Registrarme'
              )}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-slate-400">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-cyan-600 dark:text-cyan-400 font-semibold"
              >
                Inicia sesión
              </Link>
            </p>
          </form>
        )}
      </div>
    </main>
  )
}
