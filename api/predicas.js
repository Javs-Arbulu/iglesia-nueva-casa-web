// Función serverless de Vercel: GET /api/predicas
// Devuelve las últimas prédicas del canal de YouTube (vía feed RSS gratuito),
// con caché en el edge de Vercel para no golpear YouTube en cada visita.
import { getPredicas } from './_youtube.js'

export default async function handler(_req, res) {
  try {
    const videos = await getPredicas(12)
    // Cache 1h en el edge; sirve versión vieja mientras revalida hasta 24h.
    res.setHeader(
      'Cache-Control',
      's-maxage=3600, stale-while-revalidate=86400'
    )
    res.status(200).json({ videos })
  } catch (error) {
    console.error('Error al obtener prédicas:', error)
    res
      .status(502)
      .json({ error: 'No se pudieron cargar las prédicas.', videos: [] })
  }
}
