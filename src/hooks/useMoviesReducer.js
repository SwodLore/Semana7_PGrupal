// ============================================================
// PERSONA 1 — Arquitecto de Estado
// Hooks: useReducer
// ============================================================

export const ACTION_TYPES = {
  ADD:          'ADD',
  REMOVE:       'REMOVE',
  TOGGLE:       'TOGGLE',       // watched ↔ pending
  FILTER:       'FILTER',       // all | watched | pending
  FILTER_GENRE: 'FILTER_GENRE', // all | Acción | Drama | ...
  SORT:         'SORT',         // rating | title-asc | title-desc
}

export const GENRES = ['Acción', 'Comedia', 'Drama', 'Terror', 'Sci-Fi', 'Animación', 'Documental', 'Romance']

const VALID_FILTERS  = ['all', 'watched', 'pending']
const VALID_SORTS    = ['rating', 'title-asc', 'title-desc']

export const initialState = {
  items:  [],
  filter: 'all',
  genre:  'all',
  sort:   'rating',
}

function moviesReducer(state, action) {
  switch (action.type) {

    case ACTION_TYPES.ADD: {
      const title = action.payload?.trim()
      if (!title) return state

      return {
        ...state,
        items: [
          ...state.items,
          {
            id:      crypto.randomUUID(),
            title,
            genre:   action.genre   ?? 'Drama',
            rating:  action.rating  ?? 3,
            watched: false,
          },
        ],
      }
    }

    case ACTION_TYPES.REMOVE:
      return {
        ...state,
        items: state.items.filter((m) => m.id !== action.payload),
      }

    case ACTION_TYPES.TOGGLE:
      return {
        ...state,
        items: state.items.map((m) =>
          m.id === action.payload ? { ...m, watched: !m.watched } : m
        ),
      }

    case ACTION_TYPES.FILTER:
      if (!VALID_FILTERS.includes(action.payload)) return state
      return { ...state, filter: action.payload }

    case ACTION_TYPES.FILTER_GENRE:
      return { ...state, genre: action.payload }

    case ACTION_TYPES.SORT:
      if (!VALID_SORTS.includes(action.payload)) return state
      return { ...state, sort: action.payload }

    default:
      return state
  }
}

export default moviesReducer
