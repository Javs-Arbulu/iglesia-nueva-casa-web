import { getSupabase } from '@/services/supabase'
import { fetchTransactions, monthSummary } from '@/services/finance'
import type { Evento } from '@/types'

export interface DashboardStats {
  messages?: number
  pendingUsers?: number
  photos?: { total: number; hidden: number }
  events?: { upcoming: number; next: Evento | null }
  finance?: { ingresos: number; egresos: number; balance: number }
}

/** ¿El usuario puede ver el módulo? (según la matriz de permisos). */
type CanView = (moduleId: string) => boolean

/**
 * Carga las métricas del panel solo de los módulos que el usuario puede ver, así
 * el Inicio muestra únicamente su información accesible (y no dispara consultas
 * que RLS rechazaría). Cada bloque falla de forma aislada.
 */
export async function loadDashboard(canView: CanView): Promise<DashboardStats> {
  const supabase = getSupabase()
  const stats: DashboardStats = {}
  const tasks: Promise<void>[] = []

  if (canView('mensajes')) {
    tasks.push(
      (async () => {
        const { count } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('read', false)
        stats.messages = count ?? 0
      })()
    )
  }

  if (canView('usuarios')) {
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

  if (canView('eventos')) {
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
  }

  if (canView('fotos')) {
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

  if (canView('finanzas')) {
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
