import { describe, it, expect, afterEach, vi } from 'vitest'
import {
  summarize,
  monthKey,
  currentMonthKey,
  monthSummary,
  formatPEN,
} from '@/services/finance'
import type { FinanceTransaction } from '@/types'

// ─── Fixtures ────────────────────────────────────────────────────────────────
// Estas funciones son puras: no tocan Supabase (getSupabase() es lazy), así que
// se pueden importar y probar sin arrancar nada del sistema.

function tx(overrides: Partial<FinanceTransaction> = {}): FinanceTransaction {
  return {
    id: 'id',
    type: 'ingreso',
    amount: 100,
    currency: 'PEN',
    category: 'Diezmos',
    description: null,
    occurred_on: '2026-07-10',
    created_at: '2026-07-10T00:00:00.000Z',
    ...overrides,
  }
}

describe('summarize', () => {
  it('returns zeros for an empty list', () => {
    expect(summarize([])).toEqual({ ingresos: 0, egresos: 0, balance: 0 })
  })

  it('adds ingresos and egresos and computes the balance', () => {
    const list = [
      tx({ type: 'ingreso', amount: 300 }),
      tx({ type: 'ingreso', amount: 200 }),
      tx({ type: 'egreso', amount: 120 }),
    ]
    expect(summarize(list)).toEqual({ ingresos: 500, egresos: 120, balance: 380 })
  })

  it('yields a negative balance when egresos exceed ingresos', () => {
    const list = [
      tx({ type: 'ingreso', amount: 50 }),
      tx({ type: 'egreso', amount: 200 }),
    ]
    expect(summarize(list).balance).toBe(-150)
  })

  it('coerces string amounts (as Supabase numeric may arrive)', () => {
    const list = [tx({ amount: '75.50' as unknown as number, type: 'ingreso' })]
    expect(summarize(list).ingresos).toBe(75.5)
  })
})

describe('monthKey', () => {
  it('extracts YYYY-MM from a date-only string', () => {
    expect(monthKey('2026-07-10')).toBe('2026-07')
  })

  it('extracts YYYY-MM from an ISO timestamp', () => {
    expect(monthKey('2026-12-01T23:59:59.000Z')).toBe('2026-12')
  })
})

describe('currentMonthKey / monthSummary (time-dependent)', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('currentMonthKey returns the month of "now"', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-15T12:00:00.000Z'))
    expect(currentMonthKey()).toBe('2026-03')
  })

  it('monthSummary only sums transactions of the current month', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-15T12:00:00.000Z'))
    const list = [
      tx({ type: 'ingreso', amount: 100, occurred_on: '2026-07-01' }),
      tx({ type: 'egreso', amount: 40, occurred_on: '2026-07-20' }),
      tx({ type: 'ingreso', amount: 999, occurred_on: '2026-06-30' }), // otro mes
      tx({ type: 'ingreso', amount: 999, occurred_on: '2026-08-01' }), // otro mes
    ]
    expect(monthSummary(list)).toEqual({ ingresos: 100, egresos: 40, balance: 60 })
  })
})

describe('formatPEN', () => {
  it('returns a string with the amount digits', () => {
    const s = formatPEN(1234.5)
    expect(typeof s).toBe('string')
    // El separador de miles puede variar según ICU; toleramos , o .
    expect(s).toMatch(/1.?234/)
  })

  it('formats zero as a string', () => {
    expect(typeof formatPEN(0)).toBe('string')
  })
})
