// ============================================================
// PERSONA 3 — Optimizador de Rendimiento
// TODO: completar useMemo (filtro + orden + búsqueda)
// ============================================================
import { useMemo, useCallback, useRef, useEffect } from 'react'

const GENRE_COLORS = {
  'Acción':'#ef4444','Comedia':'#f59e0b','Drama':'#6366f1',
  'Terror':'#7c3aed','Sci-Fi':'#06b6d4','Animación':'#ec4899',
  'Documental':'#10b981','Romance':'#f97316',
}
const GENRE_ICONS = {
  'Acción':'💥','Comedia':'😂','Drama':'🎭','Terror':'👻',
  'Sci-Fi':'🚀','Animación':'🎨','Documental':'🎙️','Romance':'💕',
}

const MovieList = ({ movies, filter, genre, sort, search, onRemove, onToggle }) => {
  const listRef = useRef(null)

  // TODO (Persona 3): implementar el filtro y ordenamiento
  // Pasos:
  //  1. filter: 'watched' → solo m.watched | 'pending' → !m.watched
  //  2. genre:  !== 'all' → m.genre === genre
  //  3. search: buscar en m.title.toLowerCase() si search no está vacío
  //  4. sort:   'rating' → b.rating-a.rating | 'title-asc' → localeCompare | 'title-desc' → invertido
  const processedMovies = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    const filteredMovies = movies.filter((movie) => {
      if (filter === 'watched' && !movie.watched) return false
      if (filter === 'pending' && movie.watched) return false
      if (genre !== 'all' && movie.genre !== genre) return false
      if (normalizedSearch && !movie.title.toLowerCase().includes(normalizedSearch)) return false
      return true
    })

    return [...filteredMovies].sort((movieA, movieB) => {
      if (sort === 'rating') {
        return movieB.rating - movieA.rating
      }

      const titleComparison = movieA.title.localeCompare(movieB.title)
      return sort === 'title-desc' ? -titleComparison : titleComparison
    })
  }, [movies, filter, genre, sort, search])

  const handleRemove = useCallback((id) => onRemove(id), [onRemove])
  const handleToggle = useCallback((id) => onToggle(id), [onToggle])

  // TODO (Persona 3): useEffect — scroll al top cuando se agrega una película
  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [movies.length])

  if (processedMovies.length === 0) {
    return <div className="no-results"><p>🔍 Sin resultados para los filtros aplicados</p></div>
  }

  return (
    <ul className="movie-list" ref={listRef}>
      {processedMovies.map((movie) => (
        <li
          key={movie.id}
          className={`movie-card ${movie.watched ? 'watched' : ''}`}
          style={{ '--genre-color': GENRE_COLORS[movie.genre] ?? '#6366f1' }}
        >
          {/* Poster */}
          <div className="movie-poster">
            {movie.image
              ? <img src={movie.image} alt={movie.title} loading="lazy" />
              : <span className="poster-placeholder">{GENRE_ICONS[movie.genre] ?? '🎬'}</span>
            }
          </div>

          {/* Info */}
          <div className="movie-card-body">
            <div className="movie-card-top">
              <div className="movie-title-row">
                <span
                  className="movie-title"
                  onClick={() => handleToggle(movie.id)}
                  title="Click para marcar visto / pendiente"
                >
                  {movie.title}
                </span>
                {movie.year && <span className="movie-year">{movie.year}</span>}
              </div>
              <span className={`status-badge ${movie.watched ? 'status-watched' : 'status-pending'}`}>
                {movie.watched ? '✅ Visto' : '⏳ Pendiente'}
              </span>
            </div>

            <div className="movie-card-bottom">
              <span className="genre-tag">{GENRE_ICONS[movie.genre]} {movie.genre}</span>
              <span className="movie-stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < movie.rating ? 'star-filled' : 'star-empty'}>★</span>
                ))}
              </span>
              <button onClick={() => handleRemove(movie.id)} className="btn-remove" aria-label={`Eliminar ${movie.title}`}>
                🗑
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default MovieList
