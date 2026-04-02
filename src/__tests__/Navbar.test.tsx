import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '@/components/common/Navbar'

// ─── Helpers ───────────────────────────────────────────────────────────────────

function renderNavbar(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />
    </MemoryRouter>
  )
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('Navbar', () => {
  it('renders the site name', () => {
    renderNavbar()
    expect(screen.getByText('NUEVA CASA')).toBeInTheDocument()
  })

  it('renders the primary navigation landmark', () => {
    renderNavbar()
    expect(
      screen.getByRole('navigation', { name: 'Navegación principal' })
    ).toBeInTheDocument()
  })

  describe('mobile menu toggle', () => {
    it('has aria-expanded="false" initially', () => {
      renderNavbar()
      const toggle = screen.getByRole('button', { name: 'Abrir menú' })
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
    })

    it('updates aria-expanded to "true" after clicking the toggle', async () => {
      renderNavbar()
      const toggle = screen.getByRole('button', { name: 'Abrir menú' })
      await userEvent.click(toggle)
      // After opening, the button label changes
      expect(
        screen.getByRole('button', { name: 'Cerrar menú' })
      ).toHaveAttribute('aria-expanded', 'true')
    })

    it('closes the menu when the toggle is clicked again', async () => {
      renderNavbar()
      const toggle = screen.getByRole('button', { name: 'Abrir menú' })
      await userEvent.click(toggle) // open
      await userEvent.click(screen.getByRole('button', { name: 'Cerrar menú' })) // close
      expect(
        screen.getByRole('button', { name: 'Abrir menú' })
      ).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('active link', () => {
    it('marks the current page link with aria-current="page"', () => {
      renderNavbar('/nosotros')
      // Find all links — the one pointing to /nosotros should be aria-current
      const links = screen.getAllByRole('link')
      const activeLinks = links.filter(
        (link) => link.getAttribute('aria-current') === 'page'
      )
      expect(activeLinks.length).toBeGreaterThan(0)
      activeLinks.forEach((link) => {
        expect(link).toHaveAttribute('href', '/nosotros')
      })
    })

    it('does not mark non-current links with aria-current', () => {
      renderNavbar('/nosotros')
      const links = screen.getAllByRole('link')
      const wrongCurrentLinks = links.filter(
        (link) =>
          link.getAttribute('aria-current') === 'page' &&
          link.getAttribute('href') !== '/nosotros'
      )
      expect(wrongCurrentLinks).toHaveLength(0)
    })
  })
})
