/**
 * Comprime/redimensiona una imagen en el dispositivo antes de subirla, para
 * mantener el sitio rápido y el Storage liviano. Respeta la orientación EXIF.
 * Devuelve un Blob JPEG.
 */
export async function compressImage(
  file: File,
  maxWidth = 1600,
  quality = 0.82
): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, maxWidth / bitmap.width)
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo procesar la imagen')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()

  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo comprimir'))),
      'image/jpeg',
      quality
    )
  })
}
