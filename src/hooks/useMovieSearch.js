// ============================================================
// Hook personalizado: useMovieSearch
// Busca en TVMaze con debounce y manejo de race conditions.
// ============================================================
import { useState, useEffect } from 'react'
import { searchShows } from '../services/tvmaze'
import { useDebounce } from './useDebounce'

export function useMovieSearch(query) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const debouncedQuery = useDebounce(query, 400)

  // Si el query está vacío exponemos resultados vacíos sin tocar estado.
  // Esto evita setResults([]) síncrono dentro del effect (regla set-state-in-effect).
  const trimmed = debouncedQuery.trim()
  const exposedResults = trimmed ? results : []

  useEffect(() => {
    if (!trimmed) return

    // AbortController para cancelar fetch si el usuario sigue escribiendo.
    // setLoading/setResults dentro del effect son necesarios para sincronizar
    // React con la API externa (fetch). Patrón estándar de data-fetching.
    const controller = new AbortController()
    let cancelled = false
    // Patrón estándar de fetching: marcar loading/error antes de iniciar
    // la llamada async. Es la sincronización legítima de React con un
    // sistema externo (HTTP), por lo que silenciamos la regla en estas 2 líneas.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError(null)

    searchShows(trimmed, controller.signal)
      .then((data) => {
        if (cancelled) return
        setResults(data)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled || err.name === 'AbortError') return
        setError('No se pudo conectar con TVMaze')
        setLoading(false)
      })

    // Cleanup: aborta fetch y marca cancelled para evitar setState tras unmount.
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [trimmed])

  return { results: exposedResults, loading: trimmed ? loading : false, error }
}
