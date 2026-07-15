import { useEffect, useMemo, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { useAuth } from '../Protected/AuthContext'
import { tasksApi } from '../api/task'
import type { Task, TaskDraft } from '../types'
import TaskCard from '../Components/taskCard'
import TaskModal from '../Components/taskModal'

export type TaskView = 'all' | 'open' | 'done' | 'deleted'

const VIEW_COPY: Record<TaskView, { title: string; empty: string }> = {
  all: { title: 'Tasks', empty: 'No tasks yet. Add your first one to get started.' },
  open: { title: 'Open Tasks', empty: 'Nothing open right now. Nice work.' },
  done: { title: 'Done Tasks', empty: 'No completed tasks yet.' },
  deleted: { title: 'Deleted Tasks', empty: 'Nothing in the trash.' },
}

export default function Tasks({ view }: { view: TaskView }) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const loadTasks = async () => {
    if (!user) return
    setLoading(true)
    setLoadError(null)
    try {
      const data = await tasksApi.list(user.id)
      setTasks(data)
    } catch {
      setLoadError('Could not load tasks. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const visibleTasks = useMemo(() => {
    switch (view) {
      case 'open':
        return tasks.filter((t) => !t.isDeleted && !t.isDone)
      case 'done':
        return tasks.filter((t) => !t.isDeleted && t.isDone)
      case 'deleted':
        return tasks.filter((t) => t.isDeleted)
      case 'all':
      default:
        return tasks.filter((t) => !t.isDeleted)
    }
  }, [tasks, view])

  if (!user) return null

  const handleCreate = async (draft: TaskDraft) => {
    const created = await tasksApi.create(user.id, draft)
    setTasks((prev) => [created, ...prev])
  }

  const handleUpdate = async (draft: TaskDraft) => {
    if (!editingTask) return
    setBusyId(editingTask.id)
    try {
      const updated = await tasksApi.update(user.id, editingTask.id, draft)
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    } finally {
      setBusyId(null)
    }
  }

  const withBusy = async (task: Task, action: () => Promise<Task | void>) => {
    setBusyId(task.id)
    try {
      const result = await action()
      if (result) {
        setTasks((prev) => prev.map((t) => (t.id === task.id ? (result as Task) : t)))
      }
    } finally {
      setBusyId(null)
    }
  }

  const handleToggleDone = (task: Task) =>
    withBusy(task, () => tasksApi.setDone(user.id, task.id, !task.isDone))

  const handleSoftDelete = (task: Task) =>
    withBusy(task, () => tasksApi.softDelete(user.id, task.id))

  const handleRestore = (task: Task) => withBusy(task, () => tasksApi.restore(user.id, task.id))

  const handleDestroy = async (task: Task) => {
    setBusyId(task.id)
    try {
      await tasksApi.destroy(user.id, task.id)
      setTasks((prev) => prev.filter((t) => t.id !== task.id))
    } finally {
      setBusyId(null)
    }
  }

  const openEdit = (task: Task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const openCreate = () => {
    setEditingTask(null)
    setModalOpen(true)
  }

  const copy = VIEW_COPY[view]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{copy.title}</h1>
          <p className="mt-1 text-sm text-ink/50">
            {visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}
          </p>
        </div>
        {view === 'all' && (
          <button
            onClick={openCreate}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-indigo-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={17} />
            <span className="hidden sm:inline">New task</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-16 text-sm text-ink/40">
          <Loader2 size={16} className="animate-spin" />
          Loading tasks…
        </div>
      )}

      {!loading && loadError && (
        <div className="rounded-xl border border-coral-500/30 bg-coral-500/5 p-6 text-sm text-coral-600">
          {loadError}
        </div>
      )}

      {!loading && !loadError && visibleTasks.length === 0 && (
        <div className="rounded-xl border border-dashed border-ink/15 p-10 text-center text-sm text-ink/45">
          {copy.empty}
        </div>
      )}

      {!loading && !loadError && visibleTasks.length > 0 && (
        <div className="space-y-3">
          {visibleTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              busy={busyId === task.id}
              onToggleDone={view !== 'deleted' ? handleToggleDone : undefined}
              onEdit={view !== 'deleted' ? openEdit : undefined}
              onDelete={view !== 'deleted' ? handleSoftDelete : undefined}
              onRestore={view === 'deleted' ? handleRestore : undefined}
              onDestroy={view === 'deleted' ? handleDestroy : undefined}
            />
          ))}
        </div>
      )}

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={editingTask ? handleUpdate : handleCreate}
        initialTask={editingTask}
      />
    </div>
  )
}