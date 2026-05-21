// ============================================================
// PERSONA 1 — Arquitecto de Estado (conectar todo)
// PERSONA 4 — QA: verificar que no haya warnings ESLint
// ============================================================
import { useReducer, useContext, useState } from 'react'
import tasksReducer, { ACTION_TYPES, initialState } from './hooks/useTasksReducer'
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'
import TaskList from './components/TaskList'

const Dashboard = () => {
  const [state, dispatch] = useReducer(tasksReducer, initialState)
  const { theme, toggleTheme } = useContext(ThemeContext)
  const [inputValue, setInputValue] = useState('')
  const [priority, setPriority] = useState('media')

  // TODO (Persona 1): conectar handlers con dispatch
  const handleAdd = () => {
    if (inputValue.trim()) {
      dispatch({ type: ACTION_TYPES.ADD, payload: inputValue.trim(), priority })
      setInputValue('')
    }
  }

  const handleRemove = (id) => dispatch({ type: ACTION_TYPES.REMOVE, payload: id })
  const handleToggle = (id) => dispatch({ type: ACTION_TYPES.TOGGLE, payload: id })

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
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
        <button onClick={handleAdd} className="btn-add">Agregar</button>
      </div>

      {/* Controles filtro y ordenamiento */}
      {/* TODO (Persona 1): conectar con dispatch ACTION_TYPES.FILTER y SORT */}
      <div className="controls">
        <button onClick={() => dispatch({ type: ACTION_TYPES.FILTER, payload: 'all' })}>
          Todas
        </button>
        <button onClick={() => dispatch({ type: ACTION_TYPES.FILTER, payload: 'pending' })}>
          Pendientes
        </button>
        <button onClick={() => dispatch({ type: ACTION_TYPES.FILTER, payload: 'done' })}>
          Completadas
        </button>
        <button onClick={() => dispatch({ type: ACTION_TYPES.SORT, payload: state.sort === 'asc' ? 'desc' : 'asc' })}>
          Ordenar {state.sort === 'asc' ? 'Z→A' : 'A→Z'}
        </button>
      </div>

      <p className="stats">
        Total: {state.items.length} | Pendientes: {state.items.filter(t => !t.done).length}
      </p>

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
