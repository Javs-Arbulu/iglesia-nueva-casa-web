import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  House,
  LogOut,
  FileText,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react'
import { useAuth } from '@/features/auth/context'
import ThemeToggle from '@/components/common/ThemeToggle'
import { fetchUpcomingEvents, formatEventDate } from '@/services/events'
import { fetchPublishedMaterial, type MaterialItem } from '@/services/material'
import type { Evento } from '@/types'
import SEO from '@/components/common/SEO'

const controlCls =
  'text-gray-700 hover:text-cyan-600 hover:bg-black/5 dark:text-white/90 dark:hover:text-cyan-400 dark:hover:bg-white/10'

export default function Portal() {
  const { profile, hasRole, signOut } = useAuth()
  const isStaff = hasRole('admin', 'editor', 'finanzas')
  // Acceso al contenido: staff o miembro APROBADO (estado activo). Un miembro
  // pendiente tiene el rol pero aún no ve el material.
  const canUse = isStaff || profile?.status === 'active'

  const [events, setEvents] = useState<Evento[]>([])
  const [material, setMaterial] = useState<MaterialItem[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    if (!canUse) return
    let active = true
    fetchUpcomingEvents(3)
      .then((d) => active && setEvents(d))
      .catch((err) => console.error(err))
    fetchPublishedMaterial()
      .then((d) => active && setMaterial(d))
      .catch((err) => console.error(err))
    return () => {
      active = false
    }
  }, [canUse])

  const copyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/material/${id}`)
      setCopiedId(id)
      setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 2000)
    } catch {
      /* ignore */
    }
  }

  const materialCategories = Array.from(new Set(material.map((m) => m.category))).sort((a, b) =>
    a.localeCompare(b, 'es')
  )

  // Cuenta creada pero aún sin aprobar → mensaje amable.
  if (!canUse) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col items-center justify-center text-center px-6">
        <SEO title="Portal | Iglesia Nueva Casa" url="https://nuevacasa.pe/portal" />
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/15 flex items-center justify-center mb-4">
          <Clock className="w-7 h-7 text-amber-600 dark:text-amber-300" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Cuenta pendiente de aprobación
        </h1>
        <p className="text-gray-600 dark:text-slate-300 max-w-sm mb-6">
          ¡Gracias por registrarte{profile?.first_name ? `, ${profile.first_name}` : ''}!
          Un administrador revisará tu cuenta y te dará acceso pronto.
        </p>
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-semibold"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          Cerrar sesión
        </button>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-white">
      <SEO title="Portal | Iglesia Nueva Casa" url="https://nuevacasa.pe/portal" />

      {/* Top bar */}
      <header className="sticky top-0 z-40 h-14 flex items-center justify-between px-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800">
        <Link to="/" className="flex items-center gap-2 font-bold">
          <House className="w-5 h-5 text-cyan-500" aria-hidden="true" />
          Portal
        </Link>
        <div className="flex items-center gap-1">
          {isStaff && (
            <Link
              to="/admin"
              className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-colors ${controlCls}`}
            >
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              Panel
            </Link>
          )}
          <ThemeToggle className={controlCls} />
          <button
            onClick={() => signOut()}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
            className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${controlCls}`}
          >
            <LogOut className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-1">
          Hola{profile?.first_name ? `, ${profile.first_name}` : ''} 👋
        </h1>
        <p className="text-gray-600 dark:text-slate-300 mb-6">
          Bienvenido al área de miembros de Nueva Casa.
        </p>

        {/* Material y descargas */}
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-slate-800 flex items-center justify-center">
              <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
            </div>
            <h2 className="text-lg font-bold">Material</h2>
          </div>

          {material.length === 0 ? (
            <p className="text-gray-600 dark:text-slate-300 text-sm">
              Aún no hay material disponible. ¡Pronto compartiremos recursos aquí!
            </p>
          ) : (
            <div className="space-y-5">
              {materialCategories.map((cat) => (
                <div key={cat}>
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mb-2">
                    {cat}
                  </p>
                  <ul className="space-y-2">
                    {material
                      .filter((m) => m.category === cat)
                      .map((m) => (
                        <li
                          key={m.id}
                          className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-slate-800 p-3"
                        >
                          <FileText className="w-5 h-5 text-red-500 shrink-0" aria-hidden="true" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 dark:text-white truncate">
                              {m.title}
                            </p>
                            {m.description && (
                              <p className="text-sm text-gray-500 dark:text-slate-400 truncate">
                                {m.description}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => copyLink(m.id)}
                            aria-label="Copiar enlace para compartir"
                            title="Copiar enlace"
                            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700"
                          >
                            {copiedId === m.id ? (
                              <Check className="w-4 h-4 text-green-500" aria-hidden="true" />
                            ) : (
                              <Copy className="w-4 h-4" aria-hidden="true" />
                            )}
                          </button>
                          <Link
                            to={`/material/${m.id}`}
                            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold bg-cyan-400 hover:bg-cyan-500 text-black px-3 py-1.5 rounded-full transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" aria-hidden="true" />
                            Abrir
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Próximos eventos */}
        {events.length > 0 && (
          <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-slate-800 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
              </div>
              <h2 className="text-lg font-bold">Próximos eventos</h2>
            </div>
            <ul className="space-y-3">
              {events.map((ev) => (
                <li key={ev.id} className="border-t border-gray-100 dark:border-slate-800 pt-3 first:border-0 first:pt-0">
                  <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 capitalize">
                    {formatEventDate(ev.starts_at)}
                  </p>
                  <p className="font-medium">{ev.title}</p>
                  {ev.location && (
                    <p className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                      {ev.location}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
