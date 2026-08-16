import { api } from './client'
import type { Subtask, Task, TaskDraft } from '../types'

const base = (userId: string) => `/users/${userId}/tasks`

// MockAPI's free tier only supports flat fields, so subtasks (with their
// nested attachments) are stored as a JSON string and decoded on the way in.
interface RawTask {
  id: string
  userId: string
  taskName: string
  subtasks?: string
  isDone: boolean
  isDeleted: boolean
  createdAt?: string
}

const parseSubtasks = (raw?: string): Subtask[] => {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const toTask = (raw: RawTask): Task => ({
  ...raw,
  subtasks: parseSubtasks(raw.subtasks),
})

type TaskChanges = Partial<Omit<Task, 'subtasks'>> & { subtasks?: Subtask[] }

const encodeChanges = (changes: TaskChanges) => {
  const { subtasks, ...rest } = changes
  return subtasks !== undefined ? { ...rest, subtasks: JSON.stringify(subtasks) } : rest
}

export const tasksApi = {
  list: async (userId: string) => {
    const data = await api.get<RawTask[]>(base(userId))
    return data.map(toTask)
  },

  create: async (userId: string, draft: TaskDraft) => {
    const created = await api.post<RawTask>(base(userId), {
      taskName: draft.taskName,
      subtasks: JSON.stringify(draft.subtasks),
      isDone: draft.isDone ?? false,
      isDeleted: false,
    })
    return toTask(created)
  },

  update: async (userId: string, taskId: string, changes: TaskChanges) => {
    const updated = await api.put<RawTask>(`${base(userId)}/${taskId}`, encodeChanges(changes))
    return toTask(updated)
  },

  setDone: (userId: string, taskId: string, isDone: boolean) =>
    tasksApi.update(userId, taskId, { isDone }),

  // Soft delete - flips isDeleted rather than removing the row
  softDelete: (userId: string, taskId: string) =>
    tasksApi.update(userId, taskId, { isDeleted: true }),

  restore: (userId: string, taskId: string) =>
    tasksApi.update(userId, taskId, { isDeleted: false }),

  // Permanently removes a task (used from the Deleted Tasks view)
  destroy: (userId: string, taskId: string) => api.delete<void>(`${base(userId)}/${taskId}`),
}
