import { Outlet } from 'react-router-dom'

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header>Header</header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer>Footer</footer>
    </div>
  )
}
