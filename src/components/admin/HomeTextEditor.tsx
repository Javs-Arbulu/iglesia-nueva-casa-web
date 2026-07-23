import { useEffect, useState } from 'react'
import { Loader2, Save, RotateCcw } from 'lucide-react'
import {
  loadHomeText,
  saveHomeText,
  DEFAULT_HOME,
  type HomeText,
} from '@/services/siteText'
import { useToast } from '@/features/toast/context'
import { primaryBtn } from '@/lib/adminUi'
import { Field, GroupTitle } from '@/components/admin/contentUi'

export default function HomeTextEditor() {
  const toast = useToast()
  const [t, setT] = useState<HomeText | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    loadHomeText().then((x) => {
      if (active) setT(x)
    })
    return () => {
      active = false
    }
  }, [])

  if (!t) {
    return (
      <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 py-6">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        Cargando…
      </div>
    )
  }

  const setHero = (p: Partial<HomeText['hero']>) =>
    setT((s) => (s ? { ...s, hero: { ...s.hero, ...p } } : s))
  const setAdn = (p: Partial<HomeText['adn']>) =>
    setT((s) => (s ? { ...s, adn: { ...s.adn, ...p } } : s))
  const setValue = (i: number, p: Partial<HomeText['adn']['values'][number]>) =>
    setT((s) =>
      s
        ? { ...s, adn: { ...s.adn, values: s.adn.values.map((v, idx) => (idx === i ? { ...v, ...p } : v)) } }
        : s
    )
  const setPurpose = (p: Partial<HomeText['purpose']>) =>
    setT((s) => (s ? { ...s, purpose: { ...s.purpose, ...p } } : s))
  const setCard = (i: number, p: Partial<HomeText['purpose']['cards'][number]>) =>
    setT((s) =>
      s
        ? { ...s, purpose: { ...s.purpose, cards: s.purpose.cards.map((c, idx) => (idx === i ? { ...c, ...p } : c)) } }
        : s
    )
  const setVol = (p: Partial<HomeText['volunteering']>) =>
    setT((s) => (s ? { ...s, volunteering: { ...s.volunteering, ...p } } : s))
  const setEvents = (p: Partial<HomeText['events']>) =>
    setT((s) => (s ? { ...s, events: { ...s.events, ...p } } : s))

  const save = async () => {
    setSaving(true)
    try {
      await saveHomeText(t)
      toast.success('Textos de Inicio guardados.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudieron guardar los textos.')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <GroupTitle>Portada (Hero)</GroupTitle>
      <Field label="Badge" value={t.hero.badge} onChange={(v) => setHero({ badge: v })} />
      <Field label="Título" value={t.hero.title} onChange={(v) => setHero({ title: v })} />
      <Field label="Palabra destacada" value={t.hero.accent} onChange={(v) => setHero({ accent: v })} />
      <Field label="Subtítulo" textarea value={t.hero.subtitle} onChange={(v) => setHero({ subtitle: v })} />
      <Field label="Botón ubicación" value={t.hero.btnLocation} onChange={(v) => setHero({ btnLocation: v })} />
      <Field label="Botón en vivo" value={t.hero.btnLive} onChange={(v) => setHero({ btnLive: v })} />

      <GroupTitle>Descubre quiénes somos (ADN)</GroupTitle>
      <Field label="Tag" value={t.adn.tag} onChange={(v) => setAdn({ tag: v })} />
      <Field label="Título" value={t.adn.title} onChange={(v) => setAdn({ title: v })} />
      <Field label="Palabra destacada" value={t.adn.accent} onChange={(v) => setAdn({ accent: v })} />
      <Field label="Descripción" textarea value={t.adn.description} onChange={(v) => setAdn({ description: v })} />
      <Field label="Texto del botón" value={t.adn.cta} onChange={(v) => setAdn({ cta: v })} />
      {t.adn.values.map((v, i) => (
        <div key={i} className="grid sm:grid-cols-2 gap-2 rounded-xl bg-gray-50 dark:bg-slate-800 p-3">
          <Field label={`Valor ${i + 1} · título`} value={v.title} onChange={(val) => setValue(i, { title: val })} />
          <Field label="Descripción" value={v.description} onChange={(val) => setValue(i, { description: val })} />
        </div>
      ))}

      <GroupTitle>Nuestro Propósito</GroupTitle>
      <Field label="Título" value={t.purpose.title} onChange={(v) => setPurpose({ title: v })} />
      <Field label="Subtítulo" textarea value={t.purpose.subtitle} onChange={(v) => setPurpose({ subtitle: v })} />
      {t.purpose.cards.map((c, i) => (
        <div key={i} className="grid sm:grid-cols-2 gap-2 rounded-xl bg-gray-50 dark:bg-slate-800 p-3">
          <Field label={`Tarjeta ${i + 1} · título`} value={c.title} onChange={(val) => setCard(i, { title: val })} />
          <Field label="Descripción" value={c.description} onChange={(val) => setCard(i, { description: val })} />
        </div>
      ))}

      <GroupTitle>Servolución</GroupTitle>
      <Field label="Título" value={t.volunteering.title} onChange={(v) => setVol({ title: v })} />
      <Field label="Párrafo" textarea value={t.volunteering.paragraph} onChange={(v) => setVol({ paragraph: v })} />
      <Field label="Botón" value={t.volunteering.button} onChange={(v) => setVol({ button: v })} />

      <GroupTitle>Próximos eventos</GroupTitle>
      <Field label="Badge" value={t.events.badge} onChange={(v) => setEvents({ badge: v })} />
      <Field label="Título" value={t.events.title} onChange={(v) => setEvents({ title: v })} />

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          onClick={() => setT(structuredClone(DEFAULT_HOME))}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 px-3 py-2 rounded-full"
        >
          <RotateCcw className="w-4 h-4" aria-hidden="true" />
          Restaurar por defecto
        </button>
        <button onClick={save} disabled={saving} className={primaryBtn}>
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="w-4 h-4" aria-hidden="true" />
          )}
          Guardar Inicio
        </button>
      </div>
    </div>
  )
}
