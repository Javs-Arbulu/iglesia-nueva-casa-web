import type { Predica, LiveStatus } from '@/types'

/**
 * Obtiene las últimas prédicas desde la función serverless (/api/predicas),
 * que lee el feed RSS público del canal de YouTube. Sin API key ni cuota.
 */
export async function fetchPredicas(signal?: AbortSignal): Promise<Predica[]> {
  const res = await fetch('/api/predicas', { signal })
  if (!res.ok) {
    throw new Error(`No se pudieron cargar las prédicas (${res.status})`)
  }
  const data: { videos?: Predica[] } = await res.json()
  return data.videos ?? []
}

/** Consulta si el canal está transmitiendo en vivo ahora. */
export async function fetchLiveStatus(signal?: AbortSignal): Promise<LiveStatus> {
  const res = await fetch('/api/live', { signal })
  if (!res.ok) return { live: false }
  return res.json()
}

/** Formatea la fecha ISO del video a algo legible en español (es-PE). */
export function formatPredicaDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
