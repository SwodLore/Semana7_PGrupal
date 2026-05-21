// ============================================================
// PERSONA 1 — Arquitecto de Estado
// Hooks: useReducer, useState, useContext, useCallback
// ============================================================
import { useReducer, useContext, useState, useCallback } from 'react'
import tasksReducer, { ACTION_TYPES, initialState } from './hooks/useTasksReducer'
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'
import TaskList from './components/TaskList'

const Dashboard = () => {
  const [state, dispatch] = useReducer(tasksReducer, initialState)
  const { theme, toggleTheme } = useContext(ThemeContext)

  // useState para UI local — inputValue y priority no son estado global de tareas
  const [inputValue, setInputValue] = useState('')
  const [priority, setPriority] = useState('media')

  const handleAdd = useCallback(() => {
    if (!inputValue.trim()) return
    dispatch({ type: ACTION_TYPES.ADD, payload: inputValue.trim(), priority })
    setInputValue('')
  }, [inputValue, priority])

  // useCallback aquí es crítico: estas funciones se pasan como props a TaskList.
  // Sin useCallback, cambian referencia en cada render y anulan el useCallback de Persona 3.
  const handleRemove = useCallback(
    (id) => dispatch({ type: ACTION_TYPES.REMOVE, payload: id }),
    []
  )

  const handleToggle = useCallback(
    (id) => dispatch({ type: ACTION_TYPES.TOGGLE, payload: id }),
    []
  )

  const handleFilter = useCallback(
    (value) => dispatch({ type: ACTION_TYPES.FILTER, payload: value }),
    []
  )

  const handleSort = useCallback(
    () => dispatch({ type: ACTION_TYPES.SORT, payload: state.sort === 'asc' ? 'desc' : 'asc' }),
    [state.sort]
  )

  // Fix: era "donasCount" (typo)
  const doneCount = state.items.filter((t) => t.done).length
  const pendingCount = state.items.length - doneCount

  return (
    <div className={`dashboard ${theme}`}>
      <header className="dashboard-header">
        <h1>Gestor de Tareas</h1>
        <button onClick={toggleTheme} className="btn-theme">
          {theme === 'light' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
        </button>
      </header>

      {/* Formulario agregar tarea */}
      <div className="add-task">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nueva tarea..."
          className="input-task"
          aria-label="Título de la tarea"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="select-priority"
          aria-label="Prioridad"
        >
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <button onClick={handleAdd} className="btn-add">Agregar</button>
      </div>

      {/* Controles filtro y ordenamiento */}
      <div className="controls">
        <button
          onClick={() => handleFilter('all')}
          className={state.filter === 'all' ? 'active' : ''}
        >
          Todas ({state.items.length})
        </button>
        <button
          onClick={() => handleFilter('pending')}
          className={state.filter === 'pending' ? 'active' : ''}
        >
          Pendientes ({pendingCount})
        </button>
        <button
          onClick={() => handleFilter('done')}
          className={state.filter === 'done' ? 'active' : ''}
        >
          Completadas ({doneCount})
        </button>
        <button onClick={handleSort} className="btn-sort">
          {state.sort === 'asc' ? '↑ A→Z' : '↓ Z→A'}
        </button>
      </div>

      {state.items.length === 0 && (
        <p className="empty-msg">No hay tareas. ¡Agrega una!</p>
      )}

      <TaskList
        tasks={state.items}
        filter={state.filter}
        sort={state.sort}
        onRemove={handleRemove}
        onToggle={handleToggle}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}
