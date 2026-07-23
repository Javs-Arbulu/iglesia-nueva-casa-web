import { useEffect, useRef, useState } from 'react'
import {
  Loader2,
  ImagePlus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Save,
  Info,
} from 'lucide-react'
import {
  loadContent,
  saveBlock,
  pickSiteMedia,
  CAROUSEL_MAX,
  type SiteMedia,
  type SiteImage,
} from '@/services/content'
import { uploadImageFile } from '@/services/media'
import { useToast } from '@/features/toast/context'
import { inputCls, cardCls, primaryBtn } from '@/lib/adminUi'
import HeroDefault from '@/assets/images/Hero.jpg'
import VolunteeringDefault from '@/assets/images/volunteering.jpg'
import NosotrosDefault from '@/assets/images/Carrusel2.jpg'

const REC = {
  carousel: 'Recomendado: 1200 × 1200 px (cuadrada)',
  hero: 'Recomendado: 1920 × 1080 px (horizontal, 16:9)',
  volunteering: 'Recomendado: 1920 × 1080 px (horizontal, 16:9)',
  nosotros: 'Recomendado: 1200 × 900 px (horizontal, 4:3)',
}

/** Botón de subida con su propio input de archivo oculto. */
function UploadButton({
  onFile,
  busy,
  label,
}: {
  onFile: (file: File) => void
  busy: boolean
  label: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={busy}
        className={primaryBtn}
      >
        {busy ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          <ImagePlus className="w-4 h-4" aria-hidden="true" />
        )}
        {label}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (ref.current) ref.current.value = ''
          if (f) onFile(f)
        }}
      />
    </>
  )
}

/** Nota de recomendación de dimensiones. */
function Rec({ text }: { text: string }) {
  return (
    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500">
      <Info className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      {text}
    </p>
  )
}

