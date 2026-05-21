// ============================================================
// PERSONA 2 — Ingeniero de Efectos & Contexto
// Hooks: useContext, useEffect, useState
// Persona 4 (QA) integró useLocalStorage para consumir el custom hook.
// ============================================================
import { createContext, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Custom hook: persiste el tema y devuelve [valor, setter] como useState.
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  // Sincroniza el tema con <body>. Cleanup limpia la clase al desmontar
  // el provider o al cambiar theme (evita estilos residuales).
  useEffect(() => {
    document.body.className = theme
    return () => {
      document.body.className = ''
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
