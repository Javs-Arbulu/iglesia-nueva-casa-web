// Genera public/sitemap.xml automáticamente a partir de las rutas definidas en
// src/app/routes.tsx. Se ejecuta como primer paso de `yarn build`, así el
// sitemap nunca se desincroniza al agregar/quitar páginas.
//   node scripts/generate-sitemap.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE_URL = 'https://nuevacasa.pe'

// Metadatos por ruta (prioridad + frecuencia). Rutas nuevas usan el fallback.
const META = {
  '/': { changefreq: 'weekly', priority: '1.0' },
  '/predicas': { changefreq: 'weekly', priority: '0.8' },
  '/nosotros': { changefreq: 'monthly', priority: '0.8' },
  '/ministerios': { changefreq: 'monthly', priority: '0.8' },
  '/contacto': { changefreq: 'monthly', priority: '0.7' },
}
const FALLBACK = { changefreq: 'monthly', priority: '0.6' }

// Extrae las rutas de routes.tsx (path: '...'), descartando el comodín 404.
const routesSrc = readFileSync(resolve(root, 'src/app/routes.tsx'), 'utf8')
const paths = [...routesSrc.matchAll(/path:\s*'([^']+)'/g)]
  .map((m) => m[1])
  .filter((p) => p !== '*')

// Ordena: home primero, luego alfabético; sin duplicados.
const unique = [...new Set(paths)].sort((a, b) =>
  a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)
)

const urls = unique
  .map((path) => {
    const { changefreq, priority } = META[path] ?? FALLBACK
    const loc = `${SITE_URL}${path === '/' ? '/' : path}`
    return `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

writeFileSync(resolve(root, 'public/sitemap.xml'), xml)
console.log(`✓ sitemap.xml generado con ${unique.length} rutas: ${unique.join(', ')}`)
