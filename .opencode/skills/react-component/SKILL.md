---
name: react-component
description: Instrucciones y checklist para crear componentes React con Tailwind, a11y completa, tipos centralizados y convenciones del proyecto Iglesia Nueva Casa
---

## Qué hace este skill

Proporciona instrucciones precisas para crear componentes React que sigan todas las convenciones del proyecto.

## Checklist de componente

### Estructura del archivo

- [ ] Tipos/interfaces nuevos agregados a `src/types/index.ts`
- [ ] Constantes de datos en `src/lib/constants.ts`
- [ ] Componente en `src/components/common/` (o `src/components/ui/` si es primitiva)
- [ ] Solo Tailwind CSS (sin CSS modules, styled-components, ni `<style>` inline)
- [ ] Keyframes CSS en `src/main.css`

### Iconos y assets

- [ ] Iconos de `lucide-react` únicamente
- [ ] Imágenes responsivas con `<picture>` (no JS resize)
- [ ] `loading="lazy"` en imágenes no críticas

### Navegación

- [ ] `<Link>` de React Router para navegación interna — nunca `<a href="...">`
- [ ] Links externos con `target="_blank" rel="noopener noreferrer"`

### Accesibilidad (a11y)

- [ ] `aria-label` en todos los botones/íconos sin texto visible
- [ ] `aria-current="page"` en link activo de navegación
- [ ] `role="list"` en `<ul>` para grids/listas de cards
- [ ] `aria-hidden="true"` en elementos puramente decorativos
- [ ] HTML semántico: `<main>`, `<header>`, `<section>`, `<nav>`, `<footer>`, `<aside>`, `<address>`, `<time>`
- [ ] Formularios: `aria-required`, `aria-invalid`, `aria-describedby`, `htmlFor`/`id` en label+input
- [ ] Errores de formulario: `role="alert"`

### Performance

- [ ] `useCallback` en handlers que se pasan como props
- [ ] `useMemo` para cálculos costosos o listas derivadas
- [ ] Scroll listeners con `{ passive: true }`

## Patrón de componente base

```tsx
import type { ComponentNombre } from '@/types'
import { CONSTANT_DATA } from '@/lib/constants'
import { Link } from 'react-router-dom'

interface Props {
  // ...
}

const MiComponente = ({ prop }: Props) => {
  return (
    <section aria-label="Descripción de la sección">{/* contenido */}</section>
  )
}

export default MiComponente
```
