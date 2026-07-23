import { getSupabase } from '@/services/supabase'
import { compressImage } from '@/lib/image'
import type { MediaItem } from '@/types'

const BUCKET = 'public-images'

/** URL pública de una imagen del bucket. */
export function mediaUrl(path: string): string {
  return getSupabase().storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/**
 * Comprime y sube una imagen al bucket y devuelve su URL pública, SIN
 * registrarla en la galería (`media`). Útil para portadas (ej. eventos).
 */
export async function uploadImageFile(
  file: File,
  folder = 'eventos'
): Promise<string> {
  const supabase = getSupabase()
  const blob = await compressImage(file)
  const safe = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]+/gi, '-')
  const path = `${folder}/${Date.now()}-${safe || 'img'}.jpg`
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false })
  if (error) throw error
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/** Comprime y sube una imagen, y registra su metadato. */
export async function uploadImage(
  file: File,
  opts: { alt?: string; category?: string } = {}
): Promise<void> {
  const supabase = getSupabase()
  const blob = await compressImage(file)
  const safe = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]+/gi, '-')
  const path = `${opts.category ?? 'galeria'}/${Date.now()}-${safe || 'img'}.jpg`

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: 'image/jpeg', upsert: false })
  if (upErr) throw upErr

  const { error: dbErr } = await supabase.from('media').insert({
    path,
    alt: opts.alt ?? null,
    category: opts.category ?? 'galeria',
  })
  if (dbErr) throw dbErr
}

/** Lista de imágenes (staff ve todas; público vería solo publicadas por RLS). */
export async function fetchMedia(): Promise<MediaItem[]> {
  const { data, error } = await getSupabase()
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as MediaItem[]) ?? []
}

/** Galería pública (imágenes publicadas). */
export async function fetchGallery(limit = 60): Promise<MediaItem[]> {
  const { data, error } = await getSupabase()
    .from('media')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as MediaItem[]) ?? []
}

/** Borra la imagen del Storage y su metadato. */
export async function deleteImage(item: MediaItem): Promise<void> {
  const supabase = getSupabase()
  await supabase.storage.from(BUCKET).remove([item.path])
  const { error } = await supabase.from('media').delete().eq('id', item.id)
  if (error) throw error
}

/** Publica u oculta una imagen. */
export async function setMediaPublished(
  item: MediaItem,
  published: boolean
): Promise<void> {
  const { error } = await getSupabase()
    .from('media')
    .update({ published })
    .eq('id', item.id)
  if (error) throw error
}

/** Actualiza el texto alternativo y/o la categoría (álbum) de una imagen. */
export async function updateMedia(
  id: string,
  patch: { alt?: string | null; category?: string }
): Promise<void> {
  const { error } = await getSupabase().from('media').update(patch).eq('id', id)
  if (error) throw error
}

/** Renombra un álbum: mueve todas las fotos de una categoría a otra. */
export async function renameCategory(from: string, to: string): Promise<void> {
  const { error } = await getSupabase()
    .from('media')
    .update({ category: to })
    .eq('category', from)
  if (error) throw error
}

/** Publica u oculta todas las fotos de un álbum (categoría) a la vez. */
export async function setCategoryPublished(
  category: string,
  published: boolean
): Promise<void> {
  const { error } = await getSupabase()
    .from('media')
    .update({ published })
    .eq('category', category)
  if (error) throw error
}
