import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('❌ ErrorBoundary atrapó un error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
          <div className="text-center max-w-md">
            <p className="text-6xl mb-4" aria-hidden="true">
              ⚠️
            </p>
            <h1 className="text-2xl font-bold text-white mb-3">
              Algo salió mal
            </h1>
            <p className="text-gray-400 mb-2 leading-relaxed">
              Ocurrió un error inesperado. Puedes intentar recargar la página o
              volver al inicio.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="text-left text-xs text-red-400 bg-gray-900 rounded p-3 mb-6 overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />
                Intentar de nuevo
              </Button>
              <Button variant="outline" asChild>
                <Link to="/" onClick={this.handleReset}>
                  <Home className="w-4 h-4 mr-2" aria-hidden="true" />
                  Ir al inicio
                </Link>
              </Button>
            </div>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
