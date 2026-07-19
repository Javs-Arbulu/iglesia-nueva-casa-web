import { getSupabase } from '@/services/supabase'
import type { Evento } from '@/types'

/** Próximos eventos publicados (para el sitio público). */
export async function fetchUpcomingEvents(limit = 4): Promise<Evento[]> {
  const { data, error } = await getSupabase()
    .from('events')
    .select('*')
    .eq('published', true)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(limit)
  if (error) throw error
  return (data as Evento[]) ?? []
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
