import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Loader2, Clock, House } from 'lucide-react'
import { useAuth } from '@/features/auth/context'
import ThemeToggle from '@/components/common/ThemeToggle'
import { fetchMaterialById, getViewUrl, getDownloadUrl, type MaterialItem } from '@/services/material'
import SEO from '@/components/common/SEO'

const controlCls =
  'text-gray-700 hover:text-cyan-600 hover:bg-black/5 dark:text-white/90 dark:hover:text-cyan-400 dark:hover:bg-white/10'

type Status = 'loading' | 'ready' | 'denied' | 'error'

export default function MaterialViewer() {
  const { id } = useParams<{ id: string }>()
  const { profile, hasRole } = useAuth()
  const isStaff = hasRole('admin', 'editor', 'finanzas')

  const [item, setItem] = useState<MaterialItem | null>(null)
  const [viewUrl, setViewUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('loading')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (!id) return
    let active = true
    ;(async () => {
      try {
        const m = await fetchMaterialById(id)
        if (!active) return
        if (!m) {
          // RLS lo oculta si la cuenta no está aprobada o no existe.
          setStatus('denied')
          return
        }
        setItem(m)
        setViewUrl(await getViewUrl(m.path))
        setStatus('ready')
      } catch (err) {
        if (!active) return
        console.error(err)
        setStatus('error')
      }
    })()
    return () => {
      active = false
    }
  }, [id])

  const download = async () => {
    if (!item) return
    setDownloading(true)
    try {
      const url = await getDownloadUrl(item.path, item.title)
      window.location.href = url
    } catch (err) {
      console.error(err)
    }
    setDownloading(false)
  }

  const pending = profile?.status !== 'active' && !isStaff

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white">
      <SEO title="Material | Iglesia Nueva Casa" url="https://nuevacasa.pe/material" />

      <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
        <Link to="/portal" className="inline-flex items-center gap-2 font-semibold">
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          Portal
        </Link>
        <ThemeToggle className={controlCls} />
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {status === 'loading' && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 py-20 justify-center">
            <Loader2 className="w-6 h-6 animate-spin" aria-hidden="true" />
            Cargando…
          </div>
        )}

        {status === 'denied' && (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-7 h-7 text-amber-600 dark:text-amber-300" aria-hidden="true" />
            </div>
            <h1 className="text-xl font-bold mb-2">
              {pending ? 'Tu cuenta está pendiente de aprobación' : 'Material no disponible'}
            </h1>
            <p className="text-gray-600 dark:text-slate-300 max-w-sm mx-auto mb-6">
              {pending
                ? 'Un administrador debe aprobar tu cuenta para ver el material.'
                : 'Este material no existe o ya no está disponible.'}
            </p>
            <Link
              to="/portal"
              className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-6 py-3 rounded-full transition-colors"
            >
              <House className="w-4 h-4" aria-hidden="true" />
              Ir al portal
            </Link>
          </div>
        )}

        {status === 'error' && (
          <p className="text-center text-red-500 py-20">No se pudo cargar el material.</p>
        )}

        {status === 'ready' && item && (
          <>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-cyan-600 dark:text-cyan-400">
                  {item.category}
                </p>
                <h1 className="text-2xl font-bold">{item.title}</h1>
                {item.description && (
                  <p className="text-gray-600 dark:text-slate-300 mt-1">{item.description}</p>
                )}
              </div>
              <button
                onClick={download}
                disabled={downloading}
                className="shrink-0 inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold px-4 py-2.5 rounded-full transition-colors disabled:opacity-60"
              >
                {downloading ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Download className="w-4 h-4" aria-hidden="true" />
                )}
                Descargar
              </button>
            </div>

            {viewUrl && (
              <iframe
                src={viewUrl}
                title={item.title}
                className="w-full h-[75vh] rounded-2xl border border-gray-200 dark:border-slate-800 bg-white"
              />
            )}
            <p className="text-xs text-gray-400 dark:text-slate-500 mt-2 text-center">
              ¿No se ve el PDF? Usa el botón <strong>Descargar</strong>.
            </p>
          </>
        )}
      </main>
    </div>
  )
}
