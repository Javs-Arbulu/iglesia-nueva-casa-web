import { House, LogOut } from 'lucide-react'
import { useAuth } from '@/features/auth/context'
import SEO from '@/components/common/SEO'

/**
 * Área de miembros — placeholder de la Fase 0. Las descargas y el material
 * llegan en una fase posterior.
 */
export default function Portal() {
  const { profile, signOut } = useAuth()
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center text-center px-6">
      <SEO title="Portal | Iglesia Nueva Casa" url="https://nuevacasa.pe/portal" />
      <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <House className="w-7 h-7 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Hola{profile?.full_name ? `, ${profile.full_name}` : ''}
      </h1>
      <p className="text-gray-600 dark:text-slate-300 max-w-sm mb-6">
        El área de miembros (material y descargas) estará disponible pronto.
        ¡Gracias por ser parte de Nueva Casa!
      </p>
      <button
        onClick={() => signOut()}
        className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold"
      >
        <LogOut className="w-4 h-4" aria-hidden="true" />
        Cerrar sesión
      </button>
    </main>
  )
}
