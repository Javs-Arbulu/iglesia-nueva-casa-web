// Service worker de la Iglesia Nueva Casa.
// Estrategia CONSERVADORA para no servir contenido viejo:
//  - Navegaciones (HTML): network-first, con la cáscara cacheada como respaldo offline.
//  - Assets con hash (/assets/*): cache-first (son inmutables → rápido y seguro).
//  - Otros same-origin (íconos, manifest): network-first con respaldo a caché.
//  - /api/* y terceros (Supabase, YouTube, Maps): NO se interceptan → siempre red.
const CACHE = 'nueva-casa-v1'
const SHELL = ['/', '/index.html']

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(SHELL))
      .catch(() => {})
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  // Terceros (Supabase, ytimg, maps) y las funciones /api: siempre de red.
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return

  // Navegaciones → network-first, respaldo a la cáscara.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put('/', copy)).catch(() => {})
          return res
        })
        .catch(() =>
          caches.match('/').then((r) => r || caches.match('/index.html'))
        )
    )
    return
  }

  // Assets con hash → cache-first.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {})
            return res
          })
      )
    )
    return
  }

  // Resto same-origin → network-first con respaldo a caché.
  event.respondWith(
    fetch(request)
      .then((res) => {
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put(request, copy)).catch(() => {})
        return res
      })
      .catch(() => caches.match(request))
  )
})
