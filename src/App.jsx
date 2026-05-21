// ============================================================
// PERSONA 1 — Arquitecto de Estado
// Hooks: useReducer, useState, useContext, useCallback, useRef
// ============================================================
import { useReducer, useContext, useState, useCallback, useRef, useEffect } from 'react'
import moviesReducer, { ACTION_TYPES, GENRES, initialState } from './hooks/useMoviesReducer'
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'
import { useMovieSearch } from './hooks/useMovieSearch'
import MovieList from './components/MovieList'

const GENRE_ICONS = {
  'Acción':'💥','Comedia':'😂','Drama':'🎭','Terror':'👻',
  'Sci-Fi':'🚀','Animación':'🎨','Documental':'🎙️','Romance':'💕',
}

// ── Componente estrellas ─────────────────────────────────────
const StarRating = ({ value, onChange }) => (
  <div className="star-rating" role="group" aria-label="Calificación">
    {[1,2,3,4,5].map((s) => (
      <button
        key={s} type="button"
        className={`star ${s <= value ? 'filled' : ''}`}
        onClick={() => onChange(s)}
        aria-label={`${s} estrella${s > 1 ? 's' : ''}`}
      >★</button>
    ))}
  </div>
)

// ── Dashboard ────────────────────────────────────────────────
const Dashboard = () => {
  const [state, dispatch] = useReducer(moviesReducer, initialState)
  const { theme, toggleTheme } = useContext(ThemeContext)

  // Estado local UI — formulario y buscador watchlist
  const [apiQuery, setApiQuery]   = useState('')  // búsqueda en TVMaze
  const [search,   setSearch]     = useState('')  // búsqueda en watchlist
  const [genre,    setGenre]      = useState('Drama')
  const [rating,   setRating]     = useState(3)
  const [showDrop, setShowDrop]   = useState(false)

  const inputRef    = useRef(null)
  const dropdownRef = useRef(null)

  // Hook que llama a TVMaze con debounce + cleanup de AbortController
  const { results, loading } = useMovieSearch(apiQuery)

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setShowDrop(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Mostrar dropdown cuando haya resultados
  useEffect(() => {
    setShowDrop(results.length > 0)
  }, [results])

  // ── Seleccionar resultado de TVMaze ──────────────────────
  const handleSelect = useCallback((result) => {
    dispatch({
      type:    ACTION_TYPES.ADD,
      payload: result.title,
      genre:   result.genre,
      rating:  result.rating,
      image:   result.image,
      year:    result.year,
    })
    setApiQuery('')
    setShowDrop(false)
    inputRef.current?.focus()
  }, [])

  // ── Agregar manual (sin API) ─────────────────────────────
  const handleAddManual = useCallback(() => {
    if (!apiQuery.trim()) return
    dispatch({ type: ACTION_TYPES.ADD, payload: apiQuery.trim(), genre, rating })
    setApiQuery('')
    setShowDrop(false)
  }, [apiQuery, genre, rating])

  // ── Handlers para la lista ───────────────────────────────
  const handleRemove = useCallback((id) => dispatch({ type: ACTION_TYPES.REMOVE, payload: id }), [])
  const handleToggle = useCallback((id) => dispatch({ type: ACTION_TYPES.TOGGLE, payload: id }), [])
  const handleFilter = useCallback((v) => dispatch({ type: ACTION_TYPES.FILTER, payload: v }), [])
  const handleFilterGenre = useCallback((v) => dispatch({ type: ACTION_TYPES.FILTER_GENRE, payload: v }), [])
  const handleSort = useCallback((v) => dispatch({ type: ACTION_TYPES.SORT, payload: v }), [])

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
          {[
            { num: state.items.length, label: '🎞️ Total',       cls: '' },
            { num: watchedCount,       label: '✅ Vistas',       cls: 'stat-watched' },
            { num: pendingCount,       label: '⏳ Pendientes',   cls: 'stat-pending' },
            ...(state.items.length > 0 ? [{
              num: `${Math.round((watchedCount / state.items.length) * 100)}%`,
              label: '🏁 Completado', cls: 'stat-progress',
            }] : []),
          ].map(({ num, label, cls }) => (
            <div key={label} className={`stat-card ${cls}`}>
              <span className="stat-number">{num}</span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>

        {/* ── Buscador TVMaze + dropdown ── */}
        <div className="search-api-wrap" ref={dropdownRef}>
          <div className="search-api-bar">
            <span className="search-icon">🔍</span>
            <input
              ref={inputRef}
              value={apiQuery}
              onChange={(e) => setApiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !showDrop && handleAddManual()}
              placeholder="Buscar película o serie para agregar..."
              className="search-input"
              aria-label="Buscar en TVMaze"
              autoComplete="off"
            />
            {loading && <span className="search-spinner">⏳</span>}
            {apiQuery && !loading && (
              <button className="btn-clear-search" onClick={() => { setApiQuery(''); setShowDrop(false) }}>✕</button>
            )}
          </div>

          {/* Dropdown resultados TVMaze */}
          {showDrop && (
            <ul className="api-dropdown">
              {results.map((r) => (
                <li key={r.id} className="api-result" onClick={() => handleSelect(r)}>
                  <div className="api-result-img">
                    {r.image
                      ? <img src={r.image} alt={r.title} />
                      : <span className="api-result-noimg">🎬</span>
                    }
                  </div>
                  <div className="api-result-info">
                    <span className="api-result-title">{r.title}</span>
                    <span className="api-result-meta">
                      {GENRE_ICONS[r.genre]} {r.genre}
                      {r.year && <> · {r.year}</>}
                      · {'⭐'.repeat(r.rating)}
                    </span>
                  </div>
                  <span className="api-result-add">+ Agregar</span>
                </li>
              ))}
              <li className="api-dropdown-footer">
                Resultados de <strong>TVMaze API</strong>
              </li>
            </ul>
          )}
        </div>

        {/* ── Género y rating para agregar manual ── */}
        <div className="manual-opts">
          <span className="manual-label">Agregar manual:</span>
          <select value={genre} onChange={(e) => setGenre(e.target.value)} className="select-field" aria-label="Género">
            {GENRES.map((g) => <option key={g} value={g}>{GENRE_ICONS[g]} {g}</option>)}
          </select>
          <StarRating value={rating} onChange={setRating} />
          <button onClick={handleAddManual} className="btn-add" disabled={!apiQuery.trim()}>+ Agregar</button>
        </div>

        {/* ── Buscador dentro de watchlist ── */}
        <div className="search-bar">
          <span className="search-icon">📋</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrar tu watchlist..."
            className="search-input"
            aria-label="Filtrar watchlist"
          />
          {search && (
            <button className="btn-clear-search" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        {/* ── Filtros y orden ── */}
        <div className="toolbar">
          <div className="filter-tabs">
            {[
              { v: 'all',     l: 'Todas',      n: state.items.length },
              { v: 'pending', l: 'Pendientes', n: pendingCount },
              { v: 'watched', l: 'Vistas',     n: watchedCount },
            ].map(({ v, l, n }) => (
              <button key={v} onClick={() => handleFilter(v)} className={`tab ${state.filter === v ? 'active' : ''}`}>
                {l} <span className="tab-count">{n}</span>
              </button>
            ))}
          </div>
          <div className="sort-controls">
            <select value={state.genre} onChange={(e) => handleFilterGenre(e.target.value)} className="select-field" aria-label="Filtrar género">
              <option value="all">🎬 Género</option>
              {GENRES.map((g) => <option key={g} value={g}>{GENRE_ICONS[g]} {g}</option>)}
            </select>
            <select value={state.sort} onChange={(e) => handleSort(e.target.value)} className="select-field" aria-label="Ordenar">
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
            <p className="empty-sub">Busca una película o serie arriba para agregarla</p>
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
