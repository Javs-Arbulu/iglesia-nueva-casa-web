import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  MessageSquare,
  CalendarDays,
  CalendarPlus,
  Image as ImageIcon,
  ImagePlus,
  Wallet,
  FileText,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/features/auth/context'
import { useAsyncData } from '@/hooks/useAsyncData'
import { loadDashboard, type DashboardStats } from '@/services/dashboard'
import { formatPEN } from '@/services/finance'
import { formatEventDate } from '@/services/events'
import type { ModuleAction } from '@/lib/modules'
import AsyncState from '@/components/admin/AsyncState'
import StatCard from '@/components/admin/StatCard'

interface QuickAction {
  to: string
  label: string
  icon: LucideIcon
  module: string
  action: ModuleAction
}

const QUICK_ACTIONS: QuickAction[] = [
  { to: '/admin/eventos?nuevo=1', label: 'Nuevo evento', icon: CalendarPlus, module: 'eventos', action: 'edit' },
  { to: '/admin/finanzas?nuevo=1', label: 'Nuevo movimiento', icon: Wallet, module: 'finanzas', action: 'edit' },
  { to: '/admin/fotos', label: 'Subir fotos', icon: ImagePlus, module: 'fotos', action: 'edit' },
  { to: '/admin/contenido', label: 'Editar contenido', icon: FileText, module: 'contenido', action: 'edit' },
]

export default function Dashboard() {
  const { can } = useAuth()
  const fetcher = useCallback(() => loadDashboard((m) => can(m, 'view')), [can])
  const { data: stats, status } = useAsyncData(fetcher, {} as DashboardStats)

  const actions = QUICK_ACTIONS.filter((a) => can(a.module, a.action))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Panel administrativo</h1>
      <p className="text-gray-600 dark:text-slate-300 mb-6">
        Un vistazo rápido a lo que puedes gestionar.
      </p>

      <AsyncState status={status} loadingText="Cargando panel…">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {stats.pendingUsers !== undefined && (
            <StatCard
              to="/admin/usuarios"
              icon={Users}
              label="Pendientes"
              value={stats.pendingUsers}
              accent={stats.pendingUsers > 0 ? 'amber' : 'cyan'}
              highlight={stats.pendingUsers > 0}
              hint={stats.pendingUsers > 0 ? 'Por aprobar' : 'Nadie pendiente'}
            />
          )}

          {stats.messages !== undefined && (
            <StatCard
              to="/admin/mensajes"
              icon={MessageSquare}
              label="Sin leer"
              value={stats.messages}
              accent={stats.messages > 0 ? 'amber' : 'cyan'}
              highlight={stats.messages > 0}
              hint={stats.messages > 0 ? 'Mensajes sin leer' : 'Todo al día'}
            />
          )}

          {stats.events && (
            <StatCard
              to="/admin/eventos"
              icon={CalendarDays}
              label="Próximos eventos"
              value={stats.events.upcoming}
              hint={
                stats.events.next
                  ? `${stats.events.next.title} · ${formatEventDate(stats.events.next.starts_at)}`
                  : 'Sin eventos próximos'
              }
            />
          )}

          {stats.photos && (
            <StatCard
              to="/admin/fotos"
              icon={ImageIcon}
              label="Fotos"
              value={stats.photos.total}
              hint={
                stats.photos.hidden > 0
                  ? `${stats.photos.hidden} oculta${stats.photos.hidden > 1 ? 's' : ''}`
                  : 'Todas visibles'
              }
            />
          )}

          {stats.finance && (
            <StatCard
              to="/admin/finanzas"
              icon={Wallet}
              label="Balance del mes"
              value={formatPEN(stats.finance.balance)}
              accent={stats.finance.balance >= 0 ? 'green' : 'red'}
              hint={`+${formatPEN(stats.finance.ingresos)} · −${formatPEN(stats.finance.egresos)}`}
            />
          )}
        </div>

        {actions.length > 0 && (
          <>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400 mt-8 mb-3">
              Accesos rápidos
            </h2>
            <div className="flex flex-wrap gap-2">
              {actions.map((a) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-cyan-400 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-cyan-500 dark:hover:text-cyan-400"
                >
                  <a.icon className="w-4 h-4" aria-hidden="true" />
                  {a.label}
                </Link>
              ))}
            </div>
          </>
        )}
      </AsyncState>
    </div>
  )
}
