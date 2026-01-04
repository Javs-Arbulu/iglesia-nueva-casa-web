import { Outlet } from 'react-router-dom'
import { Footer } from '@/components/common/Footer'
import Navbar from '@/components/common/Navbar'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}
