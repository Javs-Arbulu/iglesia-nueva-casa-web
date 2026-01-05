import { createClient, SupabaseClient } from '@supabase/supabase-js'

class SupabaseConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SupabaseConfigError'
  }
}

const validateEnvVariable = (
  value: string | undefined,
  name: string
): string => {
  if (!value || value.trim() === '') {
    throw new SupabaseConfigError(
      `La variable de entorno ${name} no está definida. ` +
        `Asegúrate de configurarla en tu archivo .env`
    )
  }
  return value.trim()
}

const validateUrl = (url: string): void => {
  try {
    const parsedUrl = new URL(url)
    if (!parsedUrl.protocol.startsWith('http')) {
      throw new Error('El protocolo debe ser HTTP o HTTPS')
    }
  } catch (error) {
    throw new SupabaseConfigError(
      `VITE_SUPABASE_URL no es una URL válida: ${error instanceof Error ? error.message : 'formato inválido'}`
    )
  }
}

const initializeSupabase = (): SupabaseClient => {
  try {
    const supabaseUrl = validateEnvVariable(
      import.meta.env.VITE_SUPABASE_URL,
      'VITE_SUPABASE_URL'
    )

    const supabaseAnonKey = validateEnvVariable(
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      'VITE_SUPABASE_ANON_KEY'
    )

    validateUrl(supabaseUrl)

    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    if (error instanceof SupabaseConfigError) {
      console.error('❌ Error de configuración de Supabase:', error.message)
    } else {
      console.error('❌ Error inesperado al inicializar Supabase:', error)
    }
    throw error
  }
}

export const supabase = initializeSupabase()
