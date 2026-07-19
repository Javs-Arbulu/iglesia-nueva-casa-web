import { useEffect, useState } from 'react'
import { Loader2, Mail } from 'lucide-react'
import { getSupabase } from '@/services/supabase'
import type { ContactSubmission } from '@/types'

type Status = 'loading' | 'success' | 'error'

const formatDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return ''
  }
}

export default function Mensajes() {
  const [items, setItems] = useState<ContactSubmission[]>([])
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    getSupabase()
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error(error)
          setStatus('error')
          return
        }
        setItems((data as ContactSubmission[]) ?? [])
        setStatus('success')
      })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mensajes de contacto</h1>

      {status === 'loading' && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 py-10">
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          Cargando…
        </div>
      )}

      {status === 'error' && (
        <p className="text-red-500">No se pudieron cargar los mensajes.</p>
      )}

      {status === 'success' && items.length === 0 && (
        <p className="text-gray-500 dark:text-slate-400">Aún no hay mensajes.</p>
      )}

      {status === 'success' && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((m) => (
            <li
              key={m.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-slate-800"
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {m.nombre}
                </p>
                <time className="text-xs text-gray-400 dark:text-slate-500 whitespace-nowrap">
                  {formatDate(m.created_at)}
                </time>
              </div>
              <a
                href={`mailto:${m.email}`}
                className="text-sm text-cyan-600 dark:text-cyan-400 inline-flex items-center gap-1 mb-2 break-all"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                {m.email}
              </a>
              <p className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                {m.asunto}
              </p>
              <p className="text-sm text-gray-600 dark:text-slate-300 whitespace-pre-wrap">
                {m.mensaje}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
