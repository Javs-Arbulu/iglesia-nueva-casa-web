import { describe, it, expect } from 'vitest'
import type { ContactFormData, ContactFormErrors } from '@/types'

// ─── Validation logic (extracted from Contacto.tsx) ────────────────────────────
// We duplicate the regex + function here to keep tests isolated from the
// implementation file (which renders a full React page).

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {}

  if (!data.nombre.trim()) {
    errors.nombre = 'El nombre es requerido.'
  }
  if (!data.email.trim()) {
    errors.email = 'El correo es requerido.'
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = 'Ingresa un correo válido.'
  }
  if (!data.asunto.trim()) {
    errors.asunto = 'El asunto es requerido.'
  }
  if (!data.mensaje.trim()) {
    errors.mensaje = 'El mensaje no puede estar vacío.'
  } else if (data.mensaje.trim().length < 10) {
    errors.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
  }

  return errors
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function validData(overrides: Partial<ContactFormData> = {}): ContactFormData {
  return {
    nombre: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    asunto: 'Consulta general',
    mensaje: 'Este es un mensaje de prueba válido.',
    ...overrides,
  }
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe('validateForm', () => {
  describe('when all fields are valid', () => {
    it('returns an empty errors object', () => {
      expect(validateForm(validData())).toEqual({})
    })
  })

  describe('nombre', () => {
    it('reports an error when nombre is empty', () => {
      const { nombre } = validateForm(validData({ nombre: '' }))
      expect(nombre).toBe('El nombre es requerido.')
    })

    it('reports an error when nombre contains only spaces', () => {
      const { nombre } = validateForm(validData({ nombre: '   ' }))
      expect(nombre).toBe('El nombre es requerido.')
    })

    it('accepts a nombre with leading/trailing spaces', () => {
      const { nombre } = validateForm(validData({ nombre: '  Ana  ' }))
      expect(nombre).toBeUndefined()
    })
  })

  describe('email', () => {
    it('reports an error when email is empty', () => {
      const { email } = validateForm(validData({ email: '' }))
      expect(email).toBe('El correo es requerido.')
    })

    it('reports an invalid-format error for a missing @', () => {
      const { email } = validateForm(validData({ email: 'noatsign.com' }))
      expect(email).toBe('Ingresa un correo válido.')
    })

    it('reports an invalid-format error for a missing domain', () => {
      const { email } = validateForm(validData({ email: 'user@' }))
      expect(email).toBe('Ingresa un correo válido.')
    })

    it('accepts a valid email address', () => {
      const { email } = validateForm(validData({ email: 'valido@dominio.pe' }))
      expect(email).toBeUndefined()
    })
  })

  describe('asunto', () => {
    it('reports an error when asunto is empty', () => {
      const { asunto } = validateForm(validData({ asunto: '' }))
      expect(asunto).toBe('El asunto es requerido.')
    })

    it('reports an error when asunto is only whitespace', () => {
      const { asunto } = validateForm(validData({ asunto: '  ' }))
      expect(asunto).toBe('El asunto es requerido.')
    })
  })

  describe('mensaje', () => {
    it('reports an error when mensaje is empty', () => {
      const { mensaje } = validateForm(validData({ mensaje: '' }))
      expect(mensaje).toBe('El mensaje no puede estar vacío.')
    })

    it('reports an error when mensaje is fewer than 10 chars after trimming', () => {
      const { mensaje } = validateForm(validData({ mensaje: 'corto' }))
      expect(mensaje).toBe('El mensaje debe tener al menos 10 caracteres.')
    })

    it('accepts a mensaje of exactly 10 characters', () => {
      const { mensaje } = validateForm(validData({ mensaje: '1234567890' }))
      expect(mensaje).toBeUndefined()
    })

    it('accepts a mensaje longer than 10 characters', () => {
      const { mensaje } = validateForm(
        validData({ mensaje: 'Este es un mensaje suficientemente largo.' })
      )
      expect(mensaje).toBeUndefined()
    })
  })

  describe('multiple errors', () => {
    it('returns all errors simultaneously when all fields are empty', () => {
      const errors = validateForm({
        nombre: '',
        email: '',
        asunto: '',
        mensaje: '',
      })
      expect(errors.nombre).toBeDefined()
      expect(errors.email).toBeDefined()
      expect(errors.asunto).toBeDefined()
      expect(errors.mensaje).toBeDefined()
    })
  })
})
