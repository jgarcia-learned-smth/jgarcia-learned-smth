import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useState,
} from 'react'
import { fakeNetworkDelay, mockProjectData } from '../data/mockData'
import { projectReducer } from './projectReducer'

const ProjectContext = createContext(null)

const initialState = {
  ...mockProjectData,
  selectedTaskId: mockProjectData.tasks.allIds[0],
}

export function ProjectProvider({ children }) {
  const [state, dispatch] = useReducer(projectReducer, initialState)
  const [pending, setPending] = useState({})

  const runAsyncAction = useCallback(async (key, operation) => {
    setPending((previous) => ({ ...previous, [key]: true }))
    await operation()
    setPending((previous) => ({ ...previous, [key]: false }))
  }, [])

  const selectTask = useCallback((taskId) => {
    dispatch({ type: 'select_task', payload: { taskId } })
  }, [])

  const moveTask = useCallback(
    async (payload) => {
      await runAsyncAction('kanban', async () => {
        await fakeNetworkDelay(null)
        dispatch({ type: 'move_task', payload })
      })
    },
    [runAsyncAction],
  )

  const updateTask = useCallback(
    async (taskId, patch) => {
      await runAsyncAction(`task_${taskId}`, async () => {
        await fakeNetworkDelay(null)
        dispatch({ type: 'update_task', payload: { taskId, patch } })
      })
    },
    [runAsyncAction],
  )

  const addComment = useCallback(
    async (taskId, authorId, body) => {
      await runAsyncAction(`comments_${taskId}`, async () => {
        const comment = await fakeNetworkDelay({
          id: `comment_${crypto.randomUUID().slice(0, 8)}`,
          taskId,
          authorId,
          body,
          createdAt: new Date().toISOString(),
        })

        dispatch({ type: 'add_comment', payload: { comment } })
      })
    },
    [runAsyncAction],
  )

  const addColumn = useCallback(
    async (title) => {
      await runAsyncAction('column', async () => {
        await fakeNetworkDelay(null)
        dispatch({ type: 'add_column', payload: { title } })
      })
    },
    [runAsyncAction],
  )

  const value = useMemo(
    () => ({
      state,
      pending,
      actions: { selectTask, moveTask, updateTask, addComment, addColumn },
    }),
    [addColumn, addComment, moveTask, pending, selectTask, state, updateTask],
  )

  return <ProjectContext value={value}>{children}</ProjectContext>
}

export const useProject = () => {
  const context = useContext(ProjectContext)

  if (!context) {
    throw new Error('useProject debe utilizarse dentro de ProjectProvider')
  }

  return context
}
