// ============================================================
// Hook personalizado: useDebounce
// Retrasa la actualización de un valor para evitar llamadas
// excesivas a la API mientras el usuario escribe.
// ============================================================
import { useState, useEffect } from 'react'

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    // Cleanup: cancela el timer si el valor cambia antes de que expire
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
