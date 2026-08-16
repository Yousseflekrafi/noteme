import { useEffect, useState, type FormEvent } from 'react'
import { Image, Link2, Plus, Trash2, X } from 'lucide-react'
import type { Attachment, Subtask, Task, TaskDraft } from '../types'

interface TaskModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (draft: TaskDraft) => Promise<void> | void
  initialTask?: Task | null
}

const emptySubtask = (): Subtask => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  attachments: [],
})

export default function TaskModal({ open, onClose, onSubmit, initialTask }: TaskModalProps) {
  const [taskName, setTaskName] = useState('')
  const [subtasks, setSubtasks] = useState<Subtask[]>([emptySubtask()])
  const [attachmentDraft, setAttachmentDraft] = useState<{ subtaskId: string; type: Attachment['type'] } | null>(
    null,
  )
  const [attachmentUrl, setAttachmentUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setTaskName(initialTask?.taskName ?? '')
      setSubtasks(
        initialTask?.subtasks && initialTask.subtasks.length > 0 ? initialTask.subtasks : [emptySubtask()],
      )
      setAttachmentDraft(null)
      setAttachmentUrl('')
    }
  }, [open, initialTask])

  if (!open) return null

  const updateSubtask = (id: string, changes: Partial<Subtask>) => {
    setSubtasks((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)))
  }

  const addSubtask = () => setSubtasks((prev) => [...prev, emptySubtask()])

  const removeSubtask = (id: string) => {
    setSubtasks((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev))
    if (attachmentDraft?.subtaskId === id) {
      setAttachmentDraft(null)
      setAttachmentUrl('')
    }
  }

  const openAttachmentDraft = (subtaskId: string, type: Attachment['type']) => {
    setAttachmentDraft({ subtaskId, type })
    setAttachmentUrl('')
  }

  const confirmAttachment = () => {
    if (!attachmentDraft || !attachmentUrl.trim()) return
    const { subtaskId, type } = attachmentDraft
    const subtask = subtasks.find((s) => s.id === subtaskId)
    if (!subtask) return
    updateSubtask(subtaskId, {
      attachments: [...subtask.attachments, { id: crypto.randomUUID(), type, url: attachmentUrl.trim() }],
    })
    setAttachmentDraft(null)
    setAttachmentUrl('')
  }

  const removeAttachment = (subtaskId: string, attachmentId: string) => {
    const subtask = subtasks.find((s) => s.id === subtaskId)
    if (!subtask) return
    updateSubtask(subtaskId, { attachments: subtask.attachments.filter((a) => a.id !== attachmentId) })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!taskName.trim()) return
    setSubmitting(true)
    try {
      const cleanedSubtasks = subtasks
        .map((s) => ({ ...s, name: s.name.trim(), description: s.description.trim() }))
        .filter((s) => s.name || s.description || s.attachments.length > 0)
      await onSubmit({ taskName: taskName.trim(), subtasks: cleanedSubtasks })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-6 shadow-card sm:rounded-2xl">
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
          <div className="mb-5">
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

          <div className="mb-6 space-y-4">
            <span className="block text-sm font-medium text-ink">Subtasks</span>

            {subtasks.map((subtask, index) => (
              <div key={subtask.id} className="rounded-lg border border-ink/15 p-3.5">
                <div className="mb-2.5 flex items-center justify-between gap-2">
                  <input
                    value={subtask.name}
                    onChange={(e) => updateSubtask(subtask.id, { name: e.target.value })}
                    placeholder={`Subtask ${index + 1} name`}
                    className="w-full rounded-md border border-ink/15 px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-indigo-600"
                  />
                  {subtasks.length > 1 && (
                    <button
                      type="button"
                      aria-label="Remove subtask"
                      onClick={() => removeSubtask(subtask.id)}
                      className="shrink-0 rounded-md p-2 text-ink/40 hover:bg-coral-500/10 hover:text-coral-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <textarea
                  rows={2}
                  value={subtask.description}
                  onChange={(e) => updateSubtask(subtask.id, { description: e.target.value })}
                  placeholder="Add any details worth remembering"
                  className="mb-2.5 w-full resize-none rounded-md border border-ink/15 px-3 py-2 text-sm text-ink placeholder:text-ink/35 focus:border-indigo-600"
                />

                {subtask.attachments.length > 0 && (
                  <ul className="mb-2.5 space-y-1.5">
                    {subtask.attachments.map((attachment) => (
                      <li
                        key={attachment.id}
                        className="flex items-center gap-2 rounded-md bg-ink/5 px-2.5 py-1.5 text-xs text-ink/70"
                      >
                        {attachment.type === 'link' ? <Link2 size={13} /> : <Image size={13} />}
                        <span className="min-w-0 flex-1 truncate">{attachment.url}</span>
                        <button
                          type="button"
                          aria-label="Remove attachment"
                          onClick={() => removeAttachment(subtask.id, attachment.id)}
                          className="shrink-0 text-ink/40 hover:text-coral-600"
                        >
                          <X size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {attachmentDraft?.subtaskId === subtask.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          confirmAttachment()
                        }
                      }}
                      placeholder={attachmentDraft.type === 'link' ? 'Paste a link' : 'Paste an image URL'}
                      className="w-full rounded-md border border-ink/15 px-3 py-1.5 text-xs text-ink placeholder:text-ink/35 focus:border-indigo-600"
                    />
                    <button
                      type="button"
                      onClick={confirmAttachment}
                      className="shrink-0 rounded-md bg-indigo-800 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      aria-label="Cancel attachment"
                      onClick={() => {
                        setAttachmentDraft(null)
                        setAttachmentUrl('')
                      }}
                      className="shrink-0 text-ink/40 hover:text-ink"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => openAttachmentDraft(subtask.id, 'link')}
                      className="flex items-center gap-1 text-xs font-medium text-indigo-700 hover:text-indigo-800"
                    >
                      <Plus size={13} /> Add link
                    </button>
                    <button
                      type="button"
                      onClick={() => openAttachmentDraft(subtask.id, 'image')}
                      className="flex items-center gap-1 text-xs font-medium text-indigo-700 hover:text-indigo-800"
                    >
                      <Plus size={13} /> Add image
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addSubtask}
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-700 hover:text-indigo-800"
            >
              <Plus size={15} /> Add subtask
            </button>
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
