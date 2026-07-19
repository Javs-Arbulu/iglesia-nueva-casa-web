import { useEffect } from 'react'

const SITE_URL = 'https://nuevacasa.pe'
const SITE_NAME = 'Iglesia Nueva Casa'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}

/** Crea o actualiza <meta {attr}="{key}" content="..."> en el <head>. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/** Crea o actualiza <link rel="canonical" href="..."> en el <head>. */
function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Metadatos de SEO por página. Actualiza IN SITU las etiquetas que ya existen
 * en index.html (título, description, Open Graph, Twitter) en lugar de crear
 * nuevas, evitando duplicados. index.html trae los valores estáticos por
 * defecto (para scrapers que no ejecutan JS); esto los sobrescribe por ruta.
 */
const SEO = ({
  title = `${SITE_NAME} | Iglesia en Lima, Perú`,
  description = 'Iglesia Nueva Casa es una comunidad cristiana en San Martín de Porres, Lima. Únete a nosotros cada domingo y descubre un lugar donde perteneces.',
  image = DEFAULT_IMAGE,
  url = SITE_URL,
  type = 'website',
}: SEOProps) => {
  useEffect(() => {
    document.title = title
    setMeta('name', 'description', description)
    setCanonical(url)

    setMeta('property', 'og:type', type)
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:image', image)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:site_name', SITE_NAME)
    setMeta('property', 'og:locale', 'es_PE')

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)
  }, [title, description, image, url, type])

  return null
}

export default SEO
