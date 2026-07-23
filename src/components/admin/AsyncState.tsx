import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import type { AsyncStatus } from '@/hooks/useAsyncData'

interface AsyncStateProps {
  status: AsyncStatus
  /** true cuando terminó de cargar pero no hay elementos que mostrar. */
  isEmpty?: boolean
  loadingText?: string
  errorText?: string
  emptyText?: string
  children: ReactNode
}

/**
 * Renderiza los estados de carga / error / vacío de forma consistente y sólo
 * muestra `children` cuando hay datos. Reemplaza los bloques duplicados que
 * cada página del admin repetía a mano.
 */
export default function AsyncState({
  status,
  isEmpty = false,
  loadingText = 'Cargando…',
  errorText = 'No se pudo cargar la información.',
  emptyText = 'Aún no hay elementos.',
  children,
}: AsyncStateProps) {
  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 py-10">
        <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
        {loadingText}
      </div>
    )
  }
  if (status === 'error') {
    return <p className="text-red-500">{errorText}</p>
  }
  if (isEmpty) {
    return <p className="text-gray-500 dark:text-slate-400">{emptyText}</p>
  }
  return <>{children}</>
}
