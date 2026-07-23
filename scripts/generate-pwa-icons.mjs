// Genera los íconos PWA para "agregar a pantalla de inicio":
// logo blanco centrado sobre un degradado de marca. Full-bleed (sin bordes
// redondeados) para que funcionen como "maskable" (el SO aplica su forma).
//   - pwa-192x192.png / pwa-512x512.png  → Android / manifest
//   - apple-touch-icon.png (180x180, sin alfa) → iPhone / iPad (Safari)
//   node scripts/generate-pwa-icons.mjs
import sharp from 'sharp'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const logoPath = resolve(root, 'src/assets/images/logo-claro-navbar.png')
const outDir = resolve(root, 'public')

const background = (size) =>
  Buffer.from(`
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0891b2"/>
      <stop offset="55%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#4338ca"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#g)"/>
</svg>`)

// fileName: nombre de salida (por defecto `pwa-<size>x<size>.png`).
// opaque: quita el canal alfa (iOS rellena de negro lo transparente).
async function makeIcon(size, { fileName, opaque = false } = {}) {
  const logo = await sharp(logoPath)
    .resize({ width: Math.round(size * 0.55) })
    .png()
    .toBuffer()
  const meta = await sharp(logo).metadata()
  const left = Math.round((size - (meta.width ?? 0)) / 2)
  const top = Math.round((size - (meta.height ?? 0)) / 2)
  const name = fileName ?? `pwa-${size}x${size}.png`
  let pipeline = sharp(background(size)).composite([{ input: logo, left, top }])
  if (opaque) pipeline = pipeline.removeAlpha()
  await pipeline.png().toFile(resolve(outDir, name))
  console.log(`✓ ${name}`)
}

await makeIcon(192)
await makeIcon(512)
// iOS: apple-touch-icon 180x180, sin transparencia.
await makeIcon(180, { fileName: 'apple-touch-icon.png', opaque: true })
