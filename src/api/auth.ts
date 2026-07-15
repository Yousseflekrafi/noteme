import { api } from './client'
import type { SessionUser, User } from '../types'

/**
 * MockAPI has no real authentication endpoint, so "login" works by
 * fetching the users collection and matching email + password client-side.
 * This is only ever appropriate for a mock/demo backend like this one -
 * a real backend should verify credentials server-side and return a token.
 */
export async function login(email: string, password: string): Promise<SessionUser> {
  const users = await api.get<User[]>('/users')

  const match = users.find(
    (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.password === password
  )

  if (!match) {
    throw new Error('Invalid email or password')
  }

  const { password: _password, ...sessionUser } = match
  return sessionUser
}