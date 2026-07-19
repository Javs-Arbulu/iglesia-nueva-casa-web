import { useCallback, useEffect, useState } from 'react'
import { Loader2, Plus, Pencil, Trash2, Calendar } from 'lucide-react'
import { getSupabase } from '@/services/supabase'
import { formatEventDate } from '@/services/events'
import Modal from '@/components/common/Modal'
import type { Evento } from '@/types'

type Status = 'loading' | 'success' | 'error'

const pad = (n: number) => String(n).padStart(2, '0')
const toInput = (iso: string) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const EMPTY = { title: '', description: '', location: '', startsAt: '', published: false }

export default function Eventos() {
  const [events, setEvents] = useState<Evento[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [busy, setBusy] = useState(false)

  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState(EMPTY)

  const fetchEvents = useCallback(async (): Promise<Evento[]> => {
    const { data, error } = await getSupabase()
      .from('events')
      .select('*')
      .order('starts_at', { ascending: false })
    if (error) throw error
    return (data as Evento[]) ?? []
  }, [])

  useEffect(() => {
    let active = true
    fetchEvents()
      .then((d) => {
        if (!active) return
        setEvents(d)
        setStatus('success')
      })
      .catch((err) => {
        if (!active) return
        console.error(err)
        setStatus('error')
      })
    return () => {
      active = false
    }
  }, [fetchEvents])

  const refresh = async () => {
    try {
      setEvents(await fetchEvents())
    } catch (err) {
      console.error(err)
    }
  }

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
    })
    setEditingId(ev.id)
  }
  const close = () => setEditingId(null)

  const save = async () => {
    if (!form.title.trim() || !form.startsAt) return
    setBusy(true)
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      starts_at: new Date(form.startsAt).toISOString(),
      published: form.published,
    }
    const supabase = getSupabase()
    const { error } =
      editingId === 'new'
        ? await supabase.from('events').insert(payload)
        : await supabase.from('events').update(payload).eq('id', editingId)
    if (error) console.error(error)
    await refresh()
    setBusy(false)
    close()
  }

  const remove = async (ev: Evento) => {
    if (!window.confirm(`¿Eliminar el evento "${ev.title}"?`)) return
    setBusy(true)
    const { error } = await getSupabase().from('events').delete().eq('id', ev.id)
    if (error) console.error(error)
    await refresh()
    setBusy(false)
  }

  const togglePublish = async (ev: Evento) => {
    setBusy(true)
    await getSupabase()
      .from('events')
      .update({ published: !ev.published })
      .eq('id', ev.id)
    await refresh()
    setBusy(false)
  }

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Eventos</h1>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold text-sm px-4 py-2 rounded-full transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Nuevo
        </button>
      </div>

      {status === 'loading' && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 py-10">
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          Cargando…
        </div>
      )}
      {status === 'error' && (
        <p className="text-red-500">No se pudieron cargar los eventos.</p>
      )}
      {status === 'success' && events.length === 0 && (
        <p className="text-gray-500 dark:text-slate-400">
          Aún no hay eventos. Crea el primero con “Nuevo”.
        </p>
      )}

      {status === 'success' && events.length > 0 && (
        <ul className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 divide-y divide-gray-100 dark:divide-slate-800 overflow-hidden">
          {events.map((ev) => (
            <li key={ev.id} className="flex items-center gap-3 p-3">
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
                onClick={() => togglePublish(ev)}
                disabled={busy}
                className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors disabled:opacity-60 ${
                  ev.published
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300'
                    : 'bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-slate-400'
                }`}
                title={ev.published ? 'Publicado (clic para ocultar)' : 'Borrador (clic para publicar)'}
              >
                {ev.published ? 'Publicado' : 'Borrador'}
              </button>
              <button
                onClick={() => openEdit(ev)}
                aria-label={`Editar ${ev.title}`}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                <Pencil className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                onClick={() => remove(ev)}
                disabled={busy}
                aria-label={`Eliminar ${ev.title}`}
                className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

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
            className="w-full inline-flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60"
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
