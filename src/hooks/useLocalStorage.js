import { useState, useEffect } from 'react'

// Recibe (key, defaultValue), retorna [value, setValue] igual que useState
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      // Si la clave no existe, getItem devuelve null → usamos defaultValue
      return stored !== null ? JSON.parse(stored) : defaultValue
    } catch {
      // Si JSON.parse falla, descartamos el valor corrupto y usamos el default
      return defaultValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}