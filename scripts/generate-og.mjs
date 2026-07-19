// Genera public/og-image.jpg (1200×630) para previews en redes sociales.
// Reproducible: vuelve a ejecutarlo si cambian el logo o los textos.
//   node scripts/generate-og.mjs
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const WIDTH = 1200
const HEIGHT = 630
const LOGO_H = 150

const logoPath = resolve(root, 'src/assets/images/logo-claro-navbar.png')
const outPath = resolve(root, 'public/og-image.jpg')

// Logo redimensionado a una altura fija, manteniendo proporción.
const logo = await sharp(logoPath)
  .resize({ height: LOGO_H })
  .png()
  .toBuffer()
const logoMeta = await sharp(logo).metadata()
const logoW = logoMeta.width ?? LOGO_H
const logoX = Math.round((WIDTH - logoW) / 2)
const logoY = 96

// Fondo con degradado de marca (cyan → blue → indigo) + círculos difuminados.
const background = Buffer.from(`
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0891b2"/>
      <stop offset="55%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#4338ca"/>
    </linearGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="70"/></filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <g opacity="0.25" filter="url(#blur)">
    <circle cx="180" cy="140" r="150" fill="#ffffff"/>
    <circle cx="1040" cy="520" r="190" fill="#67e8f9"/>
    <circle cx="640" cy="330" r="160" fill="#60a5fa"/>
  </g>
  <text x="${WIDTH / 2}" y="360" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="700"
    fill="#ffffff">Iglesia Nueva Casa</text>
  <text x="${WIDTH / 2}" y="430" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="400"
    fill="#e0f2fe">Comunidad cristiana en San Martín de Porres, Lima</text>
  <text x="${WIDTH / 2}" y="520" text-anchor="middle"
    font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="600"
    fill="#a5f3fc" letter-spacing="2">DOMINGOS · 11:00 AM</text>
</svg>`)

await sharp(background)
  .composite([{ input: logo, top: logoY, left: logoX }])
  .jpeg({ quality: 88 })
  .toFile(outPath)

console.log(`✓ og-image generado: public/og-image.jpg (${WIDTH}×${HEIGHT})`)
