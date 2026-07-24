import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/features/auth/context'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  )
}

/** Botones de inicio de sesión con proveedores sociales (Google). */
export default function SocialAuthButtons() {
  const { signInWithProvider } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const withGoogle = async () => {
    setError(null)
    setLoading(true)
    const { error: err } = await signInWithProvider('google')
    // En éxito, el navegador redirige a Google; solo llegamos aquí si falla.
    if (err) {
      setError('No se pudo iniciar con Google. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
        <span className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
        o
        <span className="flex-1 h-px bg-gray-200 dark:bg-slate-700" />
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-300">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={withGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-100 font-semibold py-3 rounded-full transition-colors hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-60"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon />
        )}
        Continuar con Google
      </button>
    </div>
  )
}
