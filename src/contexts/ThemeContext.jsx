import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Inicializamos leyendo localStorage; si no hay nada guardado, usamos 'light'
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  )

  useEffect(() => {
    document.body.className = theme
    return () => {
      document.body.className = ''
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem('theme', theme)
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