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

  // Filtro + búsqueda + orden memoizado: sólo recalcula cuando cambia alguna dep
  const processedMovies = useMemo(() => {
    let list = movies

    if (filter === 'watched') list = list.filter((m) => m.watched)
    else if (filter === 'pending') list = list.filter((m) => !m.watched)

    if (genre !== 'all') list = list.filter((m) => m.genre === genre)

    const term = search.trim().toLowerCase()
    if (term) list = list.filter((m) => m.title.toLowerCase().includes(term))

    const sorted = [...list]
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating)
    else if (sort === 'title-asc') sorted.sort((a, b) => a.title.localeCompare(b.title))
    else if (sort === 'title-desc') sorted.sort((a, b) => b.title.localeCompare(a.title))

    return sorted
  }, [movies, filter, genre, sort, search])

  const handleRemove = useCallback((id) => onRemove(id), [onRemove])
  const handleToggle = useCallback((id) => onToggle(id), [onToggle])

  // Scroll al top cuando se agrega/elimina una película
  useEffect(() => {
    listRef.current?.scrollTo?.({ top: 0, behavior: 'smooth' })
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
