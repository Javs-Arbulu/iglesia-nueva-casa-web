import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import Home from '@/pages/Home'
import Nosotros from '@/pages/Nosotros'
import Eventos from '@/pages/Eventos'
import Contacto from '@/pages/Contacto'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/nosotros', element: <Nosotros /> },
      { path: '/eventos', element: <Eventos /> },
      { path: '/contacto', element: <Contacto /> },
    ],
  },
])
