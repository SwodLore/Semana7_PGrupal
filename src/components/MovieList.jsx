// ============================================================
// PERSONA 3 — Optimizador de Rendimiento
// TODO: Implementar useMemo, useCallback, useRef, useEffect
// ============================================================
import { useMemo, useCallback, useRef, useEffect } from 'react'

const MovieList = ({ movies, filter, genre, sort, onRemove, onToggle }) => {

  // TODO: useRef para referenciar el input del formulario en App y hacer auto-focus
  const topRef = useRef(null)

  // TODO: useMemo — calcular processedMovies sin recalcular en cada render
  // Solo recalcular cuando cambien: movies, filter, genre, sort
  //
  // Pasos:
  //   1. Filtrar por watched: filter==='watched' → solo watched, 'pending' → !watched
  //   2. Filtrar por género: genre !== 'all' → solo los que coincidan
  //   3. Ordenar:
  //        sort === 'rating'     → mayor rating primero (b.rating - a.rating)
  //        sort === 'title-asc'  → A→Z (a.title.localeCompare(b.title))
  //        sort === 'title-desc' → Z→A (b.title.localeCompare(a.title))
  const processedMovies = useMemo(() => {
    // TODO: implementar filtro y ordenamiento
    return movies
  }, [movies, filter, genre, sort])

  // TODO: useCallback para estabilizar handleRemove pasado a cada item
  // Sin useCallback, la referencia cambia en cada render y re-renderiza toda la lista
  const handleRemove = useCallback((id) => {
    onRemove(id)
  }, [onRemove])

  // TODO: useCallback para handleToggle
  const handleToggle = useCallback((id) => {
    onToggle(id)
  }, [onToggle])

  // TODO: useEffect — hacer scroll al top cuando se agrega una nueva película
  // Dependencia: movies.length
  useEffect(() => {
    // topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [movies.length])

  return (
    <ul className="movie-list" ref={topRef}>
      {processedMovies.map((movie) => (
        <li key={movie.id} className={`movie-item ${movie.watched ? 'watched' : ''}`}>

          <div className="movie-info">
            <span
              className="movie-title"
              onClick={() => handleToggle(movie.id)}
              title="Click para marcar como visto/pendiente"
            >
              {movie.title}
            </span>
            <span className="movie-genre">{movie.genre}</span>
          </div>

          <div className="movie-meta">
            <span className="movie-rating">
              {'★'.repeat(movie.rating)}{'☆'.repeat(5 - movie.rating)}
            </span>
            <span className={`movie-status ${movie.watched ? 'status-watched' : 'status-pending'}`}>
              {movie.watched ? '✅ Visto' : '⏳ Pendiente'}
            </span>
            <button
              onClick={() => handleRemove(movie.id)}
              className="btn-remove"
              aria-label={`Eliminar ${movie.title}`}
            >
              🗑
            </button>
          </div>

        </li>
      ))}
    </ul>
  )
}

export default MovieList
