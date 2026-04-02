# Codebase — Iglesia Nueva Casa Web

Documentación completa del proyecto web de **Iglesia Nueva Casa**, generada después de la refactorización y aplicación de mejores prácticas.

---

## Índice

1. [Resumen del proyecto](#1-resumen-del-proyecto)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura de archivos](#3-estructura-de-archivos)
4. [Configuración](#4-configuración)
5. [Entrypoints](#5-entrypoints)
6. [Routing](#6-routing)
7. [Layout](#7-layout)
8. [Páginas](#8-páginas)
9. [Componentes comunes](#9-componentes-comunes)
10. [Componentes UI (shadcn)](#10-componentes-ui-shadcn)
11. [Hooks personalizados](#11-hooks-personalizados)
12. [Librerías y utilidades](#12-librerías-y-utilidades)
13. [Tipos TypeScript](#13-tipos-typescript)
14. [Servicios](#14-servicios)
15. [Assets](#15-assets)
16. [Estilos globales](#16-estilos-globales)
17. [Mejores prácticas aplicadas](#17-mejores-prácticas-aplicadas)

---

## 1. Resumen del proyecto

Sitio web de **Iglesia Nueva Casa**, una iglesia cristiana joven con sede en San Martín de Porres, Lima, Perú. La web es una SPA (Single Page Application) responsive orientada a presentar la identidad de la iglesia, sus ministerios y facilitar el contacto.

**URL de producción:** _(por definir)_

---

## 2. Stack tecnológico

| Categoría        | Tecnología                             | Versión  |
| ---------------- | -------------------------------------- | -------- |
| Framework        | React                                  | 19.2.0   |
| Lenguaje         | TypeScript                             | ~5.9.3   |
| Build tool       | Vite                                   | ^7.2.4   |
| Routing          | React Router DOM                       | ^7.11.0  |
| Estilos          | Tailwind CSS                           | 3.4.17   |
| Componentes base | shadcn/ui (new-york)                   | —        |
| Primitivos       | Radix UI (react-slot)                  | ^1.2.4   |
| Carousel         | Embla Carousel + Autoplay              | ^8.6.0   |
| Iconos           | Lucide React                           | ^0.562.0 |
| Backend / DB     | Supabase JS                            | ^2.89.0  |
| Utilidades CSS   | clsx + tailwind-merge + CVA            | —        |
| Animaciones      | tailwindcss-animate                    | ^1.0.7   |
| Linting          | ESLint flat config + typescript-eslint | ^9.39.2  |
| Formateo         | Prettier                               | ^3.7.4   |
| Package manager  | Yarn (node-modules linker)             | —        |

---

## 3. Estructura de archivos

```
iglesia-nueva-casa-web/
├── index.html                        # HTML raíz
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── postcss.config.js
├── components.json                   # shadcn/ui config
├── eslint.config.js                  # ESLint flat config (único)
├── .prettierrc
├── .env.example                      # Plantilla de variables de entorno
└── src/
    ├── main.tsx                      # Bootstrap de la aplicación
    ├── main.css                      # Tailwind + CSS vars + keyframes globales
    ├── app/
    │   └── routes.tsx                # Definición de rutas (lazy loading)
    ├── assets/
    │   └── images/
    │       ├── logo.png
    │       ├── logo-claro-navbar.png
    │       ├── Hero.png
    │       ├── Carrusel1.jpg
    │       ├── Carrusel2.jpg
    │       ├── Carrusel3.jpg
    │       ├── volunteering.png
    │       └── volunteering-mobile.png
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.tsx
    │   │   ├── Footer.tsx
    │   │   └── Landing/
    │   │       ├── Hero.tsx
    │   │       ├── AdnIntro.tsx
    │   │       ├── Volunteering.tsx
    │   │       └── OurPurpose.tsx
    │   └── ui/
    │       ├── button.tsx            # shadcn Button (CVA)
    │       └── carousel.tsx          # shadcn Carousel (Embla)
    ├── hooks/
    │   └── useScroll.ts              # useScrollTop + useScrollToHash
    ├── layouts/
    │   └── PublicLayout.tsx          # Layout raíz: Navbar + Outlet + Footer
    ├── lib/
    │   ├── utils.ts                  # cn() helper
    │   └── constants.ts              # NAV_LINKS, CHURCH_INFO, SOCIAL_HREFS, etc.
    ├── pages/
    │   ├── Home.tsx                  # /
    │   ├── Nosotros.tsx              # /nosotros
    │   ├── ADN.tsx                   # Sección ADN (embebida en Nosotros)
    │   ├── Ministerios.tsx           # /ministerios
    │   └── Contacto.tsx              # /contacto
    ├── services/
    │   └── supabase.ts               # Cliente Supabase con validación
    └── types/
        └── index.ts                  # Tipos TypeScript centralizados
```

---

## 4. Configuración

### `vite.config.ts`

- Plugin: `@vitejs/plugin-react`
- Dev server: `host: true`, port `5173`, `strictPort: true`
- Alias de path: `@` → `src/`

### `tailwind.config.js`

- `darkMode: ["class"]` (class-based)
- Scans: `./index.html`, `./src/**/*.{ts,tsx}`
- Sistema de tokens CSS variables completo (shadcn/ui)
- Plugin: `tailwindcss-animate`

### `tsconfig.app.json`

- `target: ES2022`, `jsx: react-jsx`, `strict: true`
- `moduleResolution: bundler`
- Path alias `@/*` → `src/*`

### `components.json` (shadcn/ui)

- `style: "new-york"`, `rsc: false`, `tsx: true`
- `iconLibrary: "lucide"`

### `.env.example`

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 5. Entrypoints

### `index.html`

Punto de entrada HTML. Define charset, viewport, título ("Nueva Casa"), favicon (`logo.png`) y el div `#root`.

### `src/main.tsx`

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
```

Bootstraps la app con `RouterProvider` y `React.StrictMode`.

---

## 6. Routing

**`src/app/routes.tsx`**

Define el router con `createBrowserRouter`. Todas las páginas se cargan con **lazy loading** (`React.lazy` + `Suspense`) para reducir el bundle inicial. El fallback durante la carga es un spinner centrado.

```
/           → Home          (lazy)
/nosotros   → Nosotros      (lazy)
/ministerios → Ministerios  (lazy)
/contacto   → Contacto      (lazy)
```

Todas las rutas están envueltas en `PublicLayout` (Navbar + Footer).

---

## 7. Layout

### `src/layouts/PublicLayout.tsx`

Layout único para todas las rutas públicas. Estructura:

```
<div min-h-screen flex flex-col>
  <Navbar />
  <main flex-1>
    <Outlet />   ← aquí se renderizan las páginas
  </main>
  <Footer />
</div>
```

---

## 8. Páginas

### `src/pages/Home.tsx`

Página de inicio (`/`). Compone las cuatro secciones de landing en orden:

1. `<HeroSection />`
2. `<ADNIntro />`
3. `<Volunteering />`
4. `<OurPurpose />`

---

### `src/pages/Nosotros.tsx`

Página Sobre Nosotros (`/nosotros`). Usa el hook `useScrollToHash()` para navegar automáticamente al ancla `#adn` cuando la URL lo incluye.

**Secciones:**

1. **Hero** — Gradiente azul/índigo con foto de comunidad y botón "Ver Horarios" → `/contacto#info`
2. **ADN** — Renderiza `<ADNSection />` (el diagrama orbital de valores)
3. **Visión** — Grid de 3 tarjetas: Comunidad Auténtica, Fe en Acción, Liderazgo Joven
4. **CTA** — Tarjeta oscura con botón "Contáctanos" → `/contacto`

---

### `src/pages/ADN.tsx`

Sección interactiva que muestra los **7 valores del ADN** de la iglesia en un diagrama orbital animado.

**Funcionamiento:**

- Los valores orbitan un ícono central en una elipse (`rx=250, ry=160`) rotando continuamente via `setInterval` (Δ0.3°, cada 30ms)
- Al hacer clic en un valor, la rotación se detiene y se muestra una tarjeta de detalle animada con `fadeInZoom` (keyframe en `main.css`)
- Botón "×" cierra la tarjeta y reanuda la rotación

**Valores:** Pasión por servir · Generosidad · Alegría de Vivir · Autenticidad · Humildad · Gracia Audaz · Relevancia

---

### `src/pages/Ministerios.tsx`

Página de Ministerios (`/ministerios`). Usa `useScrollTop()` para siempre iniciar en el tope.

**Secciones:**

- **Header** con tabs de filtro (`Todos | Generaciones | Comunidad | Servicio`)
- **Grid de tarjetas** de ministerios (5 ministerios + 1 CTA card) — filtrados por tab activo
- **CTA final** con botones hacia `/contacto`

**Ministerios:**
| Título | Categoría | Horario |
|---|---|---|
| Jóvenes | GENERACIONES | Sábados 6:00 PM |
| Niños | GENERACIONES | Domingos 10:00 AM |
| Alabanza | SERVICIO | Jueves 7:00 PM |
| Grupos Pequeños | COMUNIDAD | Diferentes horarios |
| Servicio Social | SERVICIO | Sábados 9:00 AM |

---

### `src/pages/Contacto.tsx`

Página de Contacto (`/contacto`). Usa `useScrollToHash()` para navegar al ancla `#info` (panel de información).

**Secciones:**

1. **Hero** — Gradiente azul con wave SVG de transición
2. **Formulario + Info** — Grid 3/5 + 2/5:
   - **Izquierda:** Formulario con validación cliente-side (nombre, email, asunto, mensaje). Muestra errores por campo con `aria-describedby`. Botón submit activa `onSubmit` del `<form>`.
   - **Derecha** (`id="info"`): Tarjeta de Ubicación + Tarjeta de Horarios (datos desde `CHURCH_INFO`)

---

## 9. Componentes comunes

### `src/components/common/Navbar.tsx`

Barra de navegación fija con comportamiento adaptativo:

- En `/`: transparente si no hay scroll; se vuelve `bg-black/95` al scrollear >200px o al abrir el menú móvil
- En otras páginas: siempre `bg-black/95`
- Usa `{ passive: true }` en el scroll listener
- Cierra el menú móvil automáticamente al cambiar de ruta (`useEffect([location.pathname])`)
- Links del desktop usan `<Link>` de React Router con `aria-current="page"`
- Menú móvil con `aria-expanded`, `aria-controls`, `aria-hidden`
- Links extraídos de `NAV_LINKS` (constante centralizada)

---

### `src/components/common/Footer.tsx`

Footer en 3 columnas:

- **Col 1:** Logo, dirección (`<address>`), horarios — datos de `CHURCH_INFO`
- **Col 2:** Links de navegación (`<Link>` para internos, `<a target="_blank">` para externos) + Social icons con `aria-label`
- **Col 3:** Iframe de Google Maps con `title` accesible

Copyright dinámico: `new Date().getFullYear()`.

---

### `src/components/common/Landing/Hero.tsx`

Hero de pantalla completa para `/`:

- Imagen de fondo local (`Hero.png`) + gradientes superpuestos
- **30 estrellas** con posición y timing aleatorio (generadas una vez al cargar el módulo). Las animaciones CSS (`twinkle`, `float`) están definidas en `main.css`
- Botones CTA: "Ver Nuestra Ubicación" (→ Google Maps) y "Ver Servicios en Vivo" (→ YouTube Live)
- SVG wave en la parte inferior

---

### `src/components/common/Landing/AdnIntro.tsx`

Sección "Descubre Quiénes Somos":

- **Izquierda:** Carousel de 3 fotos (Embla, auto 4.5s, loop). Superpuesto: carousel de tarjetas de valores (desktop: `basis-1/2` auto 3.5s; mobile: full width auto 3s)
- **Derecha:** Tagline, título con gradiente, descripción, CTA "Ver Nuestro ADN" → `/nosotros#adn`
- `<picture>` no aplica aquí (imágenes locales), primer slide con `loading="eager"`, resto `loading="lazy"`

---

### `src/components/common/Landing/Volunteering.tsx`

Banner "Servolución" de fondo fijo:

- Imagen de fondo responsive via `<picture>` HTML — sin JavaScript resize listener
  - `<source media="(min-width: 768px)">` → `volunteering.png`
  - `<img>` fallback → `volunteering-mobile.png`
- Overlay degradado oscuro
- Título "Servolución" con gradiente rojo/naranja
- CTA "Únete al Equipo" → `/ministerios`

---

### `src/components/common/Landing/OurPurpose.tsx`

Sección "Nuestro Propósito" en fondo blanco:

- Grid 1/2/4 columnas (responsive)
- 4 tarjetas de propósito renderizadas desde array tipado `PurposeCard[]`
- Efectos hover: translate-y, shadow, gradient border, icon scale+rotate, accent bar inferior
- Marcado semántico: `<ul role="list">` + `<li>` para las tarjetas

---

## 10. Componentes UI (shadcn)

### `src/components/ui/button.tsx`

Componente Button estándar de shadcn/ui. Usa CVA (class-variance-authority):

- **Variants:** `default | destructive | outline | secondary | ghost | link`
- **Sizes:** `default | sm | lg | icon`
- Soporta `asChild` prop (Radix Slot) para renderizar como otro elemento (e.g. `<Link>`)

### `src/components/ui/carousel.tsx`

Wrapper sobre Embla Carousel:

- **Exports:** `Carousel`, `CarouselContent`, `CarouselItem`, `CarouselPrevious`, `CarouselNext`, `CarouselApi`
- Soporta orientación `horizontal | vertical`
- Navegación por teclado (ArrowLeft/ArrowRight)
- Context interno para compartir estado entre sub-componentes

---

## 11. Hooks personalizados

### `src/hooks/useScroll.ts`

#### `useScrollTop()`

Hace scroll al tope de la página en cada cambio de `pathname`.

```ts
export function useScrollTop(): void
```

Usado en: `Ministerios`

#### `useScrollToHash(hash?: string)`

Hace scroll suave al elemento con el ID correspondiente al hash de la URL.

- Acepta hash explícito o toma `location.hash` por defecto
- Usa un `setTimeout` de 100ms para asegurar que el DOM esté asentado

```ts
export function useScrollToHash(hash?: string): void
```

Usado en: `Nosotros`, `Contacto`

---

## 12. Librerías y utilidades

### `src/lib/utils.ts`

```ts
export function cn(...inputs: ClassValue[]): string
```

Combina `clsx` (clases condicionales) con `tailwind-merge` (deduplicación de clases Tailwind conflictivas).

### `src/lib/constants.ts`

Fuente única de verdad para datos estáticos reutilizados en múltiples componentes:

| Constante         | Tipo              | Descripción                                           |
| ----------------- | ----------------- | ----------------------------------------------------- |
| `NAV_LINKS`       | `NavLink[]`       | Links de navegación principal (Navbar)                |
| `EXPLORE_LINKS`   | `NavLink[]`       | Links del Footer (incluye YouTube externo)            |
| `SOCIAL_HREFS`    | `const object`    | URLs de redes sociales (Instagram, YouTube, Facebook) |
| `CHURCH_INFO`     | `const object`    | Dirección, URL de Maps, embed de Maps, horarios       |
| `MINISTERIO_TABS` | `MinisterioTab[]` | Tabs de filtro en página Ministerios                  |

---

## 13. Tipos TypeScript

**`src/types/index.ts`** — Tipos centralizados por dominio:

### Navegación

- `NavLink` — `{ name, href, external? }`
- `SocialLink` — `{ label, href, icon: ReactNode }`

### Landing

- `Star` — Datos de una estrella animada del Hero
- `CarouselImage` — `{ src, alt }`
- `ValueCard` — Tarjeta de valor en AdnIntro
- `PurposeCard` — Tarjeta de propósito en OurPurpose

### ADN

- `ADNValor` — `{ id, title, icon, color, angle, description }`

### Nosotros

- `VisionItem` — Tarjeta de visión en Nosotros

### Ministerios

- `MinisterioCategory` — `'GENERACIONES' | 'COMUNIDAD' | 'SERVICIO'`
- `Ministerio` — Datos de un ministerio
- `MinisterioTab` — `'Todos' | 'Generaciones' | 'Comunidad' | 'Servicio'`

### Contacto

- `ContactFormData` — Campos del formulario
- `ContactFormErrors` — Errores de validación por campo

---

## 14. Servicios

### `src/services/supabase.ts`

Inicialización del cliente Supabase con validación robusta:

```
VITE_SUPABASE_URL  →  validateEnvVariable → validateUrl
VITE_SUPABASE_ANON_KEY → validateEnvVariable
→ createClient(url, key) → supabase (singleton export)
```

- `SupabaseConfigError` — clase de error personalizada
- Mensajes de error en español
- El cliente está preparado pero **no se usa** actualmente en ninguna página (integración pendiente)

> **Nota:** Si las variables de entorno no están definidas, la app lanzará un error al iniciar. Asegúrate de configurar `.env` a partir de `.env.example`.

---

## 15. Assets

Todos los assets locales en `src/assets/images/`:

| Archivo                   | Uso                  | Notas                             |
| ------------------------- | -------------------- | --------------------------------- |
| `logo.png`                | `index.html` favicon | Logo principal                    |
| `logo-claro-navbar.png`   | `Navbar.tsx`         | Versión clara para navbar oscuro  |
| `Hero.png`                | `Hero.tsx`           | Imagen de fondo del hero (968 KB) |
| `Carrusel1.jpg`           | `AdnIntro.tsx`       | Enseñanza (109 KB)                |
| `Carrusel2.jpg`           | `AdnIntro.tsx`       | Bautizo (132 KB)                  |
| `Carrusel3.jpg`           | `AdnIntro.tsx`       | Equipo (615 KB)                   |
| `volunteering.png`        | `Volunteering.tsx`   | Desktop bg (6.8 MB — optimizar)   |
| `volunteering-mobile.png` | `Volunteering.tsx`   | Mobile bg (1.2 MB)                |

**Imágenes externas (Unsplash CDN):** usadas en `Nosotros.tsx`, `Ministerios.tsx`, `Contacto.tsx`.

> **Recomendación:** Las imágenes `volunteering.png` (6.8 MB) y `Carrusel3.jpg` (615 KB) deberían ser optimizadas/convertidas a WebP para mejorar el rendimiento.

---

## 16. Estilos globales

### `src/main.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Tokens CSS shadcn/ui — :root y .dark */
@layer base { :root { ... } .dark { ... } }

/* Keyframes globales */
@keyframes twinkle { ... }      /* Efecto parpadeo estrellas Hero */
@keyframes float { ... }        /* Efecto flotado estrellas Hero */
.star-animated { animation: twinkle + float }

@keyframes fadeInZoom { ... }   /* Entrada tarjeta detalle ADN */
```

---

## 17. Mejores prácticas aplicadas

### Performance

- **Code splitting** — Todas las páginas cargadas con `React.lazy` + `Suspense`
- **Passive scroll listener** — `{ passive: true }` en el event listener del Navbar
- **Lazy loading de imágenes** — `loading="lazy"` en imágenes no críticas; primer slide del carousel con `loading="eager"`
- **Responsive images sin JS** — `<picture>` en `Volunteering` reemplaza el resize listener de JS
- **Stars generadas una sola vez** — Array de estrellas del Hero generado a nivel de módulo (no en render)

### Mantenibilidad

- **Constantes centralizadas** — `src/lib/constants.ts` como fuente única de verdad para URLs, links, datos de la iglesia
- **Tipos centralizados** — `src/types/index.ts` con todos los tipos del dominio
- **Hooks reutilizables** — `useScrollTop` y `useScrollToHash` extraídos de las páginas
- **Un solo ESLint config** — Eliminado `.eslintrc.cjs` redundante; solo `eslint.config.js` (flat config)
- **Extensión correcta** — `supabase.ts` (no `.tsx` — no contiene JSX)

### Accesibilidad (a11y)

- `aria-label` en todos los `<section>`, `<nav>`, `<form>`, `<dialog>`, `<button>` donde es necesario
- `aria-current="page"` en links de navegación activos
- `aria-expanded` + `aria-controls` en el botón del menú hamburguesa
- `aria-invalid` + `aria-describedby` en campos de formulario con errores
- `aria-required` en campos obligatorios
- `role="alert"` + `aria-live="polite"` en mensajes de error y confirmación
- `aria-hidden="true"` en iconos decorativos y elementos puramente visuales
- `<address>` para información de ubicación
- `<time>` para horarios
- `<ul role="list">` + `<li>` en grids de tarjetas
- `<header>` semántico dentro de secciones
- `alt` descriptivos en imágenes de contenido; `alt=""` en imágenes decorativas

### Navegación SPA

- `<Link>` de React Router en lugar de `<a href>` para todas las rutas internas (evita full-page reloads y preserva el estado del router)
- `<a target="_blank" rel="noopener noreferrer">` para links externos

### Formulario de Contacto

- Validación cliente-side con feedback visual por campo antes de enviar
- `noValidate` en el `<form>` para deshabilitar la validación nativa del navegador (usamos la propia)
- Submit via `onSubmit` del `<form>` en lugar de `onClick` en el botón
- Estado `submitted` para mostrar confirmación sin recargar
- `useCallback` en `handleChange` y `handleSubmit` para evitar re-creación en cada render
