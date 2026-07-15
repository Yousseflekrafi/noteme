import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-4 text-center">
      <p className="font-display text-6xl font-semibold text-ink">404</p>
      <p className="text-sm text-ink/50">This page doesn't exist.</p>
      <Link
        to="/tasks"
        className="mt-2 rounded-lg bg-indigo-800 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Back to tasks
      </Link>
    </div>
  )
}