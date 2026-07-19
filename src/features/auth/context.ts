import { createContext, useContext } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { AppRole, Profile } from '@/types'

export interface AuthContextValue {
  session: Session | null
  user: User | null
  profile: Profile | null
  roles: AppRole[]
  loading: boolean
  /** true si hay credenciales de Supabase configuradas */
  configured: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  hasRole: (...roles: AppRole[]) => boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return ctx
}
