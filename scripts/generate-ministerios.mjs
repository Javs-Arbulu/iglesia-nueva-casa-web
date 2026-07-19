// Genera imágenes de tarjeta optimizadas para la página de Ministerios
// (WebP + JPG, 800×600 recorte "cover") a partir de fotos reales de la iglesia.
// Reproducible: vuelve a ejecutarlo si cambian las fotos de origen.
//   node scripts/generate-ministerios.mjs
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { mkdir } from 'node:fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const srcDir = resolve(root, 'src/assets/images')
const outDir = resolve(srcDir, 'ministerios')

const W = 800
const H = 600

// Mapeo ministerio → foto real de origen
const cards = [
  { name: 'jovenes', source: 'Carrusel2.jpg' },
  { name: 'ninos', source: 'Carrusel1.jpg' },
  { name: 'alabanza', source: 'Hero.png' },
  { name: 'grupos', source: 'Carrusel3.jpg' },
  { name: 'servicio', source: 'volunteering.png' },
]

await mkdir(outDir, { recursive: true })

for (const { name, source } of cards) {
  const input = resolve(srcDir, source)
  const base = sharp(input).resize(W, H, { fit: 'cover', position: 'attention' })

  await base.clone().webp({ quality: 78 }).toFile(resolve(outDir, `${name}.webp`))
  await base.clone().jpeg({ quality: 80 }).toFile(resolve(outDir, `${name}.jpg`))
  console.log(`✓ ${name}  (${source} → ${W}×${H})`)
}

console.log('Listo: src/assets/images/ministerios/')
