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

const SEO = ({
  title = `${SITE_NAME} | Iglesia en Lima, Perú`,
  description = 'Iglesia Nueva Casa es una comunidad cristiana en San Martín de Porres, Lima. Únete a nosotros cada domingo y descubre un lugar donde perteneces.',
  image = DEFAULT_IMAGE,
  url = SITE_URL,
  type = 'website',
}: SEOProps) => {
  // React 19 eleva <title>/<meta>/<link> al <head> automáticamente.
  return (
    <>
      {/* Primary */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="es_PE" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </>
  )
}

export default SEO
