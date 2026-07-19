import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { House, Loader2 } from 'lucide-react'
import { useAuth } from '@/features/auth/context'
import SEO from '@/components/common/SEO'

export default function Login() {
  const { signIn, session, roles, loading, hasRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Una vez autenticado, redirige según el rol.
  useEffect(() => {
    if (loading || !session) return
    if (hasRole('admin', 'editor', 'finanzas')) {
      navigate(from ?? '/admin', { replace: true })
    } else {
      navigate('/portal', { replace: true })
    }
  }, [session, roles, loading, hasRole, from, navigate])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    const { error: err } = await signIn(email.trim().toLowerCase(), password)
    if (err) {
      setError('Correo o contraseña incorrectos.')
      setSubmitting(false)
    }
    // En éxito, el efecto de arriba se encarga de redirigir.
  }

  const inputCls =
    'w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 dark:from-cyan-900 dark:via-blue-900 dark:to-indigo-950">
      <SEO title="Ingresar | Iglesia Nueva Casa" url="https://nuevacasa.pe/login" />
      <div className="w-full max-w-sm">
        <Link to="/" className="flex flex-col items-center mb-8 text-white">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-3">
            <House className="w-7 h-7" aria-hidden="true" />
          </div>
          <span className="font-bold text-xl">Nueva Casa</span>
          <span className="text-white/70 text-sm">Portal</span>
        </Link>

        <form
          onSubmit={onSubmit}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl space-y-4"
        >
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Iniciar sesión
          </h1>

          {error && (
            <p
              role="alert"
              className="text-sm text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-500/10 rounded-lg px-3 py-2"
            >
              {error}
            </p>
          )}

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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
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
              'Entrar'
            )}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-slate-400">
            ¿No tienes cuenta?{' '}
            <Link
              to="/registro"
              className="text-cyan-600 dark:text-cyan-400 font-semibold"
            >
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}
