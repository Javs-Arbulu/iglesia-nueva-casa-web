---
name: seo-page
description: Checklist de SEO al crear o modificar páginas, incluyendo meta tags, Open Graph, Twitter Cards, JSON-LD y robots
---

## Qué hace este skill

Guía para asegurar que cada página del sitio esté bien optimizada para motores de búsqueda.

## Checklist por página

### Meta básicos (en el componente `<SEO>` o directamente en `index.html`)

- [ ] `<title>` único por página — formato: "Nombre Página | Nueva Casa"
- [ ] `<meta name="description">` — 150-160 caracteres, incluir "iglesia", "Lima", palabras clave
- [ ] `<html lang="es">` — ya aplicado en `index.html`

### Open Graph (para redes sociales)

- [ ] `og:title`
- [ ] `og:description`
- [ ] `og:image` — imagen 1200x630px
- [ ] `og:url`
- [ ] `og:type` — generalmente `website`
- [ ] `og:locale` — `es_PE`

### Twitter Cards

- [ ] `twitter:card` — `summary_large_image`
- [ ] `twitter:title`
- [ ] `twitter:description`
- [ ] `twitter:image`

### Datos estructurados JSON-LD

Para el sitio de una iglesia, usar `@type: Church`:

```json
{
  "@context": "https://schema.org",
  "@type": "Church",
  "name": "Iglesia Nueva Casa",
  "url": "https://nuevacasa.pe",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jr. Los Pinos 123",
    "addressLocality": "San Martín de Porres",
    "addressRegion": "Lima",
    "addressCountry": "PE"
  },
  "telephone": "",
  "openingHours": "Su 09:00-12:00"
}
```

### Archivos estáticos

- [ ] `public/robots.txt` — ya creado
- [ ] `public/sitemap.xml` — actualizar cuando se agreguen nuevas páginas
- [ ] `public/favicon.png` (32x32) + `public/favicon.ico`

## Uso del componente SEO en páginas

```tsx
import SEO from '@/components/common/SEO'

const MiPagina = () => (
  <>
    <SEO
      title="Nosotros | Nueva Casa"
      description="Conoce quiénes somos, nuestra visión y los valores que guían a la Iglesia Nueva Casa en Lima."
    />
    <main>...</main>
  </>
)
```

## Notas importantes

- Las páginas son un SPA (React Router), por lo que los meta tags se manejan en el cliente con `react-helmet-async`
- Para cambios en `robots.txt` o `sitemap.xml`, editar directamente en `public/`
- No olvidar actualizar `sitemap.xml` cuando se agregan nuevas rutas al router
