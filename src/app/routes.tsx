import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import Home from '@/pages/Home'
import Nosotros from '@/pages/Nosotros'
import Ministerios from '@/pages/Ministerios'
import Contacto from '@/pages/Contacto'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/nosotros', element: <Nosotros /> },
      { path: '/ministerios', element: <Ministerios /> },
      { path: '/contacto', element: <Contacto /> },
      // { path: '/nosotros/adn', element: < /> }
    ],
  },
])
