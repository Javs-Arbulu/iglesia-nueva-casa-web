# Iglesia Nueva Casa — Web

SPA pública para la Iglesia Nueva Casa (Lima, Perú). React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui.

## Comandos esenciales

```bash
yarn dev          # Servidor de desarrollo (puerto 5173)
yarn build        # Producción: tsc -b && vite build
yarn lint         # ESLint flat config
yarn preview      # Preview del build de producción
```

SIEMPRE ejecutar `yarn build` antes de terminar una tarea para confirmar que no hay errores de TypeScript ni de Vite.

## Estructura del proyecto

```
src/
├── app/routes.tsx          # Router (todas las páginas son lazy)
├── components/
│   ├── common/             # Navbar, Footer, ErrorBoundary, secciones Landing
│   └── ui/                 # Primitivas shadcn/ui (button, carousel)
├── hooks/                  # useScrollTop, useScrollToHash
├── layouts/PublicLayout.tsx
├── lib/
│   ├── constants.ts        # NAV_LINKS, SOCIAL_HREFS, CHURCH_INFO, MINISTERIO_TABS
│   └── utils.ts            # cn() helper
├── pages/                  # Home, Nosotros, ADN, Ministerios, Contacto, NotFound
├── services/supabase.ts    # getSupabase() — lazy singleton, nunca eager init
└── types/index.ts          # Todos los tipos/interfaces centralizados
```

## Convenciones obligatorias

- Todo el texto de UI está en **español**
- Usar `<Link>` de React Router para navegación interna — NUNCA `<a href="...">`
- Tipos nuevos van en `src/types/index.ts`
- Constantes de datos van en `src/lib/constants.ts`
- CSS keyframes van en `src/main.css` — NUNCA en `<style>` inline
- Componentes usan **Tailwind CSS** — no CSS modules, no styled-components
- shadcn/ui estilo **"new-york"**, iconos **lucide-react**
- Imágenes responsivas con `<picture>` — no JS resize listeners
- Formularios con validación client-side + atributos ARIA (`aria-required`, `aria-invalid`, `aria-describedby`)
- Errores de formulario con `role="alert"` y `FieldError` pattern
- Imágenes no críticas con `loading="lazy"`
- Supabase: usar siempre `getSupabase()` (lazy singleton) — NUNCA importar `supabase` directamente

## Accesibilidad (a11y)

- `aria-label` en todos los íconos/botones sin texto visible
- `aria-current="page"` en el link activo de la nav
- `role="list"` en `<ul>` usadas para grids/listas de cards
- HTML semántico: `<main>`, `<header>`, `<section>`, `<nav>`, `<footer>`, `<address>`, `<time>`, `<aside>`
- `aria-hidden="true"` en elementos decorativos

## Patrones clave

### Nuevas páginas

1. Crear en `src/pages/NombrePagina.tsx`
2. Agregar lazy import en `src/app/routes.tsx`
3. Agregar ruta en el array del router
4. Usar `useScrollTop()` si debe iniciar desde arriba
5. Usar `useScrollToHash(hash)` si tiene scroll a sección

### Nuevos componentes

1. Definir tipos en `src/types/index.ts`
2. Constantes de datos en `src/lib/constants.ts`
3. Componente en `src/components/common/` o `src/components/ui/`
4. Exportar desde el archivo directamente (no index barrels)

### Interacción con Supabase

```ts
import { getSupabase } from '@/services/supabase'
const { data, error } = await getSupabase().from('tabla').insert(...)
```

## Stack y versiones relevantes

| Tecnología       | Versión  |
| ---------------- | -------- |
| React            | 19.2.0   |
| TypeScript       | ~5.9.3   |
| Vite             | ^7.2.4   |
| React Router DOM | ^7.11.0  |
| Tailwind CSS     | 3.4.17   |
| Supabase JS      | ^2.89.0  |
| Lucide React     | ^0.562.0 |

## Tests

Configuración: Vitest + React Testing Library.

```bash
yarn test         # Ejecutar tests
yarn test:ui      # UI de Vitest
yarn coverage     # Cobertura
```

Tests ubicados en `src/__tests__/` o junto al archivo con sufijo `.test.tsx`.
