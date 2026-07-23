import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { inputCls } from '@/lib/adminUi'

/** Sección plegable del editor de Contenido. */
export function Accordion({
  title,
  subtitle,
  defaultOpen = false,
  children,
}: {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 p-4 text-left"
      >
        <span>
          <span className="block font-bold text-gray-900 dark:text-white">{title}</span>
          {subtitle && (
            <span className="block text-xs text-gray-400 dark:text-slate-500">{subtitle}</span>
          )}
        </span>
        <ChevronDown
          className={`w-5 h-5 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && <div className="p-4 pt-0 space-y-4">{children}</div>}
    </section>
  )
}

/** Encabezado de subgrupo dentro de una sección. */
export function GroupTitle({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-bold uppercase tracking-wide text-cyan-600 dark:text-cyan-400 pt-2">
      {children}
    </p>
  )
}

/** Campo de texto (input o textarea) con etiqueta. */
export function Field({
  label,
  value,
  onChange,
  textarea = false,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
        {label}
      </label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputCls} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls}
        />
      )}
    </div>
  )
}
