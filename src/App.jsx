// ============================================================
// PERSONA 1 — Arquitecto de Estado
// Hooks: useReducer, useState, useContext
// ============================================================
import { useReducer, useContext, useState } from 'react'
import tasksReducer, { ACTION_TYPES, initialState } from './hooks/useTasksReducer'
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'
import TaskList from './components/TaskList'

const Dashboard = () => {
  const [state, dispatch] = useReducer(tasksReducer, initialState)
  const { theme, toggleTheme } = useContext(ThemeContext)

  // useState para UI local — no forma parte del estado global de tareas
  const [inputValue, setInputValue] = useState('')
  const [priority, setPriority] = useState('media')

  const handleAdd = () => {
    if (!inputValue.trim()) return
    dispatch({ type: ACTION_TYPES.ADD, payload: inputValue.trim(), priority })
    setInputValue('')
  }

  const handleRemove = (id) => dispatch({ type: ACTION_TYPES.REMOVE, payload: id })
  const handleToggle = (id) => dispatch({ type: ACTION_TYPES.TOGGLE, payload: id })
  const handleFilter = (value) => dispatch({ type: ACTION_TYPES.FILTER, payload: value })
  const handleSort = () =>
    dispatch({ type: ACTION_TYPES.SORT, payload: state.sort === 'asc' ? 'desc' : 'asc' })

  const donasCount = state.items.filter((t) => t.done).length
  const pendingCount = state.items.length - donasCount

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
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="select-priority"
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
          Completadas ({donasCount})
        </button>
        <button onClick={handleSort}>
          Ordenar {state.sort === 'asc' ? 'Z→A' : 'A→Z'}
        </button>
      </div>

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
