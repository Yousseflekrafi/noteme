import { CheckCircle2, Circle, Image, Link2, Pencil, RotateCcw, Trash2, XCircle } from 'lucide-react'
import type { Task } from '../types'

interface TaskCardProps {
  task: Task
  onToggleDone?: (task: Task) => void
  onToggleSubtask?: (task: Task, subtaskId: string) => void
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
  onRestore?: (task: Task) => void
  onDestroy?: (task: Task) => void
  busy?: boolean
}

export default function TaskCard({
  task,
  onToggleDone,
  onToggleSubtask,
  onEdit,
  onDelete,
  onRestore,
  onDestroy,
  busy,
}: TaskCardProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-ink/10 bg-white p-4 shadow-card transition-opacity ${
        busy ? 'opacity-50' : ''
      }`}
    >
      {onToggleDone && (
        <button
          aria-label={task.isDone ? 'Mark as open' : 'Mark as done'}
          onClick={() => onToggleDone(task)}
          disabled={busy}
          className="mt-0.5 shrink-0 text-moss-500 hover:text-moss-600 disabled:cursor-not-allowed"
        >
          {task.isDone ? <CheckCircle2 size={22} /> : <Circle size={22} className="text-ink/25" />}
        </button>
      )}

      <div className="min-w-0 flex-1">
        <h3
          className={`break-words font-display text-base font-semibold text-ink ${
            task.isDone ? 'text-ink/40 line-through' : ''
          }`}
        >
          {task.taskName}
        </h3>
        {task.subtasks && task.subtasks.length > 0 && (
          <ul className="mt-1.5 space-y-1">
            {task.subtasks.map((subtask) => (
              <li
                key={subtask.id}
                className={`text-sm text-ink/60 ${task.isDone || subtask.isDone ? 'line-through' : ''}`}
              >
                <div className="flex items-start gap-1.5">
                  {onToggleSubtask ? (
                    <button
                      type="button"
                      aria-label={subtask.isDone ? 'Mark subtask as open' : 'Mark subtask as done'}
                      onClick={() => onToggleSubtask(task, subtask.id)}
                      disabled={busy}
                      className="mt-0.5 shrink-0 text-moss-500 hover:text-moss-600 disabled:cursor-not-allowed"
                    >
                      {subtask.isDone ? (
                        <CheckCircle2 size={15} />
                      ) : (
                        <Circle size={15} className="text-ink/25" />
                      )}
                    </button>
                  ) : (
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink/30" />
                  )}
                  <div className="min-w-0">
                    {subtask.name && <span className="break-words font-medium text-ink/70">{subtask.name}</span>}
                    {subtask.name && subtask.description && ' — '}
                    {subtask.description && <span className="break-words">{subtask.description}</span>}
                    {subtask.attachments.length > 0 && (
                      <span className="ml-1.5 inline-flex items-center gap-1.5 align-middle">
                        {subtask.attachments.map((attachment) => (
                          <a
                            key={attachment.id}
                            href={attachment.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-ink/40 hover:text-indigo-700"
                            aria-label={attachment.type === 'link' ? 'Open link' : 'Open image'}
                          >
                            {attachment.type === 'link' ? <Link2 size={13} /> : <Image size={13} />}
                          </a>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {onEdit && (
          <button
            aria-label="Edit task"
            onClick={() => onEdit(task)}
            disabled={busy}
            className="rounded-md p-2 text-ink/40 hover:bg-ink/5 hover:text-indigo-700 disabled:cursor-not-allowed"
          >
            <Pencil size={17} />
          </button>
        )}
        {onDelete && (
          <button
            aria-label="Delete task"
            onClick={() => onDelete(task)}
            disabled={busy}
            className="rounded-md p-2 text-ink/40 hover:bg-coral-500/10 hover:text-coral-600 disabled:cursor-not-allowed"
          >
            <Trash2 size={17} />
          </button>
        )}
        {onRestore && (
          <button
            aria-label="Restore task"
            onClick={() => onRestore(task)}
            disabled={busy}
            className="rounded-md p-2 text-ink/40 hover:bg-moss-500/10 hover:text-moss-600 disabled:cursor-not-allowed"
          >
            <RotateCcw size={17} />
          </button>
        )}
        {onDestroy && (
          <button
            aria-label="Delete permanently"
            onClick={() => onDestroy(task)}
            disabled={busy}
            className="rounded-md p-2 text-ink/40 hover:bg-coral-500/10 hover:text-coral-600 disabled:cursor-not-allowed"
          >
            <XCircle size={17} />
          </button>
        )}
      </div>
    </div>
  )
}