import { useCallback } from 'react'

const GENRE_COLORS = {
  'Acción':'#ef4444','Comedia':'#f59e0b','Drama':'#6366f1',
  'Terror':'#7c3aed','Sci-Fi':'#06b6d4','Animación':'#ec4899',
  'Documental':'#10b981','Romance':'#f97316',
}

// Skeleton mientras carga
const SkeletonCard = () => (
  <div className="search-card skeleton">
    <div className="search-card-img skeleton-img" />
    <div className="search-card-body">
      <div className="skeleton-line" style={{ width: '80%' }} />
      <div className="skeleton-line" style={{ width: '50%' }} />
    </div>
  </div>
)

const SearchResults = ({ results, loading, query, onAdd, watchlistIds }) => {
  const handleAdd = useCallback((result) => {
    onAdd(result)
  }, [onAdd])

  if (loading) {
    return (
      <section className="search-results-section">
        <p className="search-results-title">Buscando <strong>"{query}"</strong>…</p>
        <div className="search-results-grid">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </section>
    )
  }

  if (!results.length) return null

  return (
    <section className="search-results-section">
      <p className="search-results-title">
        Resultados para <strong>"{query}"</strong>
        <span className="results-count">{results.length} encontrados</span>
      </p>

      <div className="search-results-grid">
        {results.map((r) => {
          const inList = watchlistIds.has(r.id)
          const color  = GENRE_COLORS[r.genre] ?? '#6366f1'

          return (
            <div key={r.id} className={`search-card ${inList ? 'in-list' : ''}`}>

              {/* Poster */}
              <div className="search-card-img-wrap">
                {r.image
                  ? <img src={r.image} alt={r.title} loading="lazy" className="search-card-img" />
                  : (
                    <div className="search-card-img no-poster" style={{ background: `${color}22` }}>
                      <span className="no-poster-icon">🎬</span>
                    </div>
                  )
                }
                {/* Overlay al hover */}
                <div className="search-card-overlay">
                  {inList
                    ? <span className="btn-in-list">✅ En tu lista</span>
                    : (
                      <button className="btn-add-card" onClick={() => handleAdd(r)}>
                        + Agregar
                      </button>
                    )
                  }
                </div>
                {/* Badge de género */}
                <span className="genre-badge" style={{ background: color }}>
                  {r.genre}
                </span>
              </div>

              {/* Info debajo del poster */}
              <div className="search-card-body">
                <p className="search-card-title" title={r.title}>{r.title}</p>
                <div className="search-card-meta">
                  {r.year && <span className="meta-year">{r.year}</span>}
                  <span className="meta-stars">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < r.rating ? 'star-f' : 'star-e'}>★</span>
                    ))}
                  </span>
                </div>
              </div>

            </div>
          )
        })}
      </div>
    </section>
  )
}

export default SearchResults
