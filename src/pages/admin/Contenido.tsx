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
import { useToast } from '@/features/toast/context'
import { useAuth } from '@/features/auth/context'
import PageHeader from '@/components/admin/PageHeader'
import HomeTextEditor from '@/components/admin/HomeTextEditor'
import NosotrosTextEditor from '@/components/admin/NosotrosTextEditor'
import MinisteriosTextEditor from '@/components/admin/MinisteriosTextEditor'
import { inputCls, cardCls, primaryBtn } from '@/lib/adminUi'

type Tab = 'banner' | 'horarios' | 'inicio' | 'nosotros' | 'ministerios'
const TABS: { id: Tab; label: string }[] = [
  { id: 'banner', label: 'Banner' },
  { id: 'horarios', label: 'Horarios' },
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'ministerios', label: 'Ministerios' },
]

export default function Contenido() {
  const [tab, setTab] = useState<Tab>('banner')
  const toast = useToast()
  const { can } = useAuth()
  const canEdit = can('contenido', 'edit')
  const [ann, setAnn] = useState<Announcement | null>(null)
  const [contact, setContact] = useState<ContactContent | null>(null)
  const [savingAnn, setSavingAnn] = useState(false)
  const [savingContact, setSavingContact] = useState(false)

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

  const saveAnn = async () => {
    if (!ann) return
    setSavingAnn(true)
    try {
      await saveBlock('announcement', ann)
      toast.success('Anuncio guardado.')
    } catch (e) {
      console.error(e)
      toast.error('No se pudo guardar el anuncio.')
    }
    setSavingAnn(false)
  }

  const saveContact = async () => {
    if (!contact) return
    setSavingContact(true)
    try {
      await saveBlock('contact', contact)
      toast.success('Horarios guardados.')
    } catch (e) {
      console.error(e)
      toast.error('No se pudieron guardar los horarios.')
    }
    setSavingContact(false)
  }

  const setSchedule = (i: number, patch: Partial<Schedule>) =>
    setContact((c) =>
      c ? { ...c, schedules: c.schedules.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) } : c
    )
  const addSchedule = () =>
    setContact((c) => (c ? { ...c, schedules: [...c.schedules, { name: '', day: '', time: '' }] } : c))
  const removeSchedule = (i: number) =>
    setContact((c) => (c ? { ...c, schedules: c.schedules.filter((_, idx) => idx !== i) } : c))

  return (
    <div>
      <PageHeader title="Contenido" />

      {/* Pestañas */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              tab === t.id
                ? 'bg-cyan-500 text-white'
                : 'bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-600 dark:text-slate-300 hover:border-cyan-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        {/* Banner de anuncios */}
        {tab === 'banner' && (
          <div className={cardCls + ' space-y-4'}>
            {!ann ? (
              <Loading />
            ) : (
            <>
              <label className="flex items-center gap-3 cursor-pointer">
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
                  placeholder="https://…  o  /contacto"
                  className={inputCls}
                />
                <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                  Si lo defines, el banner redirige a esa página o sitio al hacer clic.
                </p>
              </div>
              <div>
                <label htmlFor="ann-speed" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
                  Velocidad del texto (segundos)
                </label>
                <input
                  id="ann-speed"
                  type="number"
                  min={3}
                  max={120}
                  step={1}
                  value={ann.speed}
                  onChange={(e) => {
                    const n = Number(e.target.value)
                    setAnn({ ...ann, speed: Number.isFinite(n) ? n : 0 })
                  }}
                  className={`${inputCls} w-32`}
                />
                <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                  Cuánto tarda el texto en dar una vuelta. Menor = más rápido (recomendado 15–30).
                </p>
              </div>
              {canEdit && (
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
              )}
            </>
            )}
          </div>
        )}

        {/* Horarios y contacto */}
        {tab === 'horarios' && (
          <div className={cardCls + ' space-y-4'}>
            {!contact ? (
              <Loading />
            ) : (
              <>
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
                <div className="space-y-3 sm:space-y-2">
                  {contact.schedules.map((s, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row gap-2 rounded-xl bg-gray-50 dark:bg-slate-800/50 p-2 sm:p-0 sm:bg-transparent sm:dark:bg-transparent"
                    >
                      <input
                        aria-label="Nombre del servicio"
                        value={s.name}
                        onChange={(e) => setSchedule(i, { name: e.target.value })}
                        placeholder="Servicio (ej. Dominical)"
                        className={`${inputCls} min-w-0 sm:flex-1`}
                      />
                      <input
                        aria-label="Día"
                        value={s.day}
                        onChange={(e) => setSchedule(i, { day: e.target.value })}
                        placeholder="Día (ej. Domingos)"
                        className={`${inputCls} min-w-0 sm:flex-1`}
                      />
                      <div className="flex gap-2">
                        <input
                          aria-label="Hora"
                          value={s.time}
                          onChange={(e) => setSchedule(i, { time: e.target.value })}
                          placeholder="11:00 AM"
                          className={`${inputCls} min-w-0 flex-1 sm:flex-none sm:w-28`}
                        />
                        <button
                          onClick={() => removeSchedule(i)}
                          aria-label="Quitar horario"
                          className="shrink-0 w-11 flex items-center justify-center rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
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
              {canEdit && (
                <div className="flex justify-end">
                  <button onClick={saveContact} disabled={savingContact} className={primaryBtn}>
                    {savingContact ? (
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Save className="w-4 h-4" aria-hidden="true" />
                    )}
                    Guardar horarios
                  </button>
                </div>
              )}
            </>
            )}
          </div>
        )}

        {/* Textos por pantalla */}
        {tab === 'inicio' && (
          <div className={cardCls}>
            <HomeTextEditor readOnly={!canEdit} />
          </div>
        )}
        {tab === 'nosotros' && (
          <div className={cardCls}>
            <NosotrosTextEditor readOnly={!canEdit} />
          </div>
        )}
        {tab === 'ministerios' && (
          <div className={cardCls}>
            <MinisteriosTextEditor readOnly={!canEdit} />
          </div>
        )}
      </div>
    </div>
  )
}

function Loading() {
  return (
    <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 py-6">
      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
      Cargando…
    </div>
  )
}
