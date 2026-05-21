// ============================================================
// PERSONA 2 — Ingeniero de Efectos & Contexto
// Hook Personalizado: useLocalStorage
// TODO: Implementar hook que sincronice estado con localStorage
// ============================================================
import { useState, useEffect } from 'react'

// Recibe (key, defaultValue), retorna [value, setValue] igual que useState
export const useLocalStorage = (key, defaultValue) => {
  // TODO: Inicializar con useState leyendo localStorage.getItem(key)
  // Usar JSON.parse con try/catch por si el valor guardado es inválido
  const [value, setValue] = useState(defaultValue)

  // TODO: useEffect que escuche cambios de `value` y escriba en localStorage
  // localStorage.setItem(key, JSON.stringify(value))
  // Incluir [key, value] en el array de dependencias

  return [value, setValue]
}
