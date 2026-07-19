import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import { AuthGuard, RoleGuard } from '@/features/auth/guards'

// Lazy-load pages to reduce initial bundle size
const Home = lazy(() => import('@/pages/Home'))
const Nosotros = lazy(() => import('@/pages/Nosotros'))
const Ministerios = lazy(() => import('@/pages/Ministerios'))
const Predicas = lazy(() => import('@/pages/Predicas'))
const Galeria = lazy(() => import('@/pages/Galeria'))
const Contacto = lazy(() => import('@/pages/Contacto'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Portal (auth, admin, área de miembros) — cargado aparte del sitio público
const Login = lazy(() => import('@/pages/Login'))
const Registro = lazy(() => import('@/pages/Registro'))
const Portal = lazy(() => import('@/pages/Portal'))
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'))
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'))
const Mensajes = lazy(() => import('@/pages/admin/Mensajes'))
const Usuarios = lazy(() => import('@/pages/admin/Usuarios'))
const Eventos = lazy(() => import('@/pages/admin/Eventos'))
const Fotos = lazy(() => import('@/pages/admin/Fotos'))

// Minimal spinner shown during page-level code-splitting loads.
// Defined as JSX element (not a component) so this file only exports non-components,
// keeping react-refresh/only-export-components happy.
const pageFallback = (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950">
    <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
  </div>
)

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={pageFallback}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/nosotros',
        element: (
          <Suspense fallback={pageFallback}>
            <Nosotros />
          </Suspense>
        ),
      },
      {
        path: '/ministerios',
        element: (
          <Suspense fallback={pageFallback}>
            <Ministerios />
          </Suspense>
        ),
      },
      {
        path: '/predicas',
        element: (
          <Suspense fallback={pageFallback}>
            <Predicas />
          </Suspense>
        ),
      },
      {
        path: '/galeria',
        element: (
          <Suspense fallback={pageFallback}>
            <Galeria />
          </Suspense>
        ),
      },
      {
        path: '/contacto',
        element: (
          <Suspense fallback={pageFallback}>
            <Contacto />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={pageFallback}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },

  // ── Portal (fuera del PublicLayout: sin navbar/footer públicos) ──────────
  {
    path: '/login',
    element: (
      <Suspense fallback={pageFallback}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/registro',
    element: (
      <Suspense fallback={pageFallback}>
        <Registro />
      </Suspense>
    ),
  },
  {
    path: '/portal',
    element: (
      <Suspense fallback={pageFallback}>
        <AuthGuard>
          <Portal />
        </AuthGuard>
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={pageFallback}>
        <AuthGuard>
          <RoleGuard roles={['admin', 'editor', 'finanzas']}>
            <AdminLayout />
          </RoleGuard>
        </AuthGuard>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={pageFallback}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: 'eventos',
        element: (
          <Suspense fallback={pageFallback}>
            <RoleGuard roles={['admin', 'editor']}>
              <Eventos />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: 'fotos',
        element: (
          <Suspense fallback={pageFallback}>
            <RoleGuard roles={['admin', 'editor']}>
              <Fotos />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: 'mensajes',
        element: (
          <Suspense fallback={pageFallback}>
            <RoleGuard roles={['admin']}>
              <Mensajes />
            </RoleGuard>
          </Suspense>
        ),
      },
      {
        path: 'usuarios',
        element: (
          <Suspense fallback={pageFallback}>
            <RoleGuard roles={['admin']}>
              <Usuarios />
            </RoleGuard>
          </Suspense>
        ),
      },
    ],
  },
])
