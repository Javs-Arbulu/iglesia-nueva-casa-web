// Genera los íconos PWA (192 y 512) para "agregar a pantalla de inicio":
// logo blanco centrado sobre un degradado de marca. Full-bleed (sin bordes
// redondeados) para que funcionen como "maskable" (el SO aplica su forma).
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

async function makeIcon(size) {
  const logo = await sharp(logoPath)
    .resize({ width: Math.round(size * 0.55) })
    .png()
    .toBuffer()
  const meta = await sharp(logo).metadata()
  const left = Math.round((size - (meta.width ?? 0)) / 2)
  const top = Math.round((size - (meta.height ?? 0)) / 2)
  const out = resolve(outDir, `pwa-${size}x${size}.png`)
  await sharp(background(size))
    .composite([{ input: logo, left, top }])
    .png()
    .toFile(out)
  console.log(`✓ pwa-${size}x${size}.png`)
}

await makeIcon(192)
await makeIcon(512)
