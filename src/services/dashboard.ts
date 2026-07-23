import { getSupabase } from '@/services/supabase'
import { fetchTransactions, monthSummary } from '@/services/finance'
import type { AppRole, Evento } from '@/types'

export interface DashboardStats {
  messages?: number
  pendingUsers?: number
  photos?: { total: number; hidden: number }
  events?: { upcoming: number; next: Evento | null }
  finance?: { ingresos: number; egresos: number; balance: number }
}

type HasRole = (...roles: AppRole[]) => boolean

/**
 * Carga las métricas del panel según los permisos del usuario. Sólo se consulta
 * lo que su rol puede ver, así no se disparan consultas que RLS rechazaría.
 * Cada bloque falla de forma aislada (un error no tumba todo el dashboard).
 */
export async function loadDashboard(has: HasRole): Promise<DashboardStats> {
  const supabase = getSupabase()
  const stats: DashboardStats = {}
  const tasks: Promise<void>[] = []

  if (has('admin')) {
    tasks.push(
      (async () => {
        const { count } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('read', false)
        stats.messages = count ?? 0
      })()
    )
    tasks.push(
      (async () => {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
        stats.pendingUsers = count ?? 0
      })()
    )
  }

  if (has('admin', 'editor')) {
    tasks.push(
      (async () => {
        const { data } = await supabase
          .from('events')
          .select('*')
          .gte('starts_at', new Date().toISOString())
          .order('starts_at', { ascending: true })
        const upcoming = (data as Evento[]) ?? []
        stats.events = { upcoming: upcoming.length, next: upcoming[0] ?? null }
      })()
    )
    tasks.push(
      (async () => {
        const { data } = await supabase.from('media').select('published')
        const rows = (data as { published: boolean }[]) ?? []
        stats.photos = {
          total: rows.length,
          hidden: rows.filter((r) => !r.published).length,
        }
      })()
    )
  }

  if (has('admin', 'finanzas')) {
    tasks.push(
      (async () => {
        const txs = await fetchTransactions()
        stats.finance = monthSummary(txs)
      })()
    )
  }

  await Promise.allSettled(tasks)
  return stats
}
