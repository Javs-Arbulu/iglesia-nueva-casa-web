import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import type { AppRole } from '@/types'
import { MODULES } from '@/lib/modules'
import { useAuth } from './context'

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-6 text-center">
      {children}
    </div>
  )
}

const Spinner = () => (
  <Centered>
    <Loader2 className="w-8 h-8 animate-spin text-cyan-500" aria-label="Cargando" />
  </Centered>
)

/** Requiere sesión; si no hay, manda al login (recordando a dónde iba). */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth()
  const location = useLocation()
  if (loading) return <Spinner />
  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return <>{children}</>
}

function NoAccess() {
  const { signOut } = useAuth()
  return (
    <Centered>
      <div>
        <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Sin acceso
        </p>
        <p className="text-gray-600 dark:text-slate-300 mb-6 max-w-sm">
          Tu cuenta no tiene permiso para esta sección.
        </p>
        <button
          onClick={() => signOut()}
          className="text-cyan-600 dark:text-cyan-400 font-semibold"
        >
          Cerrar sesión
        </button>
      </div>
    </Centered>
  )
}

/** Requiere alguno de los roles indicados. */
export function RoleGuard({
  roles,
  children,
}: {
  roles: AppRole[]
  children: ReactNode
}) {
  const { hasRole, loading } = useAuth()
  if (loading) return <Spinner />
  if (!hasRole(...roles)) return <NoAccess />
  return <>{children}</>
}

/**
 * Acceso al panel admin: basta con poder ver AL MENOS un módulo. Así el Inicio
 * es accesible para todo el staff (aunque solo tenga uno o dos módulos).
 */
export function AdminAccessGuard({ children }: { children: ReactNode }) {
  const { can, loading } = useAuth()
  if (loading) return <Spinner />
  if (!MODULES.some((m) => can(m.id, 'view'))) return <NoAccess />
  return <>{children}</>
}

/** Requiere permiso de "ver" sobre un módulo (según la matriz de permisos). */
export function PermissionGuard({
  module,
  children,
}: {
  module: string
  children: ReactNode
}) {
  const { can, loading } = useAuth()
  if (loading) return <Spinner />
  if (!can(module, 'view')) return <NoAccess />
  return <>{children}</>
}
