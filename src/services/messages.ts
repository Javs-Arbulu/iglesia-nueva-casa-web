import { getSupabase } from '@/services/supabase'
import type { ContactSubmission } from '@/types'

/** Todos los mensajes de contacto (más recientes primero). Solo admin (RLS). */
export async function fetchMessages(): Promise<ContactSubmission[]> {
  const { data, error } = await getSupabase()
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as ContactSubmission[]) ?? []
}

/** Marca un mensaje como leído o no leído. */
export async function setMessageRead(id: string, read: boolean): Promise<void> {
  const { error } = await getSupabase()
    .from('contact_submissions')
    .update({ read })
    .eq('id', id)
  if (error) throw error
}

/** Borra un mensaje. */
export async function deleteMessage(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('contact_submissions')
    .delete()
    .eq('id', id)
  if (error) throw error
}
