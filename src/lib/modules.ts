import {
  LayoutDashboard,
  CalendarDays,
  Image as ImageIcon,
  FileText,
  Wallet,
  MessageSquare,
  Users,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

export type ModuleAction = 'view' | 'edit' | 'delete'

export interface AdminModule {
  /** ID usado en la matriz de permisos (role_permissions.module_id) y por has_perm(). */
  id: string
  label: string
  to: string
  icon: LucideIcon
  end?: boolean
  /** Acciones que soporta el módulo (define qué columnas muestra la matriz). */
  actions: ModuleAction[]
}

/**
 * Fuente única de los módulos del panel admin. Agregar un módulo nuevo aquí lo
 * habilita en el menú, los guards y la matriz de permisos — sin tocar más nada.
 */
export const MODULES: AdminModule[] = [
  { id: 'inicio', label: 'Inicio', to: '/admin', icon: LayoutDashboard, end: true, actions: ['view'] },
  { id: 'eventos', label: 'Eventos', to: '/admin/eventos', icon: CalendarDays, actions: ['view', 'edit', 'delete'] },
  { id: 'fotos', label: 'Fotos', to: '/admin/fotos', icon: ImageIcon, actions: ['view', 'edit', 'delete'] },
  { id: 'contenido', label: 'Contenido', to: '/admin/contenido', icon: FileText, actions: ['view', 'edit'] },
  { id: 'finanzas', label: 'Finanzas', to: '/admin/finanzas', icon: Wallet, actions: ['view', 'edit', 'delete'] },
  { id: 'mensajes', label: 'Mensajes', to: '/admin/mensajes', icon: MessageSquare, actions: ['view', 'edit', 'delete'] },
  { id: 'usuarios', label: 'Usuarios', to: '/admin/usuarios', icon: Users, actions: ['view', 'edit'] },
  { id: 'roles', label: 'Roles y permisos', to: '/admin/roles', icon: ShieldCheck, actions: ['view', 'edit'] },
]
