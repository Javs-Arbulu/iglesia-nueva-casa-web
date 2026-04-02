import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'

// Lazy-load pages to reduce initial bundle size
const Home = lazy(() => import('@/pages/Home'))
const Nosotros = lazy(() => import('@/pages/Nosotros'))
const Ministerios = lazy(() => import('@/pages/Ministerios'))
const Contacto = lazy(() => import('@/pages/Contacto'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Minimal fallback shown during page-level code-splitting loads
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
          <Suspense fallback={<PageFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/nosotros',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Nosotros />
          </Suspense>
        ),
      },
      {
        path: '/ministerios',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Ministerios />
          </Suspense>
        ),
      },
      {
        path: '/contacto',
        element: (
          <Suspense fallback={<PageFallback />}>
            <Contacto />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageFallback />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
])
