const today = new Date('2026-10-20T08:00:00Z')

const addDays = (date, days) => {
  const value = new Date(date)
  value.setDate(value.getDate() + days)
  return value.toISOString().slice(0, 10)
}

export const mockProjectData = {
  boards: {
    byId: {
      board_1: {
        id: 'board_1',
        name: 'Sprint Alpha',
        columnIds: ['column_backlog', 'column_progress', 'column_review', 'column_done'],
      },
    },
    allIds: ['board_1'],
  },
  columns: {
    byId: {
      column_backlog: {
        id: 'column_backlog',
        title: 'Backlog',
        color: 'bg-slate-500',
        taskIds: ['task_1', 'task_2'],
      },
      column_progress: {
        id: 'column_progress',
        title: 'In Progress',
        color: 'bg-sky-500',
        taskIds: ['task_3'],
      },
      column_review: {
        id: 'column_review',
        title: 'Review',
        color: 'bg-amber-500',
        taskIds: ['task_4'],
      },
      column_done: {
        id: 'column_done',
        title: 'Done',
        color: 'bg-emerald-500',
        taskIds: ['task_5'],
      },
    },
    allIds: ['column_backlog', 'column_progress', 'column_review', 'column_done'],
  },
  tasks: {
    byId: {
      task_1: {
        id: 'task_1',
        title: 'Definir arquitectura frontend',
        priority: 'Alta',
        assigneeId: 'user_1',
        description: '<p><strong>Objetivo:</strong> Documentar módulos, estado global y puntos de integración con backend Python.</p>',
        commentIds: ['comment_1'],
        attachments: ['arquitectura_v1.pdf'],
        mentions: ['user_2'],
        startDate: addDays(today, 0),
        endDate: addDays(today, 2),
      },
      task_2: {
        id: 'task_2',
        title: 'Diseñar flujo de mocks colaborativos',
        priority: 'Media',
        assigneeId: 'user_2',
        description: '<p>Simular latencia para comentarios, asignaciones y cambios de estado de tareas.</p>',
        commentIds: ['comment_2'],
        attachments: [],
        mentions: [],
        startDate: addDays(today, 1),
        endDate: addDays(today, 3),
      },
      task_3: {
        id: 'task_3',
        title: 'Implementar drag & drop Kanban',
        priority: 'Alta',
        assigneeId: 'user_3',
        description: '<p>Permitir mover y reordenar tarjetas sin latencia perceptible.</p>',
        commentIds: [],
        attachments: ['mock-flow.png'],
        mentions: ['user_1'],
        startDate: addDays(today, 2),
        endDate: addDays(today, 5),
      },
      task_4: {
        id: 'task_4',
        title: 'Validar editor rich text',
        priority: 'Media',
        assigneeId: 'user_4',
        description: '<p>Confirmar soporte de formato, menciones y adjuntos en UI.</p>',
        commentIds: [],
        attachments: [],
        mentions: [],
        startDate: addDays(today, 3),
        endDate: addDays(today, 6),
      },
      task_5: {
        id: 'task_5',
        title: 'Prototipo de Gantt interactivo',
        priority: 'Baja',
        assigneeId: 'user_2',
        description: '<p>Visualizar dependencias temporales por sprint.</p>',
        commentIds: [],
        attachments: ['gantt-borrador.csv'],
        mentions: [],
        startDate: addDays(today, 0),
        endDate: addDays(today, 4),
      },
    },
    allIds: ['task_1', 'task_2', 'task_3', 'task_4', 'task_5'],
  },
  comments: {
    byId: {
      comment_1: {
        id: 'comment_1',
        taskId: 'task_1',
        authorId: 'user_2',
        body: 'Propongo dividir la UI por dominios: board, editor y timeline.',
        createdAt: '2026-10-20T12:00:00Z',
      },
      comment_2: {
        id: 'comment_2',
        taskId: 'task_2',
        authorId: 'user_1',
        body: 'Agreguemos delays entre 200 y 800 ms para emular red.',
        createdAt: '2026-10-21T09:30:00Z',
      },
    },
    allIds: ['comment_1', 'comment_2'],
  },
  users: {
    byId: {
      user_1: { id: 'user_1', name: 'Ana', role: 'Product Owner' },
      user_2: { id: 'user_2', name: 'Luis', role: 'Scrum Master' },
      user_3: { id: 'user_3', name: 'Marta', role: 'Frontend Dev' },
      user_4: { id: 'user_4', name: 'Diego', role: 'QA Engineer' },
    },
    allIds: ['user_1', 'user_2', 'user_3', 'user_4'],
  },
}

export const fakeNetworkDelay = (payload, min = 250, max = 700) =>
  new Promise((resolve) => {
    const timeout = Math.floor(Math.random() * (max - min + 1)) + min
    setTimeout(() => resolve(payload), timeout)
  })
