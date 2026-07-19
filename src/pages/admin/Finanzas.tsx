import { useCallback, useEffect, useState } from 'react'
import { Loader2, Plus, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  formatPEN,
  monthSummary,
  type TxInput,
} from '@/services/finance'
import Modal from '@/components/common/Modal'
import type { FinanceTransaction, TransactionType } from '@/types'

type Status = 'loading' | 'success' | 'error'

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
  const [txs, setTxs] = useState<FinanceTransaction[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [busy, setBusy] = useState(false)
  const [editingId, setEditingId] = useState<string | 'new' | null>(null)
  const [form, setForm] = useState(EMPTY)

  const load = useCallback(() => fetchTransactions(), [])

  useEffect(() => {
    let active = true
    load()
      .then((d) => {
        if (!active) return
        setTxs(d)
        setStatus('success')
      })
      .catch((err) => {
        if (!active) return
        console.error(err)
        setStatus('error')
      })
    return () => {
      active = false
    }
  }, [load])

  const refresh = async () => {
    try {
      setTxs(await load())
    } catch (err) {
      console.error(err)
    }
  }

  const summary = monthSummary(txs)

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
      close()
    } catch (err) {
      console.error(err)
    }
    setBusy(false)
  }

  const remove = async (t: FinanceTransaction) => {
    if (!window.confirm('¿Eliminar este movimiento?')) return
    setBusy(true)
    try {
      await deleteTransaction(t.id)
      await refresh()
    } catch (err) {
      console.error(err)
    }
    setBusy(false)
  }

  const inputCls =
    'w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Finanzas</h1>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold text-sm px-4 py-2 rounded-full transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
          Nuevo
        </button>
      </div>

      {/* Resumen del mes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-green-50 dark:bg-green-500/10 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase text-green-700 dark:text-green-300">
            Ingresos del mes
          </p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {formatPEN(summary.ingresos)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-500/10 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase text-red-700 dark:text-red-300">
            Egresos del mes
          </p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
            {formatPEN(summary.egresos)}
          </p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-slate-400">
            Balance del mes
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPEN(summary.balance)}
          </p>
        </div>
      </div>

      {status === 'loading' && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-slate-400 py-10">
          <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
          Cargando…
        </div>
      )}
      {status === 'error' && (
        <p className="text-red-500">No se pudieron cargar los movimientos.</p>
      )}
      {status === 'success' && txs.length === 0 && (
        <p className="text-gray-500 dark:text-slate-400">
          Aún no hay movimientos. Registra el primero con “Nuevo”.
        </p>
      )}

      {status === 'success' && txs.length > 0 && (
        <ul className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 divide-y divide-gray-100 dark:divide-slate-800 overflow-hidden">
          {txs.map((t) => {
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
      )}

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
            className="w-full inline-flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60"
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
