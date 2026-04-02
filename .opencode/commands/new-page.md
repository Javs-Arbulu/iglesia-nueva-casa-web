---
description: Crea una nueva página con SEO, lazy loading, hooks y estructura correcta
agent: build
---

Crea una nueva página con el nombre: $ARGUMENTS

Sigue EXACTAMENTE estos pasos:

### 1. Crear el archivo de página

Ubicación: `src/pages/$ARGUMENTS.tsx`

Estructura base:

- Importar `useScrollTop` de `@/hooks/useScroll` y llamarlo al inicio del componente
- Elemento raíz: `<main>` con `aria-label` descriptivo
- HTML semántico: usar `<header>`, `<section>`, `<aside>` según corresponda
- Todo el texto en **español**

### 2. Agregar a routes.tsx

En `src/app/routes.tsx`:

- Agregar `const $ARGUMENTS = lazy(() => import('@/pages/$ARGUMENTS'))`
- Agregar la ruta con `<Suspense fallback={<PageFallback />}>` al array del router

### 3. Agregar al Navbar si es necesario

Si la página debe aparecer en la navegación, agregar a `NAV_LINKS` en `src/lib/constants.ts`

### 4. Verificar

Ejecuta `yarn build` para confirmar que no hay errores de TypeScript ni Vite.
