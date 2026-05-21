// ============================================================
// PERSONA 3 — Optimizador de Rendimiento
// TODO: Implementar useMemo, useCallback, useRef
// ============================================================
import { useMemo, useCallback, useRef, useEffect } from 'react'

const TaskList = ({ tasks, filter, sort, onRemove, onToggle }) => {
  // TODO: useRef para referenciar el input y aplicar auto-focus
  const inputRef = useRef(null)

  // TODO: useMemo para calcular processedTasks (filtrar + ordenar)
  // Solo recalcular cuando cambien tasks, filter o sort
  // Filtrar: filter==='done' → solo done, filter==='pending' → solo !done, 'all' → todos
  // Ordenar: sort==='asc' → A→Z por title, 'desc' → Z→A
  const processedTasks = useMemo(() => {
    const filteredTasks = tasks.filter((task) => {
      if (filter === 'done') return task.done
      if (filter === 'pending') return !task.done
      return true
    })

    return [...filteredTasks].sort((taskA, taskB) => {
      const comparison = taskA.title.localeCompare(taskB.title)
      return sort === 'desc' ? -comparison : comparison
    })
  }, [tasks, filter, sort])

  // TODO: useCallback para estabilizar handleRemove pasado a hijos
  // Evita re-render de botones que reciben esta función como prop
  const handleRemove = useCallback((id) => {
    onRemove(id)
  }, [onRemove])

  // TODO: useCallback para handleToggle
  const handleToggle = useCallback((id) => {
    onToggle(id)
  }, [onToggle])

  // TODO: useEffect que haga focus al input cada vez que se agrega una tarea
  // Dependencia: tasks.length
  useEffect(() => {
    inputRef.current?.focus()
  }, [tasks.length])

  return (
    <ul className="task-list">
      {processedTasks.map((task) => (
        <li key={task.id} className={`task-item ${task.done ? 'done' : ''}`}>
          <span onClick={() => handleToggle(task.id)} className="task-title">
            {task.title}
          </span>
          <span className={`priority priority-${task.priority}`}>{task.priority}</span>
          <button onClick={() => handleRemove(task.id)}>Eliminar</button>
        </li>
      ))}
      {/* Input con ref para auto-focus */}
      <input ref={inputRef} style={{ opacity: 0, position: 'absolute' }} readOnly />
    </ul>
  )
}

export default TaskList
