import { useEffect, useState } from 'react'
import { Loader2, Save, RotateCcw } from 'lucide-react'
import {
  loadNosotrosText,
  saveNosotrosText,
  DEFAULT_NOSOTROS,
  type NosotrosText,
} from '@/services/siteText'
import { useToast } from '@/features/toast/context'
import { primaryBtn } from '@/lib/adminUi'
import { Field, GroupTitle } from '@/components/admin/contentUi'

export default function NosotrosTextEditor({ readOnly = false }: { readOnly?: boolean }) {
  const toast = useToast()
  const [t, setT] = useState<NosotrosText | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    loadNosotrosText().then((x) => {
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

  const setHero = (p: Partial<NosotrosText['hero']>) =>
    setT((s) => (s ? { ...s, hero: { ...s.hero, ...p } } : s))
  const setCaption = (p: Partial<NosotrosText['caption']>) =>
    setT((s) => (s ? { ...s, caption: { ...s.caption, ...p } } : s))
  const setVision = (p: Partial<NosotrosText['vision']>) =>
    setT((s) => (s ? { ...s, vision: { ...s.vision, ...p } } : s))
  const setItem = (i: number, p: Partial<NosotrosText['vision']['items'][number]>) =>
    setT((s) =>
      s
        ? { ...s, vision: { ...s.vision, items: s.vision.items.map((it, idx) => (idx === i ? { ...it, ...p } : it)) } }
        : s
    )
  const setCta = (p: Partial<NosotrosText['cta']>) =>
    setT((s) => (s ? { ...s, cta: { ...s.cta, ...p } } : s))

  const save = async () => {
    setSaving(true)
    try {
      await saveNosotrosText(t)
      toast.success('Textos de Nosotros guardados.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudieron guardar los textos.')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <GroupTitle>Portada</GroupTitle>
      <Field label="Badge" value={t.hero.badge} onChange={(v) => setHero({ badge: v })} />
      <Field label="Título" value={t.hero.title} onChange={(v) => setHero({ title: v })} />
      <Field label="Palabra destacada" value={t.hero.accent} onChange={(v) => setHero({ accent: v })} />
      <Field label="Subtítulo" textarea value={t.hero.subtitle} onChange={(v) => setHero({ subtitle: v })} />
      <Field label="Botón" value={t.hero.button} onChange={(v) => setHero({ button: v })} />

      <GroupTitle>Etiqueta de la foto</GroupTitle>
      <Field label="Título" value={t.caption.title} onChange={(v) => setCaption({ title: v })} />
      <Field label="Subtítulo" value={t.caption.subtitle} onChange={(v) => setCaption({ subtitle: v })} />

      <GroupTitle>Visión</GroupTitle>
      <Field label="Título" value={t.vision.title} onChange={(v) => setVision({ title: v })} />
      <Field label="Subtítulo" textarea value={t.vision.subtitle} onChange={(v) => setVision({ subtitle: v })} />
      {t.vision.items.map((it, i) => (
        <div key={i} className="grid sm:grid-cols-2 gap-2 rounded-xl bg-gray-50 dark:bg-slate-800 p-3">
          <Field label={`Item ${i + 1} · título`} value={it.title} onChange={(val) => setItem(i, { title: val })} />
          <Field label="Descripción" value={it.description} onChange={(val) => setItem(i, { description: val })} />
        </div>
      ))}

      <GroupTitle>Cierre (llamado a la acción)</GroupTitle>
      <Field label="Título" value={t.cta.title} onChange={(v) => setCta({ title: v })} />
      <Field label="Párrafo" textarea value={t.cta.paragraph} onChange={(v) => setCta({ paragraph: v })} />
      <Field label="Botón" value={t.cta.button} onChange={(v) => setCta({ button: v })} />

      {!readOnly && (
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          onClick={() => setT(structuredClone(DEFAULT_NOSOTROS))}
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
          Guardar Nosotros
        </button>
      </div>
      )}
    </div>
  )
}
