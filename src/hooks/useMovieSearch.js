// ============================================================
// Hook personalizado: useMovieSearch
// Busca en TVMaze con debounce y manejo de race conditions.
// ============================================================
import { useState, useEffect } from 'react'
import { searchShows } from '../services/tvmaze'
import { useDebounce } from './useDebounce'

export function useMovieSearch(query) {
  const [results, setResults] = useState([])

  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      return
    }

    // AbortController para cancelar fetch si el usuario sigue escribiendo
    const controller = new AbortController()

    searchShows(debouncedQuery, controller.signal)
      .then((data) => {
        setResults(data)
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setResults([])
        }
      })

    // Cleanup: aborta el fetch si el query cambia antes de que termine
    return () => controller.abort()
  }, [debouncedQuery])

  return { results, loading: debouncedQuery.trim() !== '' && results.length === 0 }
}
