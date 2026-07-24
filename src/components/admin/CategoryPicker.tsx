import { useState } from 'react'
import { inputCls } from '@/lib/adminUi'

const cap = (c: string) => c.charAt(0).toUpperCase() + c.slice(1)

/**
 * Selector de categoría: desplegable con las existentes + opción para crear una
 * nueva (que abre un campo de texto). Si no hay categorías aún, muestra directo
 * el campo de texto.
 */
export default function CategoryPicker({
  value,
  onChange,
  options,
  disabled = false,
  placeholder = 'Nombre de la categoría',
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  disabled?: boolean
  placeholder?: string
}) {
  const [creatingNew, setCreatingNew] = useState(false)
  const isNew = options.length === 0 || creatingNew || !options.includes(value)

  return (
    <div className="space-y-2">
      {options.length > 0 && (
        <select
          value={isNew ? '__new__' : value}
          disabled={disabled}
          onChange={(e) => {
            if (e.target.value === '__new__') {
              setCreatingNew(true)
              onChange('')
            } else {
              setCreatingNew(false)
              onChange(e.target.value)
            }
          }}
          className={`${inputCls} disabled:opacity-60`}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {cap(o)}
            </option>
          ))}
          <option value="__new__">➕ Nueva categoría…</option>
        </select>
      )}
      {isNew && (
        <input
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputCls} disabled:opacity-60`}
        />
      )}
    </div>
  )
}
