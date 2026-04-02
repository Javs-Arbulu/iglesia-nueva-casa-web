---
description: Ejecuta lint + type-check + build en secuencia y reporta el estado
agent: build
---

Ejecuta en secuencia:

1. `yarn lint` — verifica reglas ESLint
2. `yarn build` — verifica tipos TypeScript y genera el build de producción

Si algún paso falla, detente y reporta el error con contexto suficiente para resolverlo.
Si todo pasa, confirma con un resumen del estado del proyecto: número de archivos, tamaño de chunks principales y cualquier warning relevante.
