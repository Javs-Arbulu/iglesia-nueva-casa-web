import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Loader2, Plus, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  formatPEN,
  summarize,
  monthKey,
  currentMonthKey,
  type TxInput,
} from '@/services/finance'
import { useAsyncData } from '@/hooks/useAsyncData'
import { useToast } from '@/features/toast/context'
import AsyncState from '@/components/admin/AsyncState'
import PageHeader from '@/components/admin/PageHeader'
import Modal from '@/components/common/Modal'
import { inputCls, listCardCls, primaryBtn, primaryBtnBlock } from '@/lib/adminUi'
import type { FinanceTransaction, TransactionType } from '@/types'

const CATEGORIES = [
  'Diezmos',
  'Ofrendas',
  'Donaciones',
  'Servicios',
  'Alquiler',
  'Eventos',
  'Ayuda social',
  'Otros',
]

const today = () => new Date().toISOString().slice(0, 10)
const EMPTY = {
  type: 'ingreso' as TransactionType,
  amount: '',
  category: '',
  description: '',
  occurred_on: today(),
}

export default function Finanzas() {
  const toast = useToast()
  const fetcher = useCallback(() => fetchTransactions(), [])
  const { data: txs, status, refresh } = useAsyncData(fetcher, [] as FinanceTransaction[])
  const [busy, setBusy] = useState(false)

  // Abre el modal de alta al llegar desde el acceso rápido del dashboard (?nuevo=1).
  const [searchParams] = useSearchParams()
  const [editingId, setEditingId] = useState<string | 'new' | null>(
    searchParams.get('nuevo') !== null ? 'new' : null
  )
  const [form, setForm] = useState(EMPTY)

  // Filtros de la bandeja.
  const [filterMonth, setFilterMonth] = useState(currentMonthKey())
  const [filterCategory, setFilterCategory] = useState('')

  // Categorías presentes en los datos (para el desplegable de filtro).
  const categoriesInUse = Array.from(
    new Set(txs.map((t) => t.category).filter((c): c is string => !!c))
  ).sort((a, b) => a.localeCompare(b, 'es'))

  // El resumen refleja el mes seleccionado (todas las categorías).
  const monthTxs = txs.filter((t) => monthKey(t.occurred_on) === filterMonth)
  const summary = summarize(monthTxs)

  // La lista aplica mes + categoría.
  const visibleTxs = monthTxs.filter(
    (t) => !filterCategory || t.category === filterCategory
  )

  const monthLabel = (() => {
    const [y, m] = filterMonth.split('-').map(Number)
    if (!y || !m) return ''
    return new Date(y, m - 1, 1).toLocaleDateString('es-PE', {
      month: 'long',
      year: 'numeric',
    })
  })()

  const openNew = () => {
    setForm(EMPTY)
    setEditingId('new')
  }
  const openEdit = (t: FinanceTransaction) => {
    setForm({
      type: t.type,
      amount: String(t.amount),
      category: t.category ?? '',
      description: t.description ?? '',
      occurred_on: t.occurred_on.slice(0, 10),
    })
    setEditingId(t.id)
  }
  const close = () => setEditingId(null)

  const save = async () => {
    const amount = Number(form.amount)
    if (!(amount > 0) || !form.occurred_on) return
    setBusy(true)
    const payload: TxInput = {
      type: form.type,
      amount,
      category: form.category.trim() || null,
      description: form.description.trim() || null,
      occurred_on: form.occurred_on,
    }
    try {
      if (editingId === 'new') await addTransaction(payload)
      else if (editingId) await updateTransaction(editingId, payload)
      await refresh()
      toast.success(editingId === 'new' ? 'Movimiento registrado.' : 'Movimiento actualizado.')
      close()
    } catch (err) {
      console.error(err)
      toast.error('No se pudo guardar el movimiento.')
    }
    setBusy(false)
  }

  const remove = async (t: FinanceTransaction) => {
    if (!window.confirm('¿Eliminar este movimiento?')) return
    setBusy(true)
    try {
      await deleteTransaction(t.id)
      await refresh()
      toast.success('Movimiento eliminado.')
    } catch (err) {
      console.error(err)
      toast.error('No se pudo eliminar el movimiento.')
    }
    setBusy(false)
  }

  return (
    <div>
      <PageHeader
        title="Finanzas"
        action={
          <button onClick={openNew} className={primaryBtn}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            Nuevo
          </button>
        }
      />

      {/* Filtros */}
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <label htmlFor="filter-month" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
            Mes
          </label>
          <input
            id="filter-month"
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className={`${inputCls} w-auto`}
          />
        </div>
        <div>
          <label htmlFor="filter-cat" className="block text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
            Categoría
          </label>
          <select
            id="filter-cat"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`${inputCls} w-auto`}
          >
            <option value="">Todas</option>
            {categoriesInUse.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resumen del mes seleccionado */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-green-50 dark:bg-green-500/10 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase text-green-700 dark:text-green-300">
            Ingresos · {monthLabel}
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {formatPEN(summary.ingresos)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-500/10 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase text-red-700 dark:text-red-300">
            Egresos · {monthLabel}
          </p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
            {formatPEN(summary.egresos)}
          </p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
            Balance · {monthLabel}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPEN(summary.balance)}
          </p>
        </div>
      </div>

      <AsyncState
        status={status}
        isEmpty={visibleTxs.length === 0}
        errorText="No se pudieron cargar los movimientos."
        emptyText={
          txs.length === 0
            ? 'Aún no hay movimientos. Registra el primero con “Nuevo”.'
            : 'No hay movimientos para este filtro.'
        }
      >
        <ul className={listCardCls}>
          {visibleTxs.map((t) => {
            const isIn = t.type === 'ingreso'
            return (
              <li key={t.id} className="flex items-center gap-3 p-3">
                {isIn ? (
                  <ArrowUpCircle className="w-6 h-6 text-green-500 shrink-0" aria-hidden="true" />
                ) : (
                  <ArrowDownCircle className="w-6 h-6 text-red-500 shrink-0" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 dark:text-white truncate">
                    {t.category ?? (isIn ? 'Ingreso' : 'Egreso')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                    {new Date(t.occurred_on).toLocaleDateString('es-PE', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                    {t.description ? ` · ${t.description}` : ''}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-semibold ${
                    isIn
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {isIn ? '+' : '−'}
                  {formatPEN(Number(t.amount))}
                </span>
                <button
                  onClick={() => openEdit(t)}
                  aria-label="Editar"
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  <Pencil className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => remove(t)}
                  disabled={busy}
                  aria-label="Eliminar"
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-60"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      </AsyncState>

      {/* Modal alta/edición */}
      <Modal
        open={editingId !== null}
        onClose={close}
        title={editingId === 'new' ? 'Nuevo movimiento' : 'Editar movimiento'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {(['ingreso', 'egreso'] as TransactionType[]).map((tp) => (
              <button
                key={tp}
                onClick={() => setForm((f) => ({ ...f, type: tp }))}
                className={`py-2.5 rounded-xl font-semibold text-sm capitalize border transition-colors ${
                  form.type === tp
                    ? tp === 'ingreso'
                      ? 'bg-green-500 text-white border-green-500'
                      : 'bg-red-500 text-white border-red-500'
                    : 'bg-transparent text-gray-500 dark:text-slate-400 border-gray-200 dark:border-slate-700'
                }`}
              >
                {tp}
              </button>
            ))}
          </div>

          <div>
            <label htmlFor="f-amount" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Monto (S/)
            </label>
            <input
              id="f-amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="f-cat" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Categoría
            </label>
            <input
              id="f-cat"
              list="finance-cats"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className={inputCls}
            />
            <datalist id="finance-cats">
              {CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label htmlFor="f-date" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Fecha
            </label>
            <input
              id="f-date"
              type="date"
              value={form.occurred_on}
              onChange={(e) => setForm((f) => ({ ...f, occurred_on: e.target.value }))}
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="f-desc" className="block text-sm font-semibold text-gray-700 dark:text-slate-200 mb-1">
              Descripción (opcional)
            </label>
            <input
              id="f-desc"
              type="text"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={inputCls}
            />
          </div>

          <button
            onClick={save}
            disabled={busy || !(Number(form.amount) > 0) || !form.occurred_on}
            className={primaryBtnBlock}
          >
            {busy ? (
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            ) : (
              'Guardar'
            )}
          </button>
        </div>
      </Modal>
    </div>
  )
}
