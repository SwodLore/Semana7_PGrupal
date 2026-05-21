// ============================================================
// PERSONA 3 — Optimizador de Rendimiento
// Hooks: useMemo, useCallback, useRef, useEffect
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

  // useMemo: recalcula solo cuando cambia movies, filter, genre, sort o search
  const processedMovies = useMemo(() => {
    const q = search.trim().toLowerCase()

    const filtered = movies.filter((m) => {
      if (filter === 'watched' && !m.watched) return false
      if (filter === 'pending' &&  m.watched) return false
      if (genre !== 'all' && m.genre !== genre) return false
      if (q && !m.title.toLowerCase().includes(q)) return false
      return true
    })

    return [...filtered].sort((a, b) => {
      if (sort === 'rating')      return b.rating - a.rating
      if (sort === 'title-desc')  return b.title.localeCompare(a.title)
      return a.title.localeCompare(b.title)
    })
  }, [movies, filter, genre, sort, search])

  // useCallback: referencia estable → evita re-render de cada item
  const handleRemove = useCallback((id) => onRemove(id), [onRemove])
  const handleToggle = useCallback((id) => onToggle(id), [onToggle])

  // useEffect: scroll suave al agregar nueva película
  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [movies.length])

  if (processedMovies.length === 0) {
    return <div className="no-results"><p>🔍 Sin resultados para los filtros aplicados</p></div>
  }

  return (
    <ul className="movie-list" ref={listRef}>
      {processedMovies.map((movie) => {
        const color = GENRE_COLORS[movie.genre] ?? '#6366f1'
        return (
          <li key={movie.id} className={`movie-card ${movie.watched ? 'watched' : ''}`}>

            {/* Poster */}
            <div className="wl-poster">
              {movie.image
                ? <img src={movie.image} alt={movie.title} loading="lazy" />
                : (
                  <div className="wl-poster-placeholder" style={{ background: `${color}33` }}>
                    <span>{GENRE_ICONS[movie.genre] ?? '🎬'}</span>
                  </div>
                )
              }
            </div>

            {/* Barra de color por género */}
            <div className="wl-genre-bar" style={{ background: color }} />

            {/* Info */}
            <div className="wl-info">
              <div className="wl-top">
                <div className="wl-title-row">
                  <span className="wl-title" onClick={() => handleToggle(movie.id)} title="Marcar visto / pendiente">
                    {movie.title}
                  </span>
                  {movie.year && <span className="wl-year">{movie.year}</span>}
                </div>
                <span className={`wl-status ${movie.watched ? 'status-w' : 'status-p'}`}>
                  {movie.watched ? '✅ Visto' : '⏳ Pendiente'}
                </span>
              </div>
              <div className="wl-bottom">
                <span className="wl-genre-tag" style={{ color, borderColor: `${color}55`, background: `${color}15` }}>
                  {GENRE_ICONS[movie.genre]} {movie.genre}
                </span>
                <span className="wl-stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={i < movie.rating ? 'sf' : 'se'}>★</span>
                  ))}
                </span>
                <button onClick={() => handleRemove(movie.id)} className="wl-btn-remove" aria-label={`Eliminar ${movie.title}`}>
                  🗑
                </button>
              </div>
            </div>

          </li>
        )
      })}
    </ul>
  )
}

export default MovieList
