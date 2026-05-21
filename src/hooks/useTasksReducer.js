// ============================================================
// PERSONA 1 — Arquitecto de Estado
// Hooks: useReducer
// ============================================================

export const ACTION_TYPES = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  TOGGLE: 'TOGGLE',
  FILTER: 'FILTER',
  SORT: 'SORT',
}

export const initialState = {
  items: [],
  filter: 'all',  // 'all' | 'pending' | 'done'
  sort: 'asc',    // 'asc' | 'desc'
}

function tasksReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD:
      return {
        ...state,
        items: [
          ...state.items,
          {
            id: Date.now(),
            title: action.payload,
            priority: action.priority ?? 'media',
            done: false,
          },
        ],
      }

    case ACTION_TYPES.REMOVE:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      }

    case ACTION_TYPES.TOGGLE:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload ? { ...item, done: !item.done } : item
        ),
      }

    case ACTION_TYPES.FILTER:
      return { ...state, filter: action.payload }

    case ACTION_TYPES.SORT:
      return { ...state, sort: action.payload }

    default:
      return state
  }
}

export default tasksReducer
