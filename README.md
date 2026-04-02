# Iglesia Nueva Casa — Web

Sitio web público de la Iglesia Nueva Casa (Lima, Perú).  
SPA construida con **React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui**.

---

## Requisitos previos

| Herramienta | Versión mínima |
| ----------- | -------------- |
| Node.js     | 20             |
| Yarn        | 1.22           |

---

## Inicio rápido

```bash
# 1. Instalar dependencias
yarn

# 2. Crear variables de entorno
cp .env.example .env        # o crear .env manualmente (ver sección Variables de entorno)

# 3. Servidor de desarrollo
yarn dev                    # http://localhost:5173
```

---

## Scripts disponibles

| Comando           | Descripción                                  |
| ----------------- | -------------------------------------------- |
| `yarn dev`        | Servidor de desarrollo con HMR (puerto 5173) |
| `yarn build`      | Build de producción: `tsc -b && vite build`  |
| `yarn preview`    | Preview del build de producción              |
| `yarn lint`       | ESLint con flat config                       |
| `yarn test`       | Ejecutar tests (Vitest)                      |
| `yarn test:watch` | Tests en modo watch                          |
| `yarn test:ui`    | Interfaz visual de Vitest                    |
| `yarn coverage`   | Reporte de cobertura                         |

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con:

```env
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>
```

Estas variables son **requeridas** para que el formulario de contacto funcione.  
Para el despliegue en Vercel, configurarlas en **Settings → Environment Variables**.  
Para GitHub Actions, agregarlas como secretos del repositorio (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

---

## Estructura del proyecto

```
iglesia-nueva-casa-web/
├── public/
│   ├── favicon.png
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   └── convert-images.mjs      # Conversión PNG/JPG → WebP con sharp
├── src/
│   ├── app/routes.tsx           # Router (todas las páginas son lazy)
│   ├── assets/images/           # Imágenes locales (PNG/JPG + WebP)
│   ├── components/
│   │   ├── common/              # Navbar, Footer, ErrorBoundary, SEO, secciones Landing
│   │   └── ui/                  # Primitivas shadcn/ui (button, carousel)
│   ├── hooks/useScroll.ts       # useScrollTop, useScrollToHash
│   ├── layouts/PublicLayout.tsx
│   ├── lib/
│   │   ├── constants.ts         # NAV_LINKS, SOCIAL_HREFS, CHURCH_INFO, MINISTERIO_TABS
│   │   └── utils.ts             # cn() helper
│   ├── pages/                   # Home, Nosotros, ADN, Ministerios, Contacto, NotFound
│   ├── services/supabase.ts     # getSupabase() — lazy singleton
│   ├── test/setup.ts            # Setup de Vitest + @testing-library/jest-dom
│   ├── __tests__/               # Tests unitarios e integración
│   └── types/index.ts           # Tipos/interfaces centralizados
├── AGENTS.md                    # Guía de convenciones para OpenCode
├── opencode.json                # Configuración de OpenCode
├── vercel.json                  # Rewrites SPA + cache headers
├── tsconfig.app.json
└── tsconfig.test.json           # Extends app, agrega tipos de Vitest
```

---

## Stack y versiones

| Tecnología         | Versión  |
| ------------------ | -------- |
| React              | 19.2.0   |
| TypeScript         | ~5.9.3   |
| Vite               | ^7.2.4   |
| React Router DOM   | ^7.11.0  |
| Tailwind CSS       | 3.4.17   |
| shadcn/ui          | new-york |
| Supabase JS        | ^2.89.0  |
| react-helmet-async | ^3.0.0   |
| Lucide React       | ^0.562.0 |
| Vitest             | 3        |

---

## Despliegue

El sitio está configurado para desplegarse en **Vercel**.

- `vercel.json` incluye la reescritura SPA (`/* → /index.html`) y cabeceras de caché optimizadas.
- El pipeline CI/CD de GitHub Actions (`.github/workflows/ci.yml`) ejecuta lint y build en cada push/PR a `main` o `develop`.

Para desplegar manualmente:

```bash
yarn build
# Subir el contenido de dist/ a Vercel (o conectar el repositorio en vercel.com)
```

---

## Optimización de imágenes

Las imágenes locales están disponibles tanto en formato original (PNG/JPG) como en WebP.  
Los componentes usan `<picture>` con `<source type="image/webp">` para servir WebP a navegadores compatibles y el formato original como fallback.

Para regenerar las versiones WebP después de reemplazar imágenes:

```bash
node scripts/convert-images.mjs
```

---

## Supabase

El cliente de Supabase usa el patrón **lazy singleton**:

```ts
import { getSupabase } from '@/services/supabase'

const { data, error } = await getSupabase().from('tabla').select('*')
```

**Nunca** importar `supabase` directamente — usar siempre `getSupabase()`.

La tabla requerida en Supabase es `contact_submissions` con columnas:
`nombre`, `email`, `asunto`, `mensaje` (todas `text`, `not null`).

---

## Roadmap

- [ ] Modo oscuro (toggle en Navbar)
- [ ] Analíticas con Plausible (privacy-first)
- [ ] Honeypot anti-spam en el formulario de contacto
- [ ] PWA (service worker + manifest)
- [ ] Autenticación (el botón "Ingresar" está reservado para esto)
