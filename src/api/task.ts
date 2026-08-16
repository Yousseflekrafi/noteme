import { api } from './client'
import type { Task, TaskDraft } from '../types'

const base = (userId: string) => `/users/${userId}/tasks`

export const tasksApi = {
  list: (userId: string) => api.get<Task[]>(base(userId)),

  create: (userId: string, draft: TaskDraft) =>
    api.post<Task>(base(userId), {
      taskName: draft.taskName,
      subtasks: draft.subtasks,
      isDone: draft.isDone ?? false,
      isDeleted: false,
    }),

  update: (userId: string, taskId: string, changes: Partial<Task>) =>
    api.put<Task>(`${base(userId)}/${taskId}`, changes),

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