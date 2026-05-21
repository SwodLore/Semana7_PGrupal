// ============================================================
// PERSONA 2 — Ingeniero de Efectos & Contexto
// Hook Personalizado: useLocalStorage
// ============================================================
import { useState, useEffect } from 'react'

// Uso:  const [watchlist, setWatchlist] = useLocalStorage('cinetracker-watchlist', [])
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
