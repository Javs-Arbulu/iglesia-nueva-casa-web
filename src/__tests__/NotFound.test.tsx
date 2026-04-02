import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from '@/pages/NotFound'

// ─── Helpers ───────────────────────────────────────────────────────────────────

function renderNotFound() {
  return render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  )
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('NotFound', () => {
  it('renders the 404 error code', () => {
    renderNotFound()
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('renders the "Página no encontrada" heading', () => {
    renderNotFound()
    expect(
      screen.getByRole('heading', { name: 'Página no encontrada' })
    ).toBeInTheDocument()
  })

  it('renders a link to the home page', () => {
    renderNotFound()
    const homeLink = screen.getByRole('link', { name: /ir al inicio/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('renders a link to the contact page', () => {
    renderNotFound()
    const contactLink = screen.getByRole('link', { name: /contáctanos/i })
    expect(contactLink).toBeInTheDocument()
    expect(contactLink).toHaveAttribute('href', '/contacto')
  })

  it('uses a <main> landmark', () => {
    renderNotFound()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })
})
