import { getSupabase } from '@/services/supabase'
import type { FinanceTransaction, TransactionType } from '@/types'

export interface TxInput {
  type: TransactionType
  amount: number
  category: string | null
  description: string | null
  occurred_on: string
}

export async function fetchTransactions(limit = 300): Promise<FinanceTransaction[]> {
  const { data, error } = await getSupabase()
    .from('finance_transactions')
    .select('*')
    .order('occurred_on', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data as FinanceTransaction[]) ?? []
}

export async function addTransaction(input: TxInput): Promise<void> {
  const { error } = await getSupabase().from('finance_transactions').insert(input)
  if (error) throw error
}

export async function updateTransaction(id: string, input: TxInput): Promise<void> {
  const { error } = await getSupabase()
    .from('finance_transactions')
    .update(input)
    .eq('id', id)
  if (error) throw error
}

export async function deleteTransaction(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from('finance_transactions')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export function formatPEN(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(amount)
}

/** Suma ingresos, egresos y balance de una lista de movimientos. */
export function summarize(txs: FinanceTransaction[]) {
  let ingresos = 0
  let egresos = 0
  for (const t of txs) {
    if (t.type === 'ingreso') ingresos += Number(t.amount)
    else egresos += Number(t.amount)
  }
  return { ingresos, egresos, balance: ingresos - egresos }
}

/** Clave de mes (YYYY-MM) de una fecha ISO/date. */
export function monthKey(iso: string): string {
  return iso.slice(0, 7)
}

/** Clave del mes en curso (YYYY-MM). */
export function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7)
}

/** Resumen del mes en curso: ingresos, egresos y balance. */
export function monthSummary(txs: FinanceTransaction[]) {
  const key = currentMonthKey()
  return summarize(txs.filter((t) => monthKey(t.occurred_on) === key))
}
