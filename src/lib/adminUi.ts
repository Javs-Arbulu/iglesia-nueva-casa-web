/**
 * Clases Tailwind compartidas del panel admin. Antes se duplicaban literalmente
 * en cada página (Eventos, Finanzas, Usuarios, Contenido…); aquí viven una vez.
 */

/** Campo de formulario (input / textarea / select). */
export const inputCls =
  'w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400'

/** Tarjeta contenedora (secciones de contenido). */
export const cardCls =
  'bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 p-5'

/** Contenedor de lista tipo tarjeta con divisores entre filas. */
export const listCardCls =
  'bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 divide-y divide-gray-100 dark:divide-slate-800 overflow-hidden'

/** Botón de acción primaria (cian). */
export const primaryBtn =
  'inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold text-sm px-4 py-2 rounded-full transition-colors disabled:opacity-60'

/** Botón primario a lo ancho (guardar dentro de un modal). */
export const primaryBtnBlock =
  'w-full inline-flex items-center justify-center gap-2 bg-cyan-400 hover:bg-cyan-500 text-black font-semibold py-2.5 rounded-full transition-colors disabled:opacity-60'
