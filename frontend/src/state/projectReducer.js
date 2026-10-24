export const projectReducer = (state, action) => {
  switch (action.type) {
    case 'select_task':
      return { ...state, selectedTaskId: action.payload.taskId }

    case 'move_task': {
      const { sourceColumnId, sourceIndex, destinationColumnId, destinationIndex } = action.payload
      if (sourceColumnId === destinationColumnId && sourceIndex === destinationIndex) {
        return state
      }

      const sourceColumn = state.columns.byId[sourceColumnId]
      const destinationColumn = state.columns.byId[destinationColumnId]
      const sourceTaskIds = [...sourceColumn.taskIds]
      const [movedTaskId] = sourceTaskIds.splice(sourceIndex, 1)

      if (!movedTaskId) {
        return state
      }

      const nextColumnsById = {
        ...state.columns.byId,
        [sourceColumnId]: {
          ...sourceColumn,
          taskIds: sourceTaskIds,
        },
      }

      if (sourceColumnId === destinationColumnId) {
        sourceTaskIds.splice(destinationIndex, 0, movedTaskId)
        nextColumnsById[sourceColumnId] = {
          ...sourceColumn,
          taskIds: sourceTaskIds,
        }
      } else {
        const destinationTaskIds = [...destinationColumn.taskIds]
        destinationTaskIds.splice(destinationIndex, 0, movedTaskId)

        nextColumnsById[destinationColumnId] = {
          ...destinationColumn,
          taskIds: destinationTaskIds,
        }
      }

      return {
        ...state,
        columns: {
          ...state.columns,
          byId: nextColumnsById,
        },
      }
    }

    case 'update_task': {
      const { taskId, patch } = action.payload
      return {
        ...state,
        tasks: {
          ...state.tasks,
          byId: {
            ...state.tasks.byId,
            [taskId]: {
              ...state.tasks.byId[taskId],
              ...patch,
            },
          },
        },
      }
    }

    case 'add_comment': {
      const { comment } = action.payload
      const task = state.tasks.byId[comment.taskId]

      return {
        ...state,
        comments: {
          ...state.comments,
          byId: {
            ...state.comments.byId,
            [comment.id]: comment,
          },
          allIds: [...state.comments.allIds, comment.id],
        },
        tasks: {
          ...state.tasks,
          byId: {
            ...state.tasks.byId,
            [comment.taskId]: {
              ...task,
              commentIds: [...task.commentIds, comment.id],
            },
          },
        },
      }
    }

    case 'add_column': {
      const { title } = action.payload
      const id = `column_${crypto.randomUUID().slice(0, 8)}`
      const boardId = state.boards.allIds[0]
      const board = state.boards.byId[boardId]

      return {
        ...state,
        columns: {
          ...state.columns,
          byId: {
            ...state.columns.byId,
            [id]: { id, title, color: 'bg-violet-500', taskIds: [] },
          },
          allIds: [...state.columns.allIds, id],
        },
        boards: {
          ...state.boards,
          byId: {
            ...state.boards.byId,
            [boardId]: {
              ...board,
              columnIds: [...board.columnIds, id],
            },
          },
        },
      }
    }

    default:
      return state
  }
}
