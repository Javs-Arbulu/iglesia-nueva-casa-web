import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  CalendarDays,
  LogOut,
} from 'lucide-react'
import type { AppRole } from '@/types'
import { useAuth } from '@/features/auth/context'
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
  {
    to: '/admin/eventos',
    label: 'Eventos',
    icon: CalendarDays,
    roles: ['admin', 'editor'],
  },
  { to: '/admin/mensajes', label: 'Mensajes', icon: MessageSquare, roles: ['admin'] },
  { to: '/admin/usuarios', label: 'Usuarios', icon: Users, roles: ['admin'] },
]

const controlCls =
  'text-gray-700 hover:text-cyan-600 hover:bg-black/5 dark:text-white/90 dark:hover:text-cyan-400 dark:hover:bg-white/10'

export default function AdminLayout() {
  const { profile, hasRole, signOut } = useAuth()
  const navigate = useNavigate()
  const items = NAV.filter((n) => hasRole(...n.roles))

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
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
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block w-56 shrink-0 border-r border-gray-200 dark:border-slate-800 min-h-[calc(100vh-3.5rem)] p-3">
          <nav className="space-y-1">
            {items.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800'
                  }`
                }
              >
                <n.icon className="w-5 h-5" aria-hidden="true" />
                {n.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 p-4 pb-24 md:pb-8 max-w-3xl w-full">
          {profile && (
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
              Hola, {profile.full_name ?? 'staff'}
            </p>
          )}
          <Outlet />
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 flex bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-800">
        {items.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                isActive ? 'text-cyan-500' : 'text-gray-500 dark:text-slate-400'
              }`
            }
          >
            <n.icon className="w-5 h-5" aria-hidden="true" />
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
