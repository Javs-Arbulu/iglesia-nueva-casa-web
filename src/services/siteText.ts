import { loadContent, saveBlock } from '@/services/content'

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface TitleDesc {
  title: string
  description: string
}

export interface HomeText {
  hero: {
    badge: string
    title: string
    accent: string
    subtitle: string
    btnLocation: string
    btnLive: string
  }
  adn: {
    tag: string
    title: string
    accent: string
    description: string
    cta: string
    values: TitleDesc[]
  }
  purpose: { title: string; subtitle: string; cards: TitleDesc[] }
  volunteering: { title: string; paragraph: string; button: string }
  events: { badge: string; title: string }
}

export interface NosotrosText {
  hero: { badge: string; title: string; accent: string; subtitle: string; button: string }
  caption: { title: string; subtitle: string }
  vision: { title: string; subtitle: string; items: TitleDesc[] }
  cta: { title: string; paragraph: string; button: string }
}

export interface MinisterioText {
  title: string
  description: string
  schedule: string
}

export interface MinisteriosText {
  header: { badge: string; title: string; subtitle: string }
  items: MinisterioText[]
}

// ─── Defaults (los textos actuales del sitio) ──────────────────────────────────

export const DEFAULT_HOME: HomeText = {
  hero: {
    badge: '# BIENVENIDO A CASA',
    title: 'Aquí no vienes a un lugar, llegas a',
    accent: 'una familia.',
    subtitle:
      'Somos una comunidad apasionada por Jesús, caminando juntos para transformar vidas en nuestra comunidad.',
    btnLocation: 'Ver Nuestra Ubicación',
    btnLive: 'Ver Servicios en Vivo',
  },
  adn: {
    tag: 'Nuestra Esencia',
    title: 'Descubre',
    accent: 'Quiénes Somos',
    description:
      'Somos más que un edificio o una reunión de fin de semana. Somos una familia unida por un propósito. Explora los valores que definen el latido de nuestra cultura.',
    cta: 'Ver Nuestro ADN',
    values: [
      { title: 'Amor Genuino', description: 'Amar a Dios y amar a las personas es nuestra prioridad número uno.' },
      { title: 'Comunidad', description: 'No fuimos diseñados para vivir solos, crecemos juntos.' },
      { title: 'Servicio', description: 'Vivimos para servir a Dios y a los demás.' },
    ],
  },
  purpose: {
    title: 'Nuestro Propósito',
    subtitle:
      'Existimos para conectar a las personas con la vida que Jesús ofrece. Un camino simple de cuatro pasos para crecer.',
    cards: [
      { title: 'Conocer a Dios', description: 'Más que una religión, es una relación personal y transformadora que cambia todo.' },
      { title: 'Encontrar Libertad', description: 'Vivir sin ataduras en un ambiente seguro, lleno de gracia y aceptación real.' },
      { title: 'Descubrir Propósito', description: 'Entender tu diseño único y el plan extraordinario que Dios tiene para tu vida.' },
      { title: 'Hacer la Diferencia', description: 'Impactar la vida de otros y cambiar el mundo usando tus talentos y pasión.' },
    ],
  },
  volunteering: {
    title: 'Servolución',
    paragraph:
      'No es solo lo que hacemos, es quienes somos. Llevamos una fe activa que sale de las cuatro paredes para impactar nuestra ciudad.',
    button: 'Únete al Equipo',
  },
  events: { badge: 'Agenda', title: 'Próximos eventos' },
}

