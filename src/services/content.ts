import { getSupabase } from '@/services/supabase'
import { CHURCH_INFO } from '@/lib/constants'

export interface Announcement {
  enabled: boolean
  text: string
  link: string | null
}

export interface Schedule {
  name: string
  day: string
  time: string
}

export interface ContactContent {
  address: string
  city: string
  schedules: Schedule[]
}

const DEFAULT_ANNOUNCEMENT: Announcement = { enabled: false, text: '', link: null }
const DEFAULT_CONTACT: ContactContent = {
  address: CHURCH_INFO.address,
  city: CHURCH_INFO.city,
  schedules: CHURCH_INFO.schedules.map((s) => ({ ...s })),
}

let cache: Promise<Record<string, unknown>> | null = null

async function fetchBlocks(): Promise<Record<string, unknown>> {
  try {
    const { data, error } = await getSupabase()
      .from('content_blocks')
      .select('key, value')
    if (error) throw error
    const map: Record<string, unknown> = {}
    for (const row of (data ?? []) as { key: string; value: unknown }[]) {
      map[row.key] = row.value
    }
    return map
  } catch (err) {
    console.error('No se pudo cargar el contenido:', err)
    return {}
  }
}

/** Carga (cacheada) de todos los bloques de contenido. */
export function loadContent(force = false): Promise<Record<string, unknown>> {
  if (!cache || force) cache = fetchBlocks()
  return cache
}

export function pickAnnouncement(blocks: Record<string, unknown>): Announcement {
  return { ...DEFAULT_ANNOUNCEMENT, ...((blocks.announcement as object) ?? {}) }
}

export function pickContact(blocks: Record<string, unknown>): ContactContent {
  const c = (blocks.contact as Partial<ContactContent>) ?? {}
  return {
    address: c.address ?? DEFAULT_CONTACT.address,
    city: c.city ?? DEFAULT_CONTACT.city,
    schedules:
      c.schedules && c.schedules.length > 0
        ? c.schedules
        : DEFAULT_CONTACT.schedules,
  }
}

export const defaults = {
  announcement: DEFAULT_ANNOUNCEMENT,
  contact: DEFAULT_CONTACT,
}

/** Guarda (upsert) un bloque y limpia la caché. */
export async function saveBlock(key: string, value: unknown): Promise<void> {
  const { error } = await getSupabase()
    .from('content_blocks')
    .upsert({ key, value, updated_at: new Date().toISOString() })
  if (error) throw error
  cache = null
}
