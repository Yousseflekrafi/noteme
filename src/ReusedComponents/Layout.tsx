import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-ink/10 bg-paper/80 px-4 py-3 backdrop-blur md:hidden">
          <button
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-ink/70 hover:bg-ink/5"
          >
            <Menu size={20} />
          </button>
          <span className="font-display text-lg font-semibold">
            Note<span className="text-coral-500">Me</span>
          </span>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}