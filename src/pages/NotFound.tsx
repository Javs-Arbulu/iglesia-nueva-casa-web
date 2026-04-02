import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="text-center max-w-md">
        {/* Error code */}
        <p className="text-8xl font-extrabold text-cyan-400 mb-4 select-none">
          404
        </p>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-white mb-3">
          Página no encontrada
        </h1>

        {/* Description */}
        <p className="text-gray-400 mb-8 leading-relaxed">
          La página que estás buscando no existe o fue movida. Puedes volver al
          inicio o explorar nuestras secciones.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" aria-hidden="true" />
              Ir al inicio
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/contacto">
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Contáctanos
            </Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

export default NotFound
