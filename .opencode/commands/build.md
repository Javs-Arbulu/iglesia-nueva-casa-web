---
description: Ejecuta yarn build y analiza cualquier error de TypeScript o Vite
agent: build
---

Ejecuta `yarn build` en el proyecto.

Si hay errores de TypeScript: identifica cada archivo con error, explica la causa y propón la corrección mínima necesaria.

Si hay errores de Vite (imports faltantes, assets no encontrados, etc.): identifica el origen y propón la solución.

Si el build pasa sin errores, confirma con un resumen de los chunks generados.
