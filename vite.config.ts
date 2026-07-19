import { defineConfig } from 'vitest/config'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Replica /api/predicas en desarrollo (en producción lo sirve Vercel).
function predicasDevApi(): Plugin {
  return {
    name: 'predicas-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/predicas', async (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        try {
          const { getPredicas } = await import('./api/_youtube.js')
          const videos = await getPredicas(12)
          res.end(JSON.stringify({ videos }))
        } catch (error) {
          console.error('Error dev /api/predicas:', error)
          res.statusCode = 502
          res.end(
            JSON.stringify({
              error: 'No se pudieron cargar las prédicas.',
              videos: [],
            })
          )
        }
      })

      server.middlewares.use('/api/live', async (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        try {
          const { getLiveStatus } = await import('./api/_youtube.js')
          res.end(JSON.stringify(await getLiveStatus()))
        } catch (error) {
          console.error('Error dev /api/live:', error)
          res.end(JSON.stringify({ live: false }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), predicasDevApi()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: false,
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
  },
})
