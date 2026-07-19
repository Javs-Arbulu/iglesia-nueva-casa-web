import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { router } from '@/app/routes'
import { AuthProvider } from '@/features/auth/AuthProvider'
import ErrorBoundary from '@/components/common/ErrorBoundary'
// Fuentes auto-hospedadas (Fontsource) — Poppins (UI) + Caveat (acento manuscrito)
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-600.css'
import '@fontsource/poppins/latin-700.css'
import '@fontsource/poppins/latin-800.css'
import '@fontsource/poppins/latin-900.css'
import '@fontsource-variable/caveat/wght.css'
import './main.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
      <Analytics />
    </AuthProvider>
  </React.StrictMode>
)

// PWA: registrar el service worker solo en producción (evita caché en dev).
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
