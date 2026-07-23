import { useState } from 'react'
import { Mail, MailOpen, Trash2 } from 'lucide-react'
import { fetchMessages, setMessageRead, deleteMessage } from '@/services/messages'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/features/toast/context'
import AsyncState from '@/components/admin/AsyncState'
import PageHeader from '@/components/admin/PageHeader'
import type { ContactSubmission } from '@/types'

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
  const toast = useToast()
  const { data: items, status, setData, refresh } = useAsyncData(
    fetchMessages,
    [] as ContactSubmission[]
  )
  const [busyId, setBusyId] = useState<string | null>(null)

  const unread = items.filter((m) => !m.read).length

  const toggleRead = async (m: ContactSubmission) => {
    const next = !m.read
    setBusyId(m.id)
    // Optimista: refleja el cambio al instante.
    setData((list) => list.map((x) => (x.id === m.id ? { ...x, read: next } : x)))
    try {
      await setMessageRead(m.id, next)
    } catch (err) {
      console.error(err)
      toast.error('No se pudo actualizar el mensaje.')
      await refresh()
    }
    setBusyId(null)
  }

  const remove = async (m: ContactSubmission) => {
    if (!window.confirm(`¿Eliminar el mensaje de ${m.nombre}?`)) return
    setBusyId(m.id)
    try {
      await deleteMessage(m.id)
      setData((list) => list.filter((x) => x.id !== m.id))
      toast.success('Mensaje eliminado.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo eliminar el mensaje.')
    }
    setBusyId(null)
  }

  return (
    <div>
      <PageHeader
        title="Mensajes de contacto"
        action={
          unread > 0 ? (
            <span className="shrink-0 text-xs font-semibold bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300 px-3 py-1 rounded-full">
              {unread} sin leer
            </span>
          ) : undefined
        }
      />

      <AsyncState
        status={status}
        isEmpty={items.length === 0}
        errorText="No se pudieron cargar los mensajes."
        emptyText="Aún no hay mensajes."
      >
        <ul className="space-y-3">
          {items.map((m) => (
            <li
              key={m.id}
              className={`rounded-2xl p-4 shadow-sm border transition-colors ${
                m.read
                  ? 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800'
                  : 'bg-cyan-50/60 dark:bg-cyan-500/5 border-cyan-200 dark:border-cyan-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  {!m.read && (
                    <span
                      className="inline-block w-2 h-2 rounded-full bg-cyan-500 shrink-0"
                      aria-label="No leído"
                    />
                  )}
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

              <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                <button
                  onClick={() => toggleRead(m)}
                  disabled={busyId === m.id}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-60"
                >
                  {m.read ? (
                    <>
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      Marcar no leído
                    </>
                  ) : (
                    <>
                      <MailOpen className="w-4 h-4" aria-hidden="true" />
                      Marcar leído
                    </>
                  )}
                </button>
                <button
                  onClick={() => remove(m)}
                  disabled={busyId === m.id}
                  aria-label={`Eliminar mensaje de ${m.nombre}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-60"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </AsyncState>
    </div>
  )
}
