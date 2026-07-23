import { useEffect, useState } from 'react'
import { Loader2, Save, RotateCcw } from 'lucide-react'
import {
  loadMinisteriosText,
  saveMinisteriosText,
  DEFAULT_MINISTERIOS,
  type MinisteriosText,
} from '@/services/siteText'
import { useToast } from '@/features/toast/context'
import { primaryBtn } from '@/lib/adminUi'
import { Field, GroupTitle } from '@/components/admin/contentUi'

export default function MinisteriosTextEditor({ readOnly = false }: { readOnly?: boolean }) {
  const toast = useToast()
  const [t, setT] = useState<MinisteriosText | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    loadMinisteriosText().then((x) => {
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

  const setHeader = (p: Partial<MinisteriosText['header']>) =>
    setT((s) => (s ? { ...s, header: { ...s.header, ...p } } : s))
  const setItem = (i: number, p: Partial<MinisteriosText['items'][number]>) =>
    setT((s) =>
      s ? { ...s, items: s.items.map((it, idx) => (idx === i ? { ...it, ...p } : it)) } : s
    )

  const save = async () => {
    setSaving(true)
    try {
      await saveMinisteriosText(t)
      toast.success('Textos de Ministerios guardados.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudieron guardar los textos.')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <GroupTitle>Encabezado</GroupTitle>
      <Field label="Badge" value={t.header.badge} onChange={(v) => setHeader({ badge: v })} />
      <Field label="Título" value={t.header.title} onChange={(v) => setHeader({ title: v })} />
      <Field label="Subtítulo" textarea value={t.header.subtitle} onChange={(v) => setHeader({ subtitle: v })} />

      <GroupTitle>Ministerios</GroupTitle>
      {t.items.map((it, i) => (
        <div key={i} className="rounded-xl bg-gray-50 dark:bg-slate-800 p-3 space-y-2">
          <Field label={`Ministerio ${i + 1} · nombre`} value={it.title} onChange={(v) => setItem(i, { title: v })} />
          <Field label="Descripción" textarea value={it.description} onChange={(v) => setItem(i, { description: v })} />
          <Field label="Horario" value={it.schedule} onChange={(v) => setItem(i, { schedule: v })} />
        </div>
      ))}

      {!readOnly && (
      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          onClick={() => setT(structuredClone(DEFAULT_MINISTERIOS))}
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
          Guardar Ministerios
        </button>
      </div>
      )}
    </div>
  )
}
