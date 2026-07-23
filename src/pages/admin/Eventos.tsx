import { useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, Plus, Pencil, Trash2, Calendar, ImagePlus, X } from 'lucide-react'
import { getSupabase } from '@/services/supabase'
import { formatEventDate } from '@/services/events'
import { uploadImageFile } from '@/services/media'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/features/toast/context'
import { useAuth } from '@/features/auth/context'
import AsyncState from '@/components/admin/AsyncState'
import PageHeader from '@/components/admin/PageHeader'
import Modal from '@/components/common/Modal'
import { inputCls, listCardCls, primaryBtn, primaryBtnBlock } from '@/lib/adminUi'
import type { Evento } from '@/types'

const pad = (n: number) => String(n).padStart(2, '0')
const toInput = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const EMPTY = {
  title: '',
  description: '',
  location: '',
  startsAt: '',
  published: false,
  imageUrl: '',
}

async function fetchEvents(): Promise<Evento[]> {
  const { data, error } = await getSupabase()
    .from('events')
    .select('*')
    .order('starts_at', { ascending: false })
  if (error) throw error
  return (data as Evento[]) ?? []
}

export default function Eventos() {
  const toast = useToast()
  const { can } = useAuth()
  const canEdit = can('eventos', 'edit')
  const canDelete = can('eventos', 'delete')
  const { data: events, status, refresh } = useAsyncData(fetchEvents, [] as Evento[])
  const [busy, setBusy] = useState(false)

  // Abre el modal de alta al llegar desde el acceso rápido del dashboard (?nuevo=1).
  const [searchParams] = useSearchParams()
  const [editingId, setEditingId] = useState<string | 'new' | null>(
    searchParams.get('nuevo') !== null ? 'new' : null
  )
  const [form, setForm] = useState(EMPTY)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const openNew = () => {
    setForm(EMPTY)
    setEditingId('new')
  }
  const openEdit = (ev: Evento) => {
    setForm({
      title: ev.title,
      description: ev.description ?? '',
      location: ev.location ?? '',
      startsAt: toInput(ev.starts_at),
      published: ev.published,
      imageUrl: ev.image_url ?? '',
    })
    setEditingId(ev.id)
  }
  const close = () => setEditingId(null)

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (fileRef.current) fileRef.current.value = ''
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImageFile(file)
      setForm((f) => ({ ...f, imageUrl: url }))
      toast.success('Imagen lista.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo subir la imagen.')
    }
    setUploading(false)
  }

  const save = async () => {
    if (!form.title.trim() || !form.startsAt) return
    setBusy(true)
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      starts_at: new Date(form.startsAt).toISOString(),
      published: form.published,
      image_url: form.imageUrl || null,
    }
    const supabase = getSupabase()
    const { error } =
      editingId === 'new'
        ? await supabase.from('events').insert(payload)
        : await supabase.from('events').update(payload).eq('id', editingId)
    if (error) {
      console.error(error)
      toast.error('No se pudo guardar el evento.')
    } else {
      toast.success(editingId === 'new' ? 'Evento creado.' : 'Evento actualizado.')
      close()
    }
    await refresh()
    setBusy(false)
  }

  const remove = async (ev: Evento) => {
    if (!window.confirm(`¿Eliminar el evento "${ev.title}"?`)) return
    setBusy(true)
    const { error } = await getSupabase().from('events').delete().eq('id', ev.id)
    if (error) {
      console.error(error)
      toast.error('No se pudo eliminar el evento.')
    } else {
      toast.success('Evento eliminado.')
    }
    await refresh()
    setBusy(false)
  }

  const togglePublish = async (ev: Evento) => {
    setBusy(true)
    const { error } = await getSupabase()
      .from('events')
      .update({ published: !ev.published })
      .eq('id', ev.id)
    if (error) {
      console.error(error)
      toast.error('No se pudo cambiar la publicación.')
    } else {
      toast.success(ev.published ? 'Evento ocultado.' : 'Evento publicado.')
    }
    await refresh()
    setBusy(false)
  }

  return (
    <div>
      <PageHeader
        title="Eventos"
        action={
          canEdit ? (
            <button onClick={openNew} className={primaryBtn}>
              <Plus className="w-4 h-4" aria-hidden="true" />
              Nuevo
            </button>
          ) : undefined
        }
      />

      <AsyncState
        status={status}
        isEmpty={events.length === 0}
        errorText="No se pudieron cargar los eventos."
        emptyText="Aún no hay eventos. Crea el primero con “Nuevo”."
      >
        <ul className={listCardCls}>
          {events.map((ev) => (
            <li key={ev.id} className="flex items-center gap-3 p-3">
              {ev.image_url && (
                <img
                  src={ev.image_url}
                  alt=""
                  loading="lazy"
                  className="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-100 dark:bg-slate-800"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {ev.title}
                </p>
                <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span className="truncate">{formatEventDate(ev.starts_at)}</span>
                </p>
              </div>
              <button
                onClick={() => (canEdit ? togglePublish(ev) : undefined)}
                disabled={busy || !canEdit}
                className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors disabled:opacity-60 ${
                  ev.published
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                } ${canEdit ? '' : 'cursor-default'}`}
                title={
                  canEdit
                    ? ev.published
                      ? 'Publicado (clic para ocultar)'
                      : 'Borrador (clic para publicar)'
                    : ev.published
                      ? 'Publicado'
                      : 'Borrador'
                }
              >
                {ev.published ? 'Publicado' : 'Borrador'}
              </button>
              {canEdit && (
                <button
                  onClick={() => openEdit(ev)}
                  aria-label={`Editar ${ev.title}`}
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <Pencil className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => remove(ev)}
                  disabled={busy}
                  aria-label={`Eliminar ${ev.title}`}
                  className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-60"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </AsyncState>

      <Modal
        open={editingId !== null}
        onClose={close}
        title={editingId === 'new' ? 'Nuevo evento' : 'Editar evento'}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="ev-title" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Título
            </label>
            <input
              id="ev-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="ev-date" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Fecha y hora
            </label>
            <input
              id="ev-date"
              type="datetime-local"
              value={form.startsAt}
              onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="ev-loc" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Lugar
            </label>
            <input
              id="ev-loc"
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Imagen (opcional)
            </label>
            {form.imageUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
                <img
                  src={form.imageUrl}
                  alt="Vista previa del evento"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, imageUrl: '' }))}
                  aria-label="Quitar imagen"
                  className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full flex flex-col items-center justify-center gap-2 aspect-video rounded-xl border-2 border-dashed border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-cyan-400 hover:text-cyan-500 transition-colors disabled:opacity-60"
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
                ) : (
                  <>
                    <ImagePlus className="w-6 h-6" aria-hidden="true" />
                    <span className="text-sm font-medium">Subir imagen</span>
                  </>
                )}
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPickImage}
              className="hidden"
            />
          </div>
          <div>
            <label htmlFor="ev-desc" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Descripción
            </label>
            <textarea
              id="ev-desc"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={`${inputCls} resize-none`}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="w-5 h-5 rounded accent-cyan-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
              Publicar en el sitio
            </span>
          </label>

          <button
            onClick={save}
            disabled={busy || !form.title.trim() || !form.startsAt}
            className={primaryBtnBlock}
          >
            {busy ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </Modal>
    </div>
  )
}
