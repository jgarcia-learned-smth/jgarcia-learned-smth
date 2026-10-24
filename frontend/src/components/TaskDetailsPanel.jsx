import { useMemo, useState } from 'react'
import { RichTextEditor } from './RichTextEditor'

export function TaskDetailsPanel({ task, users, commentsById, pending, onUpdateTask, onAddComment }) {
  const [comment, setComment] = useState('')

  const orderedComments = useMemo(
    () => task.commentIds.map((commentId) => commentsById[commentId]).filter(Boolean),
    [commentsById, task.commentIds],
  )

  const handleSubmitComment = async (event) => {
    event.preventDefault()
    if (!comment.trim()) {
      return
    }

    await onAddComment(task.id, users[0].id, comment.trim())
    setComment('')
  }

  return (
    <aside className="space-y-4 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/10">
      <header>
        <h2 className="text-lg font-semibold text-white">{task.title}</h2>
        <p className="text-sm text-slate-300">Detalle de tarea y colaboración simulada en tiempo real</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="space-y-1 text-xs text-slate-300">
          Prioridad
          <select
            value={task.priority}
            onChange={(event) => onUpdateTask(task.id, { priority: event.target.value })}
            className="w-full rounded-md border border-slate-600 bg-slate-800 px-2 py-1.5 text-slate-100"
          >
            <option>Baja</option>
            <option>Media</option>
            <option>Alta</option>
          </select>
        </label>

        <label className="space-y-1 text-xs text-slate-300">
          Responsable
          <select
            value={task.assigneeId}
            onChange={(event) => onUpdateTask(task.id, { assigneeId: event.target.value })}
            className="w-full rounded-md border border-slate-600 bg-slate-800 px-2 py-1.5 text-slate-100"
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} · {user.role}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-xs text-slate-300">
          Fecha final
          <input
            type="date"
            value={task.endDate}
            onChange={(event) => onUpdateTask(task.id, { endDate: event.target.value })}
            className="w-full rounded-md border border-slate-600 bg-slate-800 px-2 py-1.5 text-slate-100"
          />
        </label>
      </div>

      <RichTextEditor
        value={task.description}
        users={users}
        busy={pending[`task_${task.id}`]}
        onSave={(description) => onUpdateTask(task.id, { description })}
        onAttachFiles={(attachments) => {
          if (!attachments.length) {
            return
          }

          const combined = [...new Set([...task.attachments, ...attachments])]
          onUpdateTask(task.id, { attachments: combined })
        }}
      />

      <div className="space-y-2 rounded-xl bg-slate-800/70 p-3">
        <h3 className="text-sm font-semibold text-slate-100">Adjuntos</h3>
        <div className="flex flex-wrap gap-2">
          {task.attachments.map((file) => (
            <span key={file} className="rounded-full bg-slate-700 px-2 py-1 text-xs text-slate-200">
              {file}
            </span>
          ))}
          {!task.attachments.length && <p className="text-xs text-slate-400">Sin adjuntos</p>}
        </div>
      </div>

      <div className="space-y-3 rounded-xl bg-slate-800/70 p-3">
        <h3 className="text-sm font-semibold text-slate-100">Comentarios</h3>

        <div className="max-h-44 space-y-2 overflow-auto">
          {orderedComments.map((entry) => {
            const author = users.find((user) => user.id === entry.authorId)
            return (
              <article key={entry.id} className="rounded-md bg-slate-900/70 p-2">
                <p className="text-xs text-violet-300">{author?.name}</p>
                <p className="text-xs text-slate-200">{entry.body}</p>
              </article>
            )
          })}

          {!orderedComments.length && <p className="text-xs text-slate-400">No hay comentarios todavía.</p>}
        </div>

        <form className="flex gap-2" onSubmit={handleSubmitComment}>
          <input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Escribe un comentario"
            className="w-full rounded-md border border-slate-600 bg-slate-900 px-2 py-1.5 text-xs text-slate-100"
          />
          <button
            type="submit"
            disabled={pending[`comments_${task.id}`]}
            className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
          >
            {pending[`comments_${task.id}`] ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </aside>
  )
}
