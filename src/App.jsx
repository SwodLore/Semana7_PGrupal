// ============================================================
// PERSONA 1 — Arquitecto de Estado
// Hooks: useReducer, useState, useContext, useCallback, useMemo
// ============================================================
import { useReducer, useContext, useState, useCallback, useMemo } from 'react'
import moviesReducer, { ACTION_TYPES, GENRES, initialState } from './hooks/useMoviesReducer'
import { ThemeProvider, ThemeContext } from './contexts/ThemeContext'
import { useMovieSearch } from './hooks/useMovieSearch'
import MovieList    from './components/MovieList'
import SearchResults from './components/SearchResults'

const GENRE_ICONS = {
  'Acción':'💥','Comedia':'😂','Drama':'🎭','Terror':'👻',
  'Sci-Fi':'🚀','Animación':'🎨','Documental':'🎙️','Romance':'💕',
}

// ── Dashboard ────────────────────────────────────────────────
const Dashboard = () => {
  const [state, dispatch] = useReducer(moviesReducer, initialState)
  const { theme, toggleTheme } = useContext(ThemeContext)

  const [apiQuery, setApiQuery] = useState('')
  const [search,   setSearch]   = useState('')

  const { results, loading } = useMovieSearch(apiQuery)

  // Set de tvmazeIds ya en la watchlist para mostrar "En tu lista"
  const watchlistIds = useMemo(
    () => new Set(state.items.map((m) => m.tvId).filter(Boolean)),
    [state.items]
  )

  // ── Agregar desde TVMaze ────────────────────────────────
  const handleSelect = useCallback((result) => {
    dispatch({
      type:    ACTION_TYPES.ADD,
      payload: result.title,
      genre:   result.genre,
      rating:  result.rating,
      image:   result.image,
      year:    result.year,
      tvId:    result.id,       // id de TVMaze para detectar duplicados
    })
    setApiQuery('')
  }, [])

  // ── Handlers watchlist ──────────────────────────────────
  const handleRemove = useCallback((id) => dispatch({ type: ACTION_TYPES.REMOVE, payload: id }), [])
  const handleToggle = useCallback((id) => dispatch({ type: ACTION_TYPES.TOGGLE, payload: id }), [])
  const handleFilter = useCallback((v) => dispatch({ type: ACTION_TYPES.FILTER, payload: v }), [])
  const handleFilterGenre = useCallback((v) => dispatch({ type: ACTION_TYPES.FILTER_GENRE, payload: v }), [])
  const handleSort = useCallback((v) => dispatch({ type: ACTION_TYPES.SORT, payload: v }), [])

  const watchedCount = state.items.filter((m) => m.watched).length
  const pendingCount = state.items.length - watchedCount
  const isSearching  = apiQuery.trim().length > 0

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

        {/* ── Buscador principal TVMaze ── */}
        <div className="hero-search">
          <p className="hero-label">Busca una película o serie para agregarla</p>
          <div className="search-wrap">
            <span className="search-icon-abs">🔍</span>
            <input
              value={apiQuery}
              onChange={(e) => setApiQuery(e.target.value)}
              placeholder="Ej: Dune, Breaking Bad, Avatar..."
              className="hero-input"
              aria-label="Buscar en TVMaze"
              autoComplete="off"
            />
            {apiQuery && (
              <button className="btn-clear" onClick={() => setApiQuery('')}>✕</button>
            )}
          </div>
        </div>

        {/* ── Resultados TVMaze (cuando se busca) ── */}
        {isSearching && (
          <SearchResults
            results={results}
            loading={loading}
            query={apiQuery}
            onAdd={handleSelect}
            watchlistIds={watchlistIds}
          />
        )}

        {/* ── Watchlist ── */}
        {!isSearching && (
          <>
            {/* Stats */}
            {state.items.length > 0 && (
              <div className="stats-row">
                {[
                  { num: state.items.length,   label: 'Total',       cls: '' },
                  { num: watchedCount,          label: '✅ Vistas',   cls: 'stat-watched' },
                  { num: pendingCount,          label: '⏳ Pendiente', cls: 'stat-pending' },
                  { num: `${Math.round((watchedCount / state.items.length) * 100)}%`, label: 'Completado', cls: 'stat-progress' },
                ].map(({ num, label, cls }) => (
                  <div key={label} className={`stat-card ${cls}`}>
                    <span className="stat-number">{num}</span>
                    <span className="stat-label">{label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Filtro dentro de watchlist */}
            {state.items.length > 0 && (
              <>
                <div className="search-bar">
                  <span className="search-icon-abs">📋</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar en tu watchlist..."
                    className="hero-input"
                    aria-label="Filtrar watchlist"
                  />
                  {search && (
                    <button className="btn-clear" onClick={() => setSearch('')}>✕</button>
                  )}
                </div>

                <div className="toolbar">
                  <div className="filter-tabs">
                    {[
                      { v: 'all',     l: 'Todas',      n: state.items.length },
                      { v: 'pending', l: 'Pendientes', n: pendingCount },
                      { v: 'watched', l: 'Vistas',     n: watchedCount },
                    ].map(({ v, l, n }) => (
                      <button key={v} onClick={() => handleFilter(v)}
                        className={`tab ${state.filter === v ? 'active' : ''}`}>
                        {l} <span className="tab-count">{n}</span>
                      </button>
                    ))}
                  </div>
                  <div className="sort-controls">
                    <select value={state.genre} onChange={(e) => handleFilterGenre(e.target.value)} className="select-field">
                      <option value="all">🎬 Género</option>
                      {GENRES.map((g) => <option key={g} value={g}>{GENRE_ICONS[g]} {g}</option>)}
                    </select>
                    <select value={state.sort} onChange={(e) => handleSort(e.target.value)} className="select-field">
                      <option value="rating">⭐ Mayor rating</option>
                      <option value="title-asc">🔤 A → Z</option>
                      <option value="title-desc">🔤 Z → A</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Lista o empty state */}
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
          </>
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
