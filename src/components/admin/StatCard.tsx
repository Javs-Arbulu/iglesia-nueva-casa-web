import { Link } from 'react-router-dom'
import { ChevronRight, type LucideIcon } from 'lucide-react'

type Accent = 'cyan' | 'green' | 'red' | 'amber'

const ACCENT: Record<Accent, string> = {
  cyan: 'text-cyan-500',
  green: 'text-green-500',
  red: 'text-red-500',
  amber: 'text-amber-500',
}

interface StatCardProps {
  to: string
  icon: LucideIcon
  label: string
  value: string | number
  /** Texto secundario (ej. el próximo evento o el desglose del mes). */
  hint?: string
  accent?: Accent
  /** Resalta la tarjeta cuando requiere atención (ej. usuarios pendientes). */
  highlight?: boolean
}

/** Tarjeta de métrica del dashboard; toda la tarjeta enlaza a su módulo. */
export default function StatCard({
  to,
  icon: Icon,
  label,
  value,
  hint,
  accent = 'cyan',
  highlight = false,
}: StatCardProps) {
  return (
    <Link
      to={to}
      className={`group block rounded-2xl border p-5 transition-colors ${
        highlight
          ? 'border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10'
          : 'border-gray-100 bg-white hover:border-cyan-400 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-cyan-500'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-slate-400">
          {label}
        </span>
        <Icon className={`w-5 h-5 ${ACCENT[accent]}`} aria-hidden="true" />
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
        <span className="truncate">{hint ?? 'Ver detalle'}</span>
        <ChevronRight
          className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </p>
    </Link>
  )
}
