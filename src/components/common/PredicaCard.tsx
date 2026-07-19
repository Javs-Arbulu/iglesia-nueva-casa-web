import { Play } from 'lucide-react'
import type { Predica } from '@/types'
import { formatPredicaDate } from '@/services/youtube'

interface PredicaCardProps {
  predica: Predica
}

/** Tarjeta de una prédica: miniatura de YouTube + título + fecha. */
export default function PredicaCard({ predica }: PredicaCardProps) {
  return (
    <a
      href={predica.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      aria-label={`Ver prédica en YouTube: ${predica.title}`}
    >
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-slate-800">
        <img
          src={predica.thumbnail}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div
          className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center"
          aria-hidden="true"
        >
          <div className="w-16 h-16 bg-cyan-400/90 rounded-full flex items-center justify-center scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 shadow-lg">
            <Play className="w-7 h-7 text-white fill-white ml-1" />
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-snug line-clamp-2 group-hover:text-cyan-600 transition-colors">
          {predica.title}
        </h3>
        {predica.published && (
          <time
            dateTime={predica.published}
            className="mt-2 block text-sm text-gray-500 dark:text-slate-400 first-letter:uppercase"
          >
            {formatPredicaDate(predica.published)}
          </time>
        )}
      </div>
    </a>
  )
}
