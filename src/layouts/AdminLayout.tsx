import { useState } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  CalendarDays,
  Image as ImageIcon,
  FileText,
  Wallet,
  MoreHorizontal,
  X,
  LogOut,
} from 'lucide-react'
import type { AppRole } from '@/types'
import { useAuth } from '@/features/auth/context'
import { ToastProvider } from '@/features/toast/ToastProvider'
import ThemeToggle from '@/components/common/ThemeToggle'

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
  roles: AppRole[]
}

const NAV: NavItem[] = [
  {
    to: '/admin',
    label: 'Inicio',
    icon: LayoutDashboard,
    end: true,
    roles: ['admin', 'editor', 'finanzas'],
  },
  { to: '/admin/eventos', label: 'Eventos', icon: CalendarDays, roles: ['admin', 'editor'] },
  { to: '/admin/fotos', label: 'Fotos', icon: ImageIcon, roles: ['admin', 'editor'] },
  { to: '/admin/contenido', label: 'Contenido', icon: FileText, roles: ['admin', 'editor'] },
  { to: '/admin/finanzas', label: 'Finanzas', icon: Wallet, roles: ['admin', 'finanzas'] },
  { to: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare, roles: ['admin'] },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users, roles: ['admin'] },
]

const controlCls =
  'text-gray-700 hover:text-cyan-600 hover:bg-black/5 dark:text-white/90 dark:hover:text-cyan-400 dark:hover:bg-white/10'

// Máximo de pestañas visibles en la barra inferior (la última es "Más" si sobra).
const MAX_TABS = 5

export default function AdminLayout() {
  const { profile, hasRole, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [moreOpen, setMoreOpen] = useState(false)
  const items = NAV.filter((n) => hasRole(...n.roles))

  const overflowed = items.length > MAX_TABS
  const primary = overflowed ? items.slice(0, MAX_TABS - 1) : items
  const overflow = overflowed ? items.slice(MAX_TABS - 1) : []
  const overflowActive = overflow.some((n) => location.pathname === n.to)

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  // Menú lateral (escritorio) y hoja "Más" (móvil).
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
      isActive
        ? 'bg-cyan-500 text-white'
        : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
    }`

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-0 text-[11px] font-medium transition-colors ${
      isActive
        ? 'text-cyan-600 dark:text-cyan-400'
        : 'text-gray-500 dark:text-slate-400'
    }`

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white">
        {/* Top bar */}
        <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
          <span className="font-bold">Panel · Nueva Casa</span>
          <div className="flex items-center gap-1">
            <ThemeToggle className={controlCls} />
            <button
              onClick={handleSignOut}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${controlCls}`}
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="md:flex">
          {/* Sidebar (escritorio) */}
          <aside className="hidden md:block w-56 shrink-0 border-r border-gray-200 dark:border-slate-800 min-h-[calc(100vh-3.5rem)] p-3">
            <nav className="space-y-1">
              {items.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>
                  <n.icon className="w-5 h-5" aria-hidden="true" />
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Contenido */}
          <main className="flex-1 p-4 pb-24 md:p-6 max-w-3xl w-full">
            {profile && (
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                Hola, {profile.full_name ?? 'staff'}
              </p>
            )}
            <Outlet />
          </main>
        </div>

        {/* Barra de navegación inferior (móvil) */}
        <nav
          className="md:hidden fixed bottom-0 inset-x-0 z-40 flex bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-gray-200 dark:border-slate-800"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          aria-label="Navegación"
        >
          {primary.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={tabClass}>
              <n.icon className="w-5 h-5" aria-hidden="true" />
              <span className="truncate max-w-full px-0.5">{n.label}</span>
            </NavLink>
          ))}
          {overflowed && (
            <button
              onClick={() => setMoreOpen(true)}
              aria-label="Más opciones"
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-w-0 text-[11px] font-medium transition-colors ${
                overflowActive
                  ? 'text-cyan-600 dark:text-cyan-400'
                  : 'text-gray-500 dark:text-slate-400'
              }`}
            >
              <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
              Más
            </button>
          )}
        </nav>

        {/* Hoja "Más" (móvil) */}
        {moreOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMoreOpen(false)}
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 inset-x-0 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl p-4"
              style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold">Más opciones</span>
                <button
                  onClick={() => setMoreOpen(false)}
                  aria-label="Cerrar"
                  className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${controlCls}`}
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <nav className="space-y-1">
                {overflow.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    end={n.end}
                    onClick={() => setMoreOpen(false)}
                    className={linkClass}
                  >
                    <n.icon className="w-5 h-5" aria-hidden="true" />
                    {n.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </ToastProvider>
  )
}