export default function SiteMediaEditor() {
  const toast = useToast()
  const [media, setMedia] = useState<SiteMedia | null>(null)
  const [saving, setSaving] = useState(false)
  const [busyKey, setBusyKey] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    loadContent(true).then((b) => {
      if (active) setMedia(pickSiteMedia(b))
    })
    return () => {
      active = false
    }
  }, [])

  const runUpload = async (key: string, file: File, apply: (url: string) => void) => {
    setBusyKey(key)
    try {
      const url = await uploadImageFile(file, 'sitio')
      apply(url)
    } catch (err) {
      console.error(err)
      toast.error('No se pudo subir la imagen.')
    }
    setBusyKey(null)
  }

  const save = async () => {
    if (!media) return
    setSaving(true)
    try {
      await saveBlock('site_media', media)
      toast.success('Imágenes de la página guardadas.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudieron guardar los cambios.')
    }
    setSaving(false)
  }

  if (!media) {
    return (
      <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 py-10">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        Cargando…
      </div>
    )
  }

  // ── Carrusel ───────────────────────────────────────────────────────────────
  const carousel = media.carousel ?? []
  const setCarousel = (next: SiteImage[]) =>
    setMedia((m) => (m ? { ...m, carousel: next.length ? next : null } : m))
  const addSlide = (url: string) => setCarousel([...carousel, { url, alt: '' }])
  const removeSlide = (i: number) => setCarousel(carousel.filter((_, idx) => idx !== i))
  const setSlideAlt = (i: number, alt: string) =>
    setCarousel(carousel.map((s, idx) => (idx === i ? { ...s, alt } : s)))
  const moveSlide = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= carousel.length) return
    const next = [...carousel]
    ;[next[i], next[j]] = [next[j], next[i]]
    setCarousel(next)
  }

  // ── Imagen única (Hero / Voluntariado) ───────────────────────────────────────
  const singleSlot = (
    key: 'hero' | 'volunteering' | 'nosotros',
    title: string,
    rec: string,
    defaultSrc: string
  ) => {
    const value = media[key]
    return (
      <section className={cardCls}>
        <h3 className="font-bold text-base mb-1">{title}</h3>
        <Rec text={rec} />
        <div className="mt-3 flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64 shrink-0 aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-slate-800">
            <img
              src={value?.url ?? defaultSrc}
              alt=""
              className="w-full h-full object-cover"
            />
            {!value && (
              <span className="absolute top-2 left-2 text-[10px] font-semibold bg-black/60 text-white px-2 py-0.5 rounded-full">
                Por defecto
              </span>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={value?.alt ?? ''}
              onChange={(e) =>
                setMedia((m) =>
                  m
                    ? {
                        ...m,
                        [key]: { url: value?.url ?? '', alt: e.target.value },
                      }
                    : m
                )
              }
              placeholder="Texto alternativo (accesibilidad)"
              disabled={!value}
              className={`${inputCls} disabled:opacity-50`}
            />
            <div className="flex gap-2">
              <UploadButton
                busy={busyKey === key}
                label={value ? 'Reemplazar' : 'Subir imagen'}
                onFile={(file) =>
                  runUpload(key, file, (url) =>
                    setMedia((m) =>
                      m ? { ...m, [key]: { url, alt: value?.alt ?? '' } } : m
                    )
                  )
                }
              />
              {value && (
                <button
                  type="button"
                  onClick={() => setMedia((m) => (m ? { ...m, [key]: null } : m))}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-full"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  Usar por defecto
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500 dark:text-slate-400">
        Estas imágenes reemplazan a las que trae la página por defecto. Si no
        subes nada, se mantienen las actuales.
      </p>

      {/* Carrusel del inicio */}
      <section className={cardCls}>
        <div className="flex items-center justify-between gap-3 mb-1">
          <h3 className="font-bold text-base">Carrusel del inicio</h3>
          <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">
            {carousel.length}/{CAROUSEL_MAX}
          </span>
        </div>
        <Rec text={REC.carousel} />

        {carousel.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">
            Sin imágenes propias: el inicio usa el carrusel por defecto. Sube una
            para empezar a controlarlo.
          </p>
        ) : (
          <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {carousel.map((s, i) => (
              <li
                key={i}
                className="rounded-xl border border-gray-100 dark:border-slate-800 overflow-hidden bg-gray-50 dark:bg-slate-800"
              >
                <div className="relative aspect-square bg-gray-100 dark:bg-slate-700">
                  <img src={s.url} alt={s.alt} className="w-full h-full object-cover" />
                  <span className="absolute top-1.5 left-1.5 w-6 h-6 flex items-center justify-center text-[11px] font-bold rounded-full bg-black/60 text-white">
                    {i + 1}
                  </span>
                </div>
                <div className="p-2 space-y-2">
                  <input
                    type="text"
                    value={s.alt}
                    onChange={(e) => setSlideAlt(i, e.target.value)}
                    placeholder="Descripción"
                    className={`${inputCls} !py-1.5 text-xs`}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveSlide(i, -1)}
                        disabled={i === 0}
                        aria-label="Mover antes"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-40"
                      >
                        <ArrowUp className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveSlide(i, 1)}
                        disabled={i === carousel.length - 1}
                        aria-label="Mover después"
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 disabled:opacity-40"
                      >
                        <ArrowDown className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSlide(i)}
                      aria-label="Eliminar"
                      className="w-7 h-7 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {carousel.length < CAROUSEL_MAX && (
          <div className="mt-3">
            <UploadButton
              busy={busyKey === 'carousel'}
              label="Agregar imagen"
              onFile={(file) => runUpload('carousel', file, addSlide)}
            />
          </div>
        )}
      </section>

      {singleSlot('hero', 'Imagen del Hero (portada)', REC.hero, HeroDefault)}
      {singleSlot('volunteering', 'Imagen de Voluntariado', REC.volunteering, VolunteeringDefault)}
      {singleSlot('nosotros', 'Imagen de Nosotros', REC.nosotros, NosotrosDefault)}

      <div className="sticky bottom-4 flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-60 shadow-lg"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="w-4 h-4" aria-hidden="true" />
          )}
          Guardar cambios
        </button>
      </div>
    </div>
  )
}
