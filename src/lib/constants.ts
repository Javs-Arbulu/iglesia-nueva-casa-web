import type { NavLink, MinisterioTab } from '@/types'

// ─── Navegación ────────────────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { name: 'Inicio', href: '/' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Ministerios', href: '/ministerios' },
  { name: 'Contacto', href: '/contacto' },
]

export const EXPLORE_LINKS: NavLink[] = [
  { name: 'Inicio', href: '/' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Ministerios', href: '/ministerios' },
  { name: 'Contacto', href: '/contacto' },
  {
    name: 'YouTube en Vivo',
    href: 'https://www.youtube.com/@iglesianuevacasa/streams',
    external: true,
  },
]

// ─── Redes sociales ────────────────────────────────────────────────────────────

export const SOCIAL_HREFS = {
  instagram: 'https://www.instagram.com/iglesianuevacasa/',
  youtube: 'https://www.youtube.com/@iglesianuevacasa',
  youtubeLive: 'https://www.youtube.com/@iglesianuevacasa/streams',
  facebook: 'https://www.facebook.com/IglesiaNuevaCasa',
} as const

// ─── Información de la iglesia ─────────────────────────────────────────────────

export const CHURCH_INFO = {
  name: 'Nueva Casa',
  address: 'Jr. Juan Luis Hague 3545, San Martín de Porres',
  city: 'Lima, Perú',
  mapsUrl: 'https://maps.app.goo.gl/M4FviVnt4jZnmjGq6',
  mapsEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3902.2845906339053!2d-77.08588162493928!3d-12.02391808821105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105cf0013e3b017%3A0xd8bf89dbf07c73a3!2sIglesia%20Nueva%20Casa!5e0!3m2!1ses!2spe!4v1767561626307!5m2!1ses!2spe',
  schedules: [
    { name: 'Servicio Dominical', day: 'Todos los domingos', time: '11:00 AM' },
    { name: 'Reunión de Adolescentes', day: 'Cada sábado', time: '5:00 PM' },
  ],
} as const

// ─── Ministerios ───────────────────────────────────────────────────────────────

export const MINISTERIO_TABS: MinisterioTab[] = [
  'Todos',
  'Generaciones',
  'Comunidad',
  'Servicio',
]
