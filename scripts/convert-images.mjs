/**
 * Converts PNG/JPG images in src/assets/images/ to WebP.
 * Run: node scripts/convert-images.mjs
 */

import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const imagesDir = path.join(__dirname, '../src/assets/images')

const CONVERSIONS = [
  // [input, output, quality]
  ['volunteering.jpg', 'volunteering.webp', 80],
  ['volunteering-mobile.jpg', 'volunteering-mobile.webp', 80],
  ['Hero.jpg', 'Hero.webp', 82],
  ['Carrusel1.jpg', 'Carrusel1.webp', 82],
  ['Carrusel2.jpg', 'Carrusel2.webp', 82],
  ['Carrusel3.jpg', 'Carrusel3.webp', 82],
  ['logo.png', 'logo.webp', 90],
  ['logo-claro-navbar.png', 'logo-claro-navbar.webp', 90],
]

async function formatBytes(filePath) {
  const { size } = await stat(filePath)
  return (size / 1024).toFixed(1) + ' KB'
}

console.log('Converting images to WebP...\n')

for (const [input, output, quality] of CONVERSIONS) {
  const inputPath = path.join(imagesDir, input)
  const outputPath = path.join(imagesDir, output)

  try {
    await sharp(inputPath).webp({ quality }).toFile(outputPath)

    const before = await formatBytes(inputPath)
    const after = await formatBytes(outputPath)
    console.log(`✓ ${input} (${before}) → ${output} (${after})`)
  } catch (err) {
    console.error(`✗ Failed to convert ${input}:`, err.message)
  }
}

console.log('\nDone.')
