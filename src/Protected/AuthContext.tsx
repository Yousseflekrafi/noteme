import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { login as loginRequest } from '../api/auth'
import type { SessionUser } from '../types'

const STORAGE_KEY = 'noteme.session'

interface AuthContextValue {
  user: SessionUser | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const sessionUser = await loginRequest(email, password)
      setUser(sessionUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => setUser(null)

  const value = useMemo(
    () => ({ user, isLoading, error, login, logout }),
    [user, isLoading, error]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}