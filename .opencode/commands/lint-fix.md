---
description: Ejecuta yarn lint y corrige todos los errores de ESLint automáticamente
agent: build
---

Ejecuta `yarn lint` en el proyecto.

Si hay errores de ESLint:

1. Lista todos los errores encontrados agrupados por archivo
2. Corrige automáticamente los que sean seguros de auto-corregir
3. Para errores que requieren decisión de diseño, describe el problema y propón opciones

Respeta las convenciones del proyecto definidas en AGENTS.md:

- No usar `<a href>` para navegación interna, usar `<Link>` de React Router
- No usar `console.log` en producción
- Todos los tipos centralizados en `src/types/index.ts`
