// ============================================================
// PERSONA 1 — Arquitecto de Estado
// TODO: Implementar useReducer completo
// ============================================================

// TODO: Definir tipos de acción: ADD, REMOVE, TOGGLE, FILTER, SORT
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
    // TODO: Implementar caso ADD — agregar tarea inmutablemente
    // Pista: { id: Date.now(), title: action.payload, priority: action.priority ?? 'media', done: false }

    // TODO: Implementar caso REMOVE — filtrar por id

    // TODO: Implementar caso TOGGLE — cambiar done del item con action.payload id

    // TODO: Implementar caso FILTER — cambiar state.filter

    // TODO: Implementar caso SORT — cambiar state.sort

    default:
      return state
  }
}

export default tasksReducer
