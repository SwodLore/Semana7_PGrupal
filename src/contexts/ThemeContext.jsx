// ============================================================
// PERSONA 2 — Ingeniero de Efectos & Contexto
// TODO: Implementar useContext + useEffect para tema claro/oscuro
// ============================================================
import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // TODO: Inicializar leyendo localStorage.getItem('theme') o usar 'light' por defecto
  const [theme, setTheme] = useState('light')

  // TODO: useEffect para aplicar clase al <body> cuando cambie el tema
  //   document.body.className = theme
  //   Cleanup: return () => { document.body.className = '' }

  // TODO: useEffect para persistir el tema en localStorage cuando cambie
  //   localStorage.setItem('theme', theme)

  // TODO: toggleTheme que alterne entre 'light' y 'dark'
  const toggleTheme = () => {}

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
