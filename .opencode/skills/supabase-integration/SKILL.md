---
name: supabase-integration
description: Patrones para consultas a Supabase en el proyecto, manejo de errores en español, tipos TypeScript y uso correcto del lazy singleton getSupabase()
---

## Qué hace este skill

Guía para interactuar correctamente con Supabase en este proyecto.

## Regla fundamental

NUNCA importar `supabase` directamente. SIEMPRE usar `getSupabase()`:

```ts
// ✅ CORRECTO
import { getSupabase } from '@/services/supabase'
const supabase = getSupabase()

// ❌ INCORRECTO
import { supabase } from '@/services/supabase'
```

## Patrón de insert (formulario de contacto)

```ts
import { getSupabase } from '@/services/supabase'

const enviarFormulario = async (data: ContactFormData) => {
  const { error } = await getSupabase().from('contact_submissions').insert({
    nombre: data.nombre.trim(),
    email: data.email.trim().toLowerCase(),
    asunto: data.asunto.trim(),
    mensaje: data.mensaje.trim(),
  })

  if (error) throw error
}
```

## Manejo de errores

Todos los mensajes de error deben estar en español:

```ts
try {
  await enviarFormulario(formData)
  setSubmitStatus('success')
} catch (err) {
  console.error('Error al enviar el formulario:', err)
  setSubmitError('No pudimos enviar tu mensaje. Por favor intenta de nuevo.')
}
```

## Estados de un formulario async

```ts
type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'
const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle')
```

## Tabla `contact_submissions` (esquema esperado)

```sql
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  asunto text not null,
  mensaje text not null,
  created_at timestamptz default now()
);
```

## Variables de entorno requeridas

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Ambas deben estar en `.env` (no commitear) y en `.env.example` (sí commitear).
