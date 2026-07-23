import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useAsyncData } from '@/hooks/useAsyncData'

// El hook se prueba de forma aislada con renderHook: no monta la app, no usa
// router ni Supabase. El "fetcher" es una función falsa que devuelve promesas.

describe('useAsyncData', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts in loading with the initial data', () => {
    const fetcher = vi.fn(() => new Promise<number[]>(() => {})) // nunca resuelve
    const { result } = renderHook(() => useAsyncData<number[]>(fetcher, []))
    expect(result.current.status).toBe('loading')
    expect(result.current.data).toEqual([])
  })

  it('resolves to success with the fetched data', async () => {
    const fetcher = vi.fn(() => Promise.resolve([1, 2, 3]))
    const { result } = renderHook(() => useAsyncData<number[]>(fetcher, []))
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data).toEqual([1, 2, 3])
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('sets error status when the fetcher rejects (keeping initial data)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const fetcher = vi.fn(() => Promise.reject<number[]>(new Error('boom')))
    const { result } = renderHook(() => useAsyncData<number[]>(fetcher, []))
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.data).toEqual([])
  })

  it('refresh() re-runs the fetcher and updates the data', async () => {
    let call = 0
    const fetcher = vi.fn(() => Promise.resolve(call++ === 0 ? ['a'] : ['a', 'b']))
    const { result } = renderHook(() => useAsyncData<string[]>(fetcher, []))
    await waitFor(() => expect(result.current.status).toBe('success'))
    expect(result.current.data).toEqual(['a'])

    await act(async () => {
      await result.current.refresh()
    })
    expect(result.current.data).toEqual(['a', 'b'])
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('setData updates the data locally', async () => {
    const fetcher = vi.fn(() => Promise.resolve(['x']))
    const { result } = renderHook(() => useAsyncData<string[]>(fetcher, []))
    await waitFor(() => expect(result.current.status).toBe('success'))

    act(() => {
      result.current.setData(['y', 'z'])
    })
    expect(result.current.data).toEqual(['y', 'z'])
  })
})