export const DEFAULT_NOSOTROS: NosotrosText = {
  hero: {
    badge: '# SOBRE NOSOTROS',
    title: 'No solo una iglesia,',
    accent: 'una familia.',
    subtitle:
      'Bienvenido a un lugar donde puedes ser tú mismo. Creemos y pertenecemos a la próxima generación para vivir con propósito y pasión por Jesús. Aquí encontrarás amigos, fe y un futuro brillante.',
    button: 'Ver Horarios',
  },
  caption: { title: 'Comunidad Joven', subtitle: 'Reuniones cada Domingo 11AM' },
  vision: {
    title: 'Nuestra Visión',
    subtitle:
      'Más que reuniones, construimos una comunidad viva y apasionada donde cada persona encuentra su propósito.',
    items: [
      { title: 'Comunidad Auténtica', description: 'Un espacio seguro donde puedes participar antes de creer. Fomentamos relaciones genuinas y duraderas.' },
      { title: 'Fe en Acción', description: 'No solo hablamos de fe, la vivimos. Llevamos un mensaje de esperanza a las calles y servimos a nuestra ciudad.' },
      { title: 'Liderazgo Joven', description: 'Creemos en tu potencial. Capacitamos y empoderamos a los líderes de mañana, hoy mismo.' },
    ],
  },
  cta: {
    title: 'Estamos emocionados de conocerte',
    paragraph:
      'No tienes que hacer esto solo. Ven tal como eres y sé parte de algo más grande. Tu historia importa aquí.',
    button: 'Contáctanos',
  },
}

export const DEFAULT_MINISTERIOS: MinisteriosText = {
  header: {
    badge: 'Nuestra Comunidad',
    title: 'Descubre tu lugar en la familia',
    subtitle:
      'Hay un espacio para ti. Ya sea que busques crecer espiritualmente, servir a otros o conectar con personas de tu edad.',
  },
  items: [
    { title: 'Jóvenes', description: 'Una comunidad vibrante para la siguiente generación. No caminamos solos, crecemos juntos.', schedule: 'Sábados 6:00 PM' },
    { title: 'Niños', description: 'Formando corazones desde la infancia con historias bíblicas, juegos y mucha diversión.', schedule: 'Domingos 10:00 AM' },
    { title: 'Alabanza', description: 'Exaltando a Dios a través del arte y la música. Si tocas un instrumento o cantas, este es tu lugar.', schedule: 'Jueves 7:00 PM' },
    { title: 'Grupos Pequeños', description: 'Vida en comunidad fuera de las cuatro paredes del templo. Comparte, ríe y crece en casas.', schedule: 'Diferentes horarios' },
    { title: 'Servicio Social', description: 'Siendo las manos y pies de Jesús en la ciudad a través de ayuda humanitaria y brigadas.', schedule: 'Sábados 9:00 AM' },
  ],
}

// ─── Merge (override sobre defaults, con fallback por campo) ─────────────────────

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

/** Fusiona `over` sobre `base`: objetos y arrays por clave/índice; los campos
 *  ausentes caen al valor por defecto (así nunca quedan huecos). */
function deepMerge<T>(base: T, over: unknown): T {
  if (Array.isArray(base)) {
    const ov = Array.isArray(over) ? over : []
    return base.map((item, i) => deepMerge(item, ov[i])) as unknown as T
  }
  if (isObj(base)) {
    const ov = isObj(over) ? over : {}
    const out: Record<string, unknown> = {}
    for (const k of Object.keys(base as object)) {
      out[k] = deepMerge((base as Record<string, unknown>)[k], ov[k])
    }
    return out as T
  }
  return over === undefined || over === null ? base : (over as T)
}

export function pickHomeText(blocks: Record<string, unknown>): HomeText {
  return deepMerge(DEFAULT_HOME, blocks.text_home)
}
export function pickNosotrosText(blocks: Record<string, unknown>): NosotrosText {
  return deepMerge(DEFAULT_NOSOTROS, blocks.text_nosotros)
}
export function pickMinisteriosText(blocks: Record<string, unknown>): MinisteriosText {
  return deepMerge(DEFAULT_MINISTERIOS, blocks.text_ministerios)
}

// ─── Carga puntual para el admin (sin caché) ─────────────────────────────────────

export async function loadHomeText(): Promise<HomeText> {
  return pickHomeText(await loadContent(true))
}
export async function loadNosotrosText(): Promise<NosotrosText> {
  return pickNosotrosText(await loadContent(true))
}
export async function loadMinisteriosText(): Promise<MinisteriosText> {
  return pickMinisteriosText(await loadContent(true))
}

export const saveHomeText = (v: HomeText) => saveBlock('text_home', v)
export const saveNosotrosText = (v: NosotrosText) => saveBlock('text_nosotros', v)
export const saveMinisteriosText = (v: MinisteriosText) => saveBlock('text_ministerios', v)
