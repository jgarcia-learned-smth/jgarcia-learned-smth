import { useMemo } from 'react'
import { GanttChart } from './components/GanttChart'
import { KanbanBoard } from './components/KanbanBoard'
import { TaskDetailsPanel } from './components/TaskDetailsPanel'
import { ProjectProvider, useProject } from './state/ProjectProvider'

function Workspace() {
  const { state, pending, actions } = useProject()

  const activeBoard = state.boards.byId[state.boards.allIds[0]]
  const selectedTask = state.tasks.byId[state.selectedTaskId]

  const usersList = useMemo(
    () => state.users.allIds.map((userId) => state.users.byId[userId]),
    [state.users.allIds, state.users.byId],
  )

  const ganttTasks = useMemo(
    () => state.tasks.allIds.map((taskId) => state.tasks.byId[taskId]),
    [state.tasks.allIds, state.tasks.byId],
  )

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 p-4 text-slate-100 lg:p-6">
      <div className="mx-auto max-w-[1500px] space-y-4">
        <header className="rounded-2xl bg-slate-900/80 p-5 ring-1 ring-white/10">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Agile Workflow Platform</p>
          <h1 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
            Gestor de Proyectos y Flujos Ágiles
          </h1>
          <p className="mt-2 max-w-4xl text-sm text-slate-300">
            Frontend en React + Tailwind con estado normalizado, tablero Kanban personalizable,
            editor rich text, Gantt interactivo y colaboración simulada mediante mocks asíncronos.
          </p>
        </header>

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <KanbanBoard
            board={activeBoard}
            columns={state.columns.byId}
            tasksById={state.tasks.byId}
            usersById={state.users.byId}
            selectedTaskId={state.selectedTaskId}
            pending={pending}
            onSelectTask={actions.selectTask}
            onMoveTask={actions.moveTask}
            onAddColumn={actions.addColumn}
          />

          {selectedTask && (
            <TaskDetailsPanel
              task={selectedTask}
              users={usersList}
              commentsById={state.comments.byId}
              pending={pending}
              onUpdateTask={actions.updateTask}
              onAddComment={actions.addComment}
            />
          )}
        </div>

        <GanttChart tasks={ganttTasks} usersById={state.users.byId} onUpdateTask={actions.updateTask} />
      </div>
    </main>
  )
}

function App() {
  return (
    <ProjectProvider>
      <Workspace />
    </ProjectProvider>
  )
}

export default App
