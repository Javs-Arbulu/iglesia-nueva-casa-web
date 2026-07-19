// Función serverless de Vercel: GET /api/keepalive
// La dispara un Vercel Cron (ver vercel.json). Hace una petición mínima a
// Supabase para mantener el proyecto ACTIVO y evitar la pausa por inactividad
// del plan gratuito (7 días sin actividad → pausa).
//
// Lee las mismas variables del proyecto en Vercel (el prefijo VITE_ solo afecta
// al bundle del cliente; en runtime la función puede leerlas igual).
export default async function handler(_req, res) {
  // Acepta el nombre de la integración de Supabase (SUPABASE_URL) o el que usa
  // el cliente Vite (VITE_SUPABASE_URL). Igual para la anon key.
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const key =
    process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

  if (!url || !key) {
    return res
      .status(200)
      .json({ ok: false, reason: 'Faltan las variables de Supabase (URL / anon key)' })
  }

  try {
    const r = await fetch(
      `${url}/rest/v1/contact_submissions?select=id&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    )
    return res.status(200).json({ ok: r.ok, status: r.status })
  } catch (error) {
    console.error('keepalive falló:', error)
    return res.status(200).json({ ok: false, error: String(error) })
  }
}
