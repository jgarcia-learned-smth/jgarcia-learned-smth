import { useMemo, useState } from 'react'

const getInitialDragState = () => ({
  taskId: null,
  sourceColumnId: null,
  sourceIndex: null,
  destinationColumnId: null,
  destinationIndex: null,
})

export function KanbanBoard({ board, columns, tasksById, usersById, selectedTaskId, pending, onSelectTask, onMoveTask, onAddColumn }) {
  const [dragState, setDragState] = useState(getInitialDragState)
  const [columnInput, setColumnInput] = useState('')

  const visibleColumns = useMemo(
    () => board.columnIds.map((columnId) => columns[columnId]).filter(Boolean),
    [board.columnIds, columns],
  )

  const handleDrop = async (columnId, index) => {
    if (!dragState.taskId || dragState.sourceColumnId === null || dragState.sourceIndex === null) {
      return
    }

    await onMoveTask({
      sourceColumnId: dragState.sourceColumnId,
      sourceIndex: dragState.sourceIndex,
      destinationColumnId: columnId,
      destinationIndex: index,
    })

    setDragState(getInitialDragState())
  }

  const handleAddColumn = async (event) => {
    event.preventDefault()
    const title = columnInput.trim()
    if (!title) {
      return
    }

    await onAddColumn(title)
    setColumnInput('')
  }

  return (
    <section className="space-y-4 rounded-2xl bg-slate-900/70 p-4 ring-1 ring-white/10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{board.name}</h2>
          <p className="text-sm text-slate-300">
            Drag & drop con reordenación interna y entre columnas
          </p>
        </div>

        <form className="flex gap-2" onSubmit={handleAddColumn}>
          <input
            className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-slate-100 outline-none focus:border-violet-400"
            placeholder="Nueva columna"
            value={columnInput}
            onChange={(event) => setColumnInput(event.target.value)}
          />
          <button
            type="submit"
            className="rounded-md bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500"
          >
            Añadir
          </button>
        </form>
      </header>

      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {visibleColumns.map((column) => (
          <article
            key={column.id}
            className="min-h-48 rounded-xl bg-slate-800/90 p-3 ring-1 ring-slate-700"
            onDragOver={(event) => {
              event.preventDefault()
              setDragState((previous) => ({ ...previous, destinationColumnId: column.id, destinationIndex: column.taskIds.length }))
            }}
            onDrop={async (event) => {
              event.preventDefault()
              await handleDrop(column.id, column.taskIds.length)
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">{column.title}</h3>
              <span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
            </div>

            <div className="space-y-2">
              {column.taskIds.map((taskId, taskIndex) => {
                const task = tasksById[taskId]
                const assignee = usersById[task.assigneeId]
                const isSelected = selectedTaskId === taskId

                return (
                  <button
                    key={task.id}
                    type="button"
                    draggable
                    onDragStart={() => {
                      setDragState({
                        taskId: task.id,
                        sourceColumnId: column.id,
                        sourceIndex: taskIndex,
                        destinationColumnId: column.id,
                        destinationIndex: taskIndex,
                      })
                    }}
                    onDragOver={(event) => {
                      event.preventDefault()
                      setDragState((previous) => ({
                        ...previous,
                        destinationColumnId: column.id,
                        destinationIndex: taskIndex,
                      }))
                    }}
                    onDrop={async (event) => {
                      event.preventDefault()
                      await handleDrop(column.id, taskIndex)
                    }}
                    onClick={() => onSelectTask(task.id)}
                    className={`w-full rounded-lg border p-3 text-left transition ${
                      isSelected
                        ? 'border-violet-400 bg-violet-500/10'
                        : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-100">{task.title}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                      <span>{task.priority}</span>
                      <span>{assignee?.name}</span>
                    </div>
                  </button>
                )
              })}

              {!column.taskIds.length && (
                <div className="rounded-lg border border-dashed border-slate-600 p-3 text-center text-xs text-slate-400">
                  Suelta tareas aquí
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {pending.kanban && <p className="text-xs text-violet-300">Sincronizando cambios de tablero...</p>}
    </section>
  )
}
