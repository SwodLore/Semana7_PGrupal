// ============================================================
// PERSONA 2 — Ingeniero de Efectos & Contexto
// TODO: Implementar useContext + useEffect
// ============================================================
import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // TODO: Inicializar estado leyendo localStorage ('theme') o usar 'light' por defecto
  const [theme, setTheme] = useState('light')

  // TODO: useEffect para aplicar clase al <body> cuando cambie el tema
  // document.body.className = theme
  // No olvidar el cleanup: return () => { document.body.className = '' }

  // TODO: useEffect para persistir el tema en localStorage cuando cambie
  // localStorage.setItem('theme', theme)

  // TODO: Función toggleTheme que alterne entre 'light' y 'dark'
  const toggleTheme = () => {}

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
