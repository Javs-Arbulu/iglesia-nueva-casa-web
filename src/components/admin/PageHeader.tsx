import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  /** Contenido opcional alineado a la derecha (ej. botón “Nuevo” o un badge). */
  action?: ReactNode
}

/** Encabezado consistente para las páginas del panel admin. */
export default function PageHeader({ title, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      {action}
    </div>
  )
}
