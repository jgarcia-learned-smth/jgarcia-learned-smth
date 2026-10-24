import { useMemo, useState } from 'react'

const dayInMs = 24 * 60 * 60 * 1000

const dateDiffInDays = (start, end) =>
  Math.max(1, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / dayInMs) + 1)

export function GanttChart({ tasks, usersById, onUpdateTask }) {
  const [zoom, setZoom] = useState(42)

  const timeline = useMemo(() => {
    const starts = tasks.map((task) => new Date(task.startDate).getTime())
    const ends = tasks.map((task) => new Date(task.endDate).getTime())

    const minDate = new Date(Math.min(...starts))
    const maxDate = new Date(Math.max(...ends))
    const totalDays = dateDiffInDays(minDate, maxDate)

    return {
      minDate,
      totalDays,
      width: totalDays * zoom,
    }
  }, [tasks, zoom])

  return (
    <section className="space-y-3 rounded-xl bg-slate-900/70 p-4 ring-1 ring-white/10">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-white">Planificación Gantt</h3>
          <p className="text-xs text-slate-300">Ajusta fechas y visualiza dependencias temporales.</p>
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300">
          Zoom
          <input
            type="range"
            min="26"
            max="72"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
        </label>
      </header>

      <div className="overflow-auto">
        <div className="min-w-max space-y-2" style={{ width: `${timeline.width + 260}px` }}>
          {tasks.map((task) => {
            const startOffset = dateDiffInDays(timeline.minDate, task.startDate) - 1
            const duration = dateDiffInDays(task.startDate, task.endDate)
            const assignee = usersById[task.assigneeId]

            return (
              <div key={task.id} className="grid grid-cols-[240px_1fr] gap-4">
                <div className="rounded-md bg-slate-800 p-2 text-xs text-slate-200">
                  <p className="font-medium text-slate-100">{task.title}</p>
                  <p>{assignee?.name}</p>
                  <div className="mt-2 flex gap-1">
                    <input
                      type="date"
                      value={task.startDate}
                      onChange={(event) => onUpdateTask(task.id, { startDate: event.target.value })}
                      className="w-full rounded border border-slate-600 bg-slate-900 px-1 py-0.5 text-[11px]"
                    />
                    <input
                      type="date"
                      value={task.endDate}
                      onChange={(event) => onUpdateTask(task.id, { endDate: event.target.value })}
                      className="w-full rounded border border-slate-600 bg-slate-900 px-1 py-0.5 text-[11px]"
                    />
                  </div>
                </div>

                <div className="relative rounded-md bg-slate-800/60">
                  <div
                    className="absolute inset-y-2 rounded-md bg-violet-500/80 px-2 py-1 text-[11px] font-medium text-white"
                    style={{
                      left: `${startOffset * zoom}px`,
                      width: `${duration * zoom}px`,
                    }}
                  >
                    {task.priority}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
