import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import React from 'react'
import { useScrollTop, useScrollToHash } from '@/hooks/useScroll'

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Wraps a hook inside a MemoryRouter at a given path/hash. */
function wrapper(initialEntries: string[]) {
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        <Route path="*" element={<>{children}</>} />
      </Routes>
    </MemoryRouter>
  )
}

// ─── useScrollTop ──────────────────────────────────────────────────────────────

describe('useScrollTop', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls window.scrollTo with top:0 on mount', () => {
    renderHook(() => useScrollTop(), { wrapper: wrapper(['/about']) })
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'instant',
    })
  })
})

// ─── useScrollToHash ───────────────────────────────────────────────────────────

describe('useScrollToHash', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('does nothing when there is no hash in the URL', () => {
    const scrollIntoView = vi.fn()
    renderHook(() => useScrollToHash(), { wrapper: wrapper(['/contacto']) })
    vi.runAllTimers()
    expect(scrollIntoView).not.toHaveBeenCalled()
  })

  it('scrolls to the target element when a matching hash is in the URL', () => {
    const el = document.createElement('div')
    el.id = 'info'
    const scrollIntoView = vi.fn()
    el.scrollIntoView = scrollIntoView
    document.body.appendChild(el)

    renderHook(() => useScrollToHash(), {
      wrapper: wrapper(['/contacto#info']),
    })
    vi.runAllTimers()

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
  })

  it('does nothing when the hash target element does not exist in the DOM', () => {
    // No element with id="missing" in the DOM
    renderHook(() => useScrollToHash(), {
      wrapper: wrapper(['/contacto#missing']),
    })
    vi.runAllTimers()
    // No assertion needed — test passes if no error is thrown
  })
})
