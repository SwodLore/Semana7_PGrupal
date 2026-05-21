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

const VALID_PRIORITIES = ['alta', 'media', 'baja']
const VALID_FILTERS = ['all', 'pending', 'done']
const VALID_SORTS = ['asc', 'desc']

export const initialState = {
  items: [],
  filter: 'all',  // 'all' | 'pending' | 'done'
  sort: 'asc',    // 'asc' | 'desc'
}

function tasksReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD: {
      const title = action.payload?.trim()
      if (!title) return state

      const priority = VALID_PRIORITIES.includes(action.priority)
        ? action.priority
        : 'media'

      return {
        ...state,
        items: [
          ...state.items,
          {
            // crypto.randomUUID evita colisiones que Date.now() puede tener
            // si dos ADD llegan en el mismo milisegundo
            id: crypto.randomUUID(),
            title,
            priority,
            done: false,
          },
        ],
      }
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
      if (!VALID_FILTERS.includes(action.payload)) return state
      return { ...state, filter: action.payload }

    case ACTION_TYPES.SORT:
      if (!VALID_SORTS.includes(action.payload)) return state
      return { ...state, sort: action.payload }

    default:
      return state
  }
}

export default tasksReducer
