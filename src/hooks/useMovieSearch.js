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

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    // AbortController para cancelar fetch si el usuario sigue escribiendo
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    searchShows(debouncedQuery, controller.signal)
      .then((data) => {
        setResults(data)
        setLoading(false)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError('No se pudo conectar con TVMaze')
          setLoading(false)
        }
      })

    // Cleanup: aborta el fetch si el query cambia antes de que termine
    return () => controller.abort()
  }, [debouncedQuery])

  return { results, loading, error }
}
