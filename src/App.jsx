// ============================================================
// PERSONA 1 — Arquitecto de Estado
// Hooks: useReducer, useState, useContext, useCallback
// ============================================================
import { useReducer, useContext, useState, useCallback } from 'react'
import moviesReducer, { ACTION_TYPES, GENRES, initialState } from './hooks/useMoviesReducer'
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'
import MovieList from './components/MovieList'

const GENRE_ICONS = {
  'Acción':      '💥',
  'Comedia':     '😂',
  'Drama':       '🎭',
  'Terror':      '👻',
  'Sci-Fi':      '🚀',
  'Animación':   '🎨',
  'Documental':  '🎙️',
  'Romance':     '💕',
}

// ── Componente de estrellas ──────────────────────────────────
const StarRating = ({ value, onChange }) => (
  <div className="star-rating" role="group" aria-label="Calificación">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`star ${star <= value ? 'filled' : ''}`}
        onClick={() => onChange(star)}
        aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
      >
        ★
      </button>
    ))}
  </div>
)

// ── Dashboard principal ──────────────────────────────────────
const Dashboard = () => {
  const [state, dispatch] = useReducer(moviesReducer, initialState)
  const { theme, toggleTheme } = useContext(ThemeContext)

  // Estado local de UI — no pertenece al estado global de la watchlist
  const [title, setTitle]   = useState('')
  const [genre, setGenre]   = useState('Drama')
  const [rating, setRating] = useState(3)

  // ── Handlers con useCallback ──────────────────────────────
  // handleRemove y handleToggle usan useCallback porque se pasan
  // como props a MovieList — sin esto, Persona 3's useCallback es inútil.
  const handleAdd = useCallback(() => {
    if (!title.trim()) return
    dispatch({ type: ACTION_TYPES.ADD, payload: title.trim(), genre, rating })
    setTitle('')
    setRating(3)
  }, [title, genre, rating])

  const handleRemove = useCallback(
    (id) => dispatch({ type: ACTION_TYPES.REMOVE, payload: id }),
    []
  )

  const handleToggle = useCallback(
    (id) => dispatch({ type: ACTION_TYPES.TOGGLE, payload: id }),
    []
  )

  const handleFilter = useCallback(
    (value) => dispatch({ type: ACTION_TYPES.FILTER, payload: value }),
    []
  )

  const handleFilterGenre = useCallback(
    (value) => dispatch({ type: ACTION_TYPES.FILTER_GENRE, payload: value }),
    []
  )

  const handleSort = useCallback(
    (value) => dispatch({ type: ACTION_TYPES.SORT, payload: value }),
    []
  )

  // ── Stats del estado ──────────────────────────────────────
  const watchedCount  = state.items.filter((m) => m.watched).length
  const pendingCount  = state.items.length - watchedCount

  return (
    <div className={`dashboard ${theme}`}>

      {/* ── Header ── */}
      <header className="dashboard-header">
        <div className="header-title">
          <span className="header-icon">🎬</span>
          <h1>CineTracker</h1>
        </div>
        <button onClick={toggleTheme} className="btn-theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      {/* ── Stats ── */}
      <div className="stats-bar">
        <span className="stat">🎞️ Total <strong>{state.items.length}</strong></span>
        <span className="stat">✅ Vistas <strong>{watchedCount}</strong></span>
        <span className="stat">⏳ Pendientes <strong>{pendingCount}</strong></span>
      </div>

      {/* ── Formulario agregar ── */}
      <div className="add-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Nombre de película o serie..."
          className="input-title"
          aria-label="Título"
        />
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="select-field"
          aria-label="Género"
        >
          {GENRES.map((g) => (
            <option key={g} value={g}>{GENRE_ICONS[g]} {g}</option>
          ))}
        </select>
        <StarRating value={rating} onChange={setRating} />
        <button onClick={handleAdd} className="btn-add">+ Agregar</button>
      </div>

      {/* ── Filtros y ordenamiento ── */}
      <div className="toolbar">
        <div className="filter-group">
          {[
            { value: 'all',     label: `Todas (${state.items.length})` },
            { value: 'watched', label: `Vistas (${watchedCount})` },
            { value: 'pending', label: `Pendientes (${pendingCount})` },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => handleFilter(value)}
              className={state.filter === value ? 'active' : ''}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="sort-group">
          <select
            value={state.genre}
            onChange={(e) => handleFilterGenre(e.target.value)}
            className="select-field"
            aria-label="Filtrar por género"
          >
            <option value="all">🎬 Todos los géneros</option>
            {GENRES.map((g) => (
              <option key={g} value={g}>{GENRE_ICONS[g]} {g}</option>
            ))}
          </select>

          <select
            value={state.sort}
            onChange={(e) => handleSort(e.target.value)}
            className="select-field"
            aria-label="Ordenar por"
          >
            <option value="rating">⭐ Mayor rating</option>
            <option value="title-asc">🔤 Título A→Z</option>
            <option value="title-desc">🔤 Título Z→A</option>
          </select>
        </div>
      </div>

      {/* ── Lista ── */}
      {state.items.length === 0 ? (
        <div className="empty-state">
          <p>🍿 Tu watchlist está vacía</p>
          <small>Agrega tu primera película arriba</small>
        </div>
      ) : (
        <MovieList
          movies={state.items}
          filter={state.filter}
          genre={state.genre}
          sort={state.sort}
          onRemove={handleRemove}
          onToggle={handleToggle}
        />
      )}

    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  )
}
