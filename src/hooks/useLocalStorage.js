// ============================================================
// PERSONA 2 — Ingeniero de Efectos & Contexto
// Hook Personalizado: useLocalStorage
// TODO: Implementar hook que sincronice estado con localStorage
// ============================================================
import { useState, useEffect } from 'react'

// Uso esperado en el proyecto:
//   const [watchlist, setWatchlist] = useLocalStorage('cinetracker-watchlist', [])
//   const [theme, setTheme]         = useLocalStorage('cinetracker-theme', 'light')
//
// Recibe (key, defaultValue), retorna [value, setValue] igual que useState

export const useLocalStorage = (key, defaultValue) => {
  // TODO: inicializar con useState usando una función lazy (evita leer localStorage en cada render)
  //   intentar JSON.parse(localStorage.getItem(key))
  //   si falla o no existe → devolver defaultValue
  const [value, setValue] = useState(defaultValue)

  // TODO: useEffect que persista `value` en localStorage cada vez que cambie
  //   localStorage.setItem(key, JSON.stringify(value))
  //   Dependencias: [key, value]

  return [value, setValue]
}
