import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import {
  ToastContext,
  type Toast,
  type ToastKind,
  type ToastContextValue,
} from './context'

const ICON = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
} as const

const ACCENT: Record<ToastKind, string> = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-cyan-500',
}

/**
 * Proveedor de notificaciones (toasts) del panel admin. Monta un contenedor
 * fijo abajo a la derecha y expone `useToast()` para avisar de éxitos y errores
 * que antes sólo iban a la consola.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const nextId = useRef(1)

  const dismiss = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const notify = useCallback(
    (message: string, kind: ToastKind = 'info') => {
      const id = nextId.current++
      setToasts((t) => [...t, { id, kind, message }])
      setTimeout(() => dismiss(id), 4000)
    },
    [dismiss]
  )

  const value = useMemo<ToastContextValue>(
    () => ({
      notify,
      success: (m: string) => notify(m, 'success'),
      error: (m: string) => notify(m, 'error'),
    }),
    [notify]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] flex-col gap-2 sm:w-auto sm:max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const Icon = ICON[t.kind]
          return (
            <div
              key={t.id}
              role="status"
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-lg"
            >
              <Icon
                className={`mt-0.5 h-5 w-5 shrink-0 ${ACCENT[t.kind]}`}
                aria-hidden="true"
              />
              <p className="flex-1 text-sm font-medium text-gray-800 dark:text-slate-100">
                {t.message}
              </p>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Cerrar notificación"
                className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
