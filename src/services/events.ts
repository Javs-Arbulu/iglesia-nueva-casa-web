import { getSupabase } from '@/services/supabase'
import type { Evento } from '@/types'

/** Marca de tiempo (ms) del inicio del día de hoy en hora local. */
function startOfTodayMs(): number {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

/**
 * ¿El evento ya pasó? Se considera "pasado" solo a partir del día siguiente:
 * un evento de HOY sigue contando como vigente durante todo el día.
 */
export function isPastEvent(startsAt: string): boolean {
  return new Date(startsAt).getTime() < startOfTodayMs()
}

/** Próximos eventos publicados (desde hoy en adelante). */
export async function fetchUpcomingEvents(limit = 4): Promise<Evento[]> {
  const { data, error } = await getSupabase()
    .from('events')
    .select('*')
    .eq('published', true)
    .gte('starts_at', new Date(startOfTodayMs()).toISOString())
    .order('starts_at', { ascending: true })
    .limit(limit)
  if (error) throw error
  return (data as Evento[]) ?? []
}

/**
 * Eventos publicados para el Home: NO oculta los pasados. Devuelve primero los
 * próximos (más cercano primero) y luego los ya realizados (más reciente
 * primero) para mostrarlos atenuados/en blanco y negro. Así la sección nunca
 * queda vacía.
 */
export async function fetchRecentEvents(limit = 4): Promise<Evento[]> {
  const { data, error } = await getSupabase()
    .from('events')
    .select('*')
    .eq('published', true)
    .order('starts_at', { ascending: true })
  if (error) throw error
  const all = (data as Evento[]) ?? []
  const upcoming = all.filter((e) => !isPastEvent(e.starts_at))
  const past = all.filter((e) => isPastEvent(e.starts_at)).reverse()
  return [...upcoming, ...past].slice(0, limit)
}

/** Fecha de evento legible en español (es-PE). */
export function formatEventDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}
