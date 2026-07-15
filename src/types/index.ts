export interface User {
  id: string
  email: string
  password: string
  name?: string
  avatar?: string
  createdAt?: string
}

// User object as stored in the session (never keep the password around)
export type SessionUser = Omit<User, 'password'>

export interface Task {
  id: string
  userId: string
  taskName: string
  taskDescription: string
  isDone: boolean
  isDeleted: boolean
  createdAt?: string
}

export type TaskDraft = Pick<Task, 'taskName' | 'taskDescription'> & {
  isDone?: boolean
}