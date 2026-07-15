import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { NotebookPen, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../Protected/AuthContext'

export default function Login() {
  const { user, login, isLoading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (user) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/tasks'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/tasks', { replace: true })
    } catch {
      // error is already surfaced via useAuth().error
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-indigo-950 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-500">
            <NotebookPen size={22} className="text-white" strokeWidth={2.25} />
          </div>
          <h1 className="font-display text-3xl font-semibold text-white">
            Note<span className="text-coral-500">Me</span>
          </h1>
          <p className="mt-1 text-sm text-white/50">Sign in to get to your tasks</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-paper p-6 shadow-card sm:p-8"
          noValidate
        >
          <div className="mb-4">
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-indigo-600"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 pr-10 text-sm text-ink placeholder:text-ink/35 focus:border-indigo-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-ink/40 hover:text-ink/70"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <p role="alert" className="mb-4 rounded-lg bg-coral-500/10 px-3 py-2 text-sm text-coral-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-800 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}