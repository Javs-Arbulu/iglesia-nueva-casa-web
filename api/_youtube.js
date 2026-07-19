// Lógica compartida para leer prédicas del feed RSS público de YouTube.
// Gratis, sin API key ni cuota. Usado por la función serverless de Vercel
// (api/predicas.js) y por el middleware de desarrollo en vite.config.ts.

export const YOUTUBE_CHANNEL_ID = 'UC9WB9NIaV1_FPLXLUEa1dnw'
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`

const UA = 'Mozilla/5.0 (compatible; NuevaCasaBot/1.0)'

/**
 * fetch con reintentos. El feed RSS/live de YouTube a veces responde 404/500 de
 * forma intermitente; reintentamos para que un fallo puntual no rompa la carga.
 */
async function fetchWithRetry(url, options = {}, retries = 3) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': UA }, ...options })
      if (res.ok) return res
      lastError = new Error(`respondió ${res.status}`)
    } catch (err) {
      lastError = err
    }
    if (attempt < retries) {
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)))
    }
  }
  throw lastError
}

const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')

/**
 * Parsea el XML del feed a un arreglo de prédicas. Función pura (testeable).
 * @param {string} xml
 * @param {number} limit
 */
export function parseFeed(xml, limit = 12) {
  const entries = xml.split('<entry>').slice(1)

  return entries
    .map((entry) => {
      const pick = (re) => entry.match(re)?.[1]?.trim() ?? ''
      const id = pick(/<yt:videoId>([^<]+)<\/yt:videoId>/)
      const title = decodeEntities(pick(/<title>([^<]+)<\/title>/))
      const published = pick(/<published>([^<]+)<\/published>/)
      return {
        id,
        title,
        published,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      }
    })
    .filter((v) => v.id)
    .slice(0, limit)
}

/** Descarga y parsea el feed (con reintentos). Lanza si todos fallan. */
export async function getPredicas(limit = 12) {
  const res = await fetchWithRetry(FEED_URL)
  return parseFeed(await res.text(), limit)
}

const LIVE_URL = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/live`

/**
 * Detecta si el canal está transmitiendo AHORA, sin API key.
 * Cuando está en vivo, la página /live tiene su canonical apuntando a
 * watch?v=<id>; cuando no, apunta al canal. Devuelve { live, videoId? }.
 */
export async function getLiveStatus() {
  try {
    const res = await fetchWithRetry(LIVE_URL, { redirect: 'follow' })
    const html = await res.text()
    const match = html.match(
      /<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})"/
    )
    return match ? { live: true, videoId: match[1] } : { live: false }
  } catch {
    return { live: false }
  }
}
