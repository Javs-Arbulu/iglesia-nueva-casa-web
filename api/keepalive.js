// Función serverless de Vercel: GET /api/keepalive
// La dispara un Vercel Cron (ver vercel.json). Hace una petición mínima a cada
// proyecto de Supabase para mantenerlos ACTIVOS y evitar la pausa por
// inactividad del plan gratuito (7 días sin actividad → pausa).
//
// Mantiene vivos:
//   1. El proyecto principal (prod): SUPABASE_URL / VITE_SUPABASE_URL.
//   2. Un proyecto extra opcional (dev/staging): KEEPALIVE_EXTRA_URL /
//      KEEPALIVE_EXTRA_ANON_KEY. Sin prefijo VITE_ → NO se expone al cliente.
//
// El cron corre en PRODUCCIÓN, así que basta con configurar las variables extra
// (con los datos de dev) en el entorno Production de Vercel.

async function ping(name, url, key) {
  if (!url || !key) return { name, ok: false, skipped: true }
  try {
    const r = await fetch(`${url}/rest/v1/contact_submissions?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    return { name, ok: r.ok, status: r.status }
  } catch (error) {
    console.error(`keepalive (${name}) falló:`, error)
    return { name, ok: false, error: String(error) }
  }
}

export default async function handler(_req, res) {
  const targets = [
    {
      name: 'primary',
      url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL,
      key: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY,
    },
    {
      name: 'extra',
      url: process.env.KEEPALIVE_EXTRA_URL,
      key: process.env.KEEPALIVE_EXTRA_ANON_KEY,
    },
  ]

  const results = await Promise.all(targets.map((t) => ping(t.name, t.url, t.key)))
  return res.status(200).json({ results })
}
