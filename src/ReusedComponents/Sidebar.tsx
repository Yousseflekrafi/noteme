import { NavLink } from 'react-router-dom'
import {
  CircleUserRound,
  NotebookPen,
  CircleDot,
  CircleCheckBig,
  Trash2,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '../Protected/AuthContext'

const links = [
  { to: '/account', label: 'Account', icon: CircleUserRound },
  { to: '/tasks', label: 'Tasks', icon: NotebookPen, end: true },
  { to: '/tasks/open', label: 'Open Tasks', icon: CircleDot },
  { to: '/tasks/done', label: 'Done Tasks', icon: CircleCheckBig },
  { to: '/tasks/deleted', label: 'Deleted Tasks', icon: Trash2 },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()

  return (
    <>
      {/* Mobile scrim */}
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-indigo-950 text-white transition-transform duration-200 ease-out md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-semibold tracking-tight">Note</span>
            <span className="font-display text-2xl font-semibold tracking-tight text-coral-500">
              Me
            </span>
          </div>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-coral-500 font-display text-sm font-semibold">
              {(user?.name ?? user?.email ?? '?').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.name ?? 'Account'}
              </p>
              <p className="truncate text-xs text-white/50">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </aside>
    </>
  )
}