// Función serverless de Vercel: GET /api/live
// Indica si el canal está transmitiendo en vivo ahora (sin API key).
import { getLiveStatus } from './_youtube.js'

export default async function handler(_req, res) {
  try {
    const status = await getLiveStatus()
    // Caché corta: el estado de "en vivo" cambia con frecuencia.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
    res.status(200).json(status)
  } catch (error) {
    console.error('Error al detectar transmisión:', error)
    res.status(200).json({ live: false })
  }
}
