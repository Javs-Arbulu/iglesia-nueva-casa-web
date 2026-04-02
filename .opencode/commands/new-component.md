---
description: Crea un nuevo componente React siguiendo las convenciones del proyecto
agent: build
---

Crea un nuevo componente React con el nombre: $ARGUMENTS

Sigue EXACTAMENTE estas convenciones del proyecto:

1. **Ubicación**: `src/components/common/$ARGUMENTS.tsx` (o `src/components/ui/` si es una primitiva reutilizable)
2. **Tipos**: Si el componente necesita tipos/interfaces nuevos, agrégalos a `src/types/index.ts`
3. **Constantes**: Si el componente necesita datos estáticos (arrays, objetos), agrégalos a `src/lib/constants.ts`
4. **Estilos**: Solo Tailwind CSS — sin CSS modules, sin styled-components, sin `<style>` inline
5. **Iconos**: Solo `lucide-react`
6. **Accesibilidad**:
   - `aria-label` en botones/íconos sin texto visible
   - `role="list"` en `<ul>` para grids/listas
   - `aria-hidden="true"` en elementos decorativos
   - HTML semántico: `<section>`, `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`
7. **Imágenes**: Usar `<picture>` para imágenes responsivas, `loading="lazy"` en imágenes no críticas
8. **Navegación interna**: `<Link>` de React Router — NUNCA `<a href="...">`

Después de crear el componente, ejecuta `yarn build` para verificar que no hay errores.
