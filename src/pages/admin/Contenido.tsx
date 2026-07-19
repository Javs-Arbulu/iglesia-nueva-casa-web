import { useEffect, useState } from 'react'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import {
  loadContent,
  pickAnnouncement,
  pickContact,
  saveBlock,
  type Announcement,
  type ContactContent,
  type Schedule,
} from '@/services/content'

export default function Contenido() {
  const [ann, setAnn] = useState<Announcement | null>(null)
  const [contact, setContact] = useState<ContactContent | null>(null)
  const [savingAnn, setSavingAnn] = useState(false)
  const [savingContact, setSavingContact] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    loadContent(true).then((blocks) => {
      if (!active) return
      setAnn(pickAnnouncement(blocks))
      setContact(pickContact(blocks))
    })
    return () => {
      active = false
    }
  }, [])

  const flash = (msg: string) => {
    setSaved(msg)
    setTimeout(() => setSaved(null), 2500)
  }

  const saveAnn = async () => {
    if (!ann) return
    setSavingAnn(true)
    try {
      await saveBlock('announcement', ann)
      flash('Anuncio guardado')
    } catch (e) {
      console.error(e)
    }
    setSavingAnn(false)
  }

  const saveContact = async () => {
    if (!contact) return
    setSavingContact(true)
    try {
      await saveBlock('contact', contact)
      flash('Horarios guardados')
    } catch (e) {
      console.error(e)
    }
    setSavingContact(false)
  }

  const setSchedule = (i: number, patch: Partial<Schedule>) =>
    setContact((c) =>
      c
        ? {
            ...c,
            schedules: c.schedules.map((s, idx) =>
              idx === i ? { ...s, ...patch } : s
            ),
          }
        : c
    )
  const addSchedule = () =>
    setContact((c) =>
      c ? { ...c, schedules: [...c.schedules, { name: '', day: '', time: '' }] } : c
    )
  const removeSchedule = (i: number) =>
    setContact((c) =>
      c ? { ...c, schedules: c.schedules.filter((_, idx) => idx !== i) } : c
    )

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'
  const cardCls =
    'bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5'
  const primaryBtn =
    'inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold text-sm px-4 py-2 rounded-full transition-colors disabled:opacity-60'

  if (!ann || !contact) {
    return (
      <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 py-10">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        Cargando…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contenido</h1>
        {saved && (
          <span className="text-sm text-green-600 dark:text-green-400">
            {saved} ✓
          </span>
        )}
      </div>

      {/* Anuncio / banner */}
      <section className={cardCls}>
        <h2 className="font-bold text-lg mb-3">Banner de anuncios</h2>
        <label className="flex items-center gap-3 cursor-pointer mb-3">
          <input
            type="checkbox"
            checked={ann.enabled}
            onChange={(e) => setAnn({ ...ann, enabled: e.target.checked })}
            className="w-5 h-5 rounded accent-cyan-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
            Mostrar el banner en el sitio
          </span>
        </label>
        <div className="space-y-3">
          <div>
            <label htmlFor="ann-text" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Texto
            </label>
            <input
              id="ann-text"
              type="text"
              value={ann.text}
              onChange={(e) => setAnn({ ...ann, text: e.target.value })}
              placeholder="Ej: ¡Este domingo, servicio especial de Navidad!"
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="ann-link" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Enlace (opcional)
            </label>
            <input
              id="ann-link"
              type="text"
              value={ann.link ?? ''}
              onChange={(e) => setAnn({ ...ann, link: e.target.value || null })}
              placeholder="/contacto  o  https://…"
              className={inputCls}
            />
          </div>
          <div className="flex justify-end">
            <button onClick={saveAnn} disabled={savingAnn} className={primaryBtn}>
              {savingAnn ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="w-4 h-4" aria-hidden="true" />
              )}
              Guardar anuncio
            </button>
          </div>
        </div>
      </section>

      {/* Horarios / contacto */}
      <section className={cardCls}>
        <h2 className="font-bold text-lg mb-3">Horarios y contacto</h2>
        <div className="space-y-3">
          <div>
            <label htmlFor="c-address" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Dirección
            </label>
            <input
              id="c-address"
              type="text"
              value={contact.address}
              onChange={(e) => setContact({ ...contact, address: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="c-city" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Ciudad
            </label>
            <input
              id="c-city"
              type="text"
              value={contact.city}
              onChange={(e) => setContact({ ...contact, city: e.target.value })}
              className={inputCls}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 mb-2">
              Horarios de reunión
            </p>
            <div className="space-y-2">
              {contact.schedules.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    aria-label="Nombre"
                    value={s.name}
                    onChange={(e) => setSchedule(i, { name: e.target.value })}
                    placeholder="Servicio"
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    aria-label="Día"
                    value={s.day}
                    onChange={(e) => setSchedule(i, { day: e.target.value })}
                    placeholder="Domingos"
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    aria-label="Hora"
                    value={s.time}
                    onChange={(e) => setSchedule(i, { time: e.target.value })}
                    placeholder="11:00 AM"
                    className={`${inputCls} w-28`}
                  />
                  <button
                    onClick={() => removeSchedule(i)}
                    aria-label="Quitar horario"
                    className="shrink-0 w-10 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addSchedule}
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Agregar horario
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveContact}
              disabled={savingContact}
              className={primaryBtn}
            >
              {savingContact ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Save className="w-4 h-4" aria-hidden="true" />
              )}
              Guardar horarios
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
