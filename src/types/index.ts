// ─── Navigation ────────────────────────────────────────────────────────────────

export interface NavLink {
  name: string
  href: string
  external?: boolean
}

// ─── Social ────────────────────────────────────────────────────────────────────

export interface SocialLink {
  label: string
  href: string
  icon: React.ReactNode
}

// ─── Landing ───────────────────────────────────────────────────────────────────

export interface Star {
  id: number
  top: number
  left: number
  animationDelay: number
  animationDuration: number
  size: number
}

export interface CarouselImage {
  src: string
  webp?: string
  alt: string
}

export interface ValueCard {
  icon: React.ReactNode
  title: string
  description: string
  iconColor: string
}

export interface PurposeCard {
  icon: React.ReactNode
  title: string
  description: string
  gradient: string
  iconBg: string
  iconColor: string
}

// ─── ADN ───────────────────────────────────────────────────────────────────────

export interface ADNValor {
  id: string
  title: string
  icon: string
  color: string
  angle: number
  description: string
}

// ─── Nosotros ──────────────────────────────────────────────────────────────────

export interface VisionItem {
  icon: React.ReactNode
  title: string
  description: string
  iconBg: string
  iconColor: string
  gradient: string
}

// ─── Ministerios ───────────────────────────────────────────────────────────────

export type MinisterioCategory = 'GENERACIONES' | 'COMUNIDAD' | 'SERVICIO'

export interface Ministerio {
  category: MinisterioCategory
  title: string
  icon: string
  image: string
  imageWebp?: string
  description: string
  schedule: string
  bgColor: string
}

export type MinisterioTab = 'Todos' | 'Generaciones' | 'Comunidad' | 'Servicio'

// ─── Contacto ──────────────────────────────────────────────────────────────────

export interface ContactFormData {
  nombre: string
  email: string
  asunto: string
  mensaje: string
}

export interface ContactFormErrors {
  nombre?: string
  email?: string
  asunto?: string
  mensaje?: string
}
