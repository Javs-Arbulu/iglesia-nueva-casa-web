import { getSupabase } from '@/services/supabase'

const BUCKET = 'material'

export interface MaterialItem {
  id: string
  title: string
  description: string | null
  category: string
  path: string
  published: boolean
  created_at: string
}

export interface MaterialInput {
  title: string
  description: string | null
  category: string
}

/** Todo el material (staff ve todo; miembro activo solo lo publicado, por RLS). */
export async function fetchMaterial(): Promise<MaterialItem[]> {
  const { data, error } = await getSupabase()
    .from('material')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as MaterialItem[]) ?? []
}

/** Material publicado (para el área de miembros). */
export async function fetchPublishedMaterial(): Promise<MaterialItem[]> {
  const { data, error } = await getSupabase()
    .from('material')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as MaterialItem[]) ?? []
}

/** Un material por id (RLS decide si el usuario puede verlo). */
export async function fetchMaterialById(id: string): Promise<MaterialItem | null> {
  const { data, error } = await getSupabase()
    .from('material')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return (data as MaterialItem | null) ?? null
}

/** Sube el PDF al bucket privado y registra el material. */
export async function uploadMaterial(file: File, input: MaterialInput): Promise<void> {
  const supabase = getSupabase()
  const cat = input.category.trim() || 'General'
  const safe = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9-]+/gi, '-')
  const folder = cat.toLowerCase().replace(/[^a-z0-9]+/gi, '-') || 'general'
  const path = `${folder}/${Date.now()}-${safe || 'doc'}.pdf`

  const { error: upErr } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: 'application/pdf', upsert: false })
  if (upErr) throw upErr

  const { error: dbErr } = await supabase.from('material').insert({
    title: input.title.trim(),
    description: input.description?.trim() || null,
    category: cat,
    path,
  })
  if (dbErr) throw dbErr
}

export async function updateMaterial(id: string, input: MaterialInput): Promise<void> {
  const { error } = await getSupabase()
    .from('material')
    .update({
      title: input.title.trim(),
      description: input.description?.trim() || null,
      category: input.category.trim() || 'General',
    })
    .eq('id', id)
  if (error) throw error
}

export async function setMaterialPublished(id: string, published: boolean): Promise<void> {
  const { error } = await getSupabase().from('material').update({ published }).eq('id', id)
  if (error) throw error
}

export async function deleteMaterial(item: MaterialItem): Promise<void> {
  const supabase = getSupabase()
  await supabase.storage.from(BUCKET).remove([item.path])
  const { error } = await supabase.from('material').delete().eq('id', item.id)
  if (error) throw error
}

/** URL firmada temporal para VER el PDF incrustado. */
export async function getViewUrl(path: string): Promise<string> {
  const { data, error } = await getSupabase().storage
    .from(BUCKET)
    .createSignedUrl(path, 3600)
  if (error) throw error
  return data.signedUrl
}

/** URL firmada temporal que fuerza la DESCARGA con nombre legible. */
export async function getDownloadUrl(path: string, filename: string): Promise<string> {
  const safe = `${filename.replace(/[^a-z0-9-_ ]+/gi, '').trim() || 'material'}.pdf`
  const { data, error } = await getSupabase().storage
    .from(BUCKET)
    .createSignedUrl(path, 3600, { download: safe })
  if (error) throw error
  return data.signedUrl
}
