import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import type { Task, TaskDraft } from '../types'

interface TaskModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (draft: TaskDraft) => Promise<void> | void
  initialTask?: Task | null
}

export default function TaskModal({ open, onClose, onSubmit, initialTask }: TaskModalProps) {
  const [taskName, setTaskName] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setTaskName(initialTask?.taskName ?? '')
      setTaskDescription(initialTask?.taskDescription ?? '')
    }
  }, [open, initialTask])

  if (!open) return null

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!taskName.trim()) return
    setSubmitting(true)
    try {
      await onSubmit({ taskName: taskName.trim(), taskDescription: taskDescription.trim() })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-card sm:rounded-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            {initialTask ? 'Edit task' : 'New task'}
          </h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-md p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="taskName" className="mb-1.5 block text-sm font-medium text-ink">
              Task name
            </label>
            <input
              id="taskName"
              required
              autoFocus
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Write the project brief"
              className="w-full rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-indigo-600"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="taskDescription" className="mb-1.5 block text-sm font-medium text-ink">
              Description
            </label>
            <textarea
              id="taskDescription"
              rows={3}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Add any details worth remembering"
              className="w-full resize-none rounded-lg border border-ink/15 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-indigo-600"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink/70 hover:bg-ink/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !taskName.trim()}
              className="flex-1 rounded-lg bg-indigo-800 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving…' : initialTask ? 'Save changes' : 'Add task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}