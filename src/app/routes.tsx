import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'

// Lazy-load pages to reduce initial bundle size
const Home = lazy(() => import('@/pages/Home'))
const Nosotros = lazy(() => import('@/pages/Nosotros'))
const Ministerios = lazy(() => import('@/pages/Ministerios'))
const Predicas = lazy(() => import('@/pages/Predicas'))
const Contacto = lazy(() => import('@/pages/Contacto'))
const NotFound = lazy(() => import('@/pages/NotFound'))

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
])
