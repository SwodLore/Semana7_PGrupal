// ============================================================
// PERSONA 1 — Arquitecto de Estado
// Hooks: useReducer, useState, useContext, useCallback
// ============================================================
import { useReducer, useContext, useState, useCallback } from 'react'
import moviesReducer, { ACTION_TYPES, GENRES, initialState } from './hooks/useMoviesReducer'
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'
import MovieList from './components/MovieList'

const GENRE_ICONS = {
  'Acción':     '💥', 'Comedia':    '😂', 'Drama':      '🎭',
  'Terror':     '👻', 'Sci-Fi':     '🚀', 'Animación':  '🎨',
  'Documental': '🎙️', 'Romance':    '💕',
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

  // search es estado UI local — no necesita ir al reducer
  const [search, setSearch] = useState('')

  // ── Handlers con useCallback ──────────────────────────────
  const handleAdd = useCallback(() => {
    if (!title.trim()) return
    dispatch({ type: ACTION_TYPES.ADD, payload: title.trim(), genre, rating })
    setTitle('')
    setRating(3)
  }, [title, genre, rating])

  // useCallback crítico: estos handlers se pasan como props a MovieList
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

  // ── Stats ─────────────────────────────────────────────────
  const watchedCount = state.items.filter((m) => m.watched).length
  const pendingCount = state.items.length - watchedCount

  return (
    <div className={`app ${theme}`}>

      {/* ── Header ── */}
      <header className="header">
        <div className="header-brand">
          <span className="brand-icon">🎬</span>
          <div>
            <h1 className="brand-title">CineTracker</h1>
            <p className="brand-sub">Tu watchlist personal</p>
          </div>
        </div>
        <button onClick={toggleTheme} className="btn-theme">
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </header>

      <main className="main">

        {/* ── Stats ── */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-number">{state.items.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card stat-watched">
            <span className="stat-number">{watchedCount}</span>
            <span className="stat-label">✅ Vistas</span>
          </div>
          <div className="stat-card stat-pending">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">⏳ Pendientes</span>
          </div>
          {state.items.length > 0 && (
            <div className="stat-card stat-progress">
              <span className="stat-number">
                {Math.round((watchedCount / state.items.length) * 100)}%
              </span>
              <span className="stat-label">Completado</span>
            </div>
          )}
        </div>

        {/* ── Buscador ── */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en tu watchlist..."
            className="search-input"
            aria-label="Buscar películas"
          />
          {search && (
            <button className="btn-clear-search" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* ── Formulario agregar ── */}
        <div className="add-form">
          <p className="add-form-title">+ Agregar a la watchlist</p>
          <div className="add-form-fields">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Título de la película o serie..."
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
            <div className="rating-row">
              <span className="rating-label">Rating:</span>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <button onClick={handleAdd} className="btn-add">
              + Agregar
            </button>
          </div>
        </div>

        {/* ── Filtros y ordenamiento ── */}
        <div className="toolbar">
          <div className="filter-tabs">
            {[
              { value: 'all',     label: 'Todas',      count: state.items.length },
              { value: 'pending', label: 'Pendientes', count: pendingCount },
              { value: 'watched', label: 'Vistas',     count: watchedCount },
            ].map(({ value, label, count }) => (
              <button
                key={value}
                onClick={() => handleFilter(value)}
                className={`tab ${state.filter === value ? 'active' : ''}`}
              >
                {label}
                <span className="tab-count">{count}</span>
              </button>
            ))}
          </div>

          <div className="sort-controls">
            <select
              value={state.genre}
              onChange={(e) => handleFilterGenre(e.target.value)}
              className="select-field"
              aria-label="Filtrar por género"
            >
              <option value="all">🎬 Género</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{GENRE_ICONS[g]} {g}</option>
              ))}
            </select>
            <select
              value={state.sort}
              onChange={(e) => handleSort(e.target.value)}
              className="select-field"
              aria-label="Ordenar"
            >
              <option value="rating">⭐ Mayor rating</option>
              <option value="title-asc">🔤 A → Z</option>
              <option value="title-desc">🔤 Z → A</option>
            </select>
          </div>
        </div>

        {/* ── Lista ── */}
        {state.items.length === 0 ? (
          <div className="empty-state">
            <p className="empty-icon">🍿</p>
            <p className="empty-title">Tu watchlist está vacía</p>
            <p className="empty-sub">Agrega tu primera película o serie arriba</p>
          </div>
        ) : (
          <MovieList
            movies={state.items}
            filter={state.filter}
            genre={state.genre}
            sort={state.sort}
            search={search}
            onRemove={handleRemove}
            onToggle={handleToggle}
          />
        )}

      </main>
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
