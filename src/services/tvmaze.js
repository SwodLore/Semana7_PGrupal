const BASE_URL = 'https://api.tvmaze.com'

// Mapeo de géneros TVMaze → géneros del proyecto
const GENRE_MAP = {
  'Action':           'Acción',
  'Action-Adventure': 'Acción',
  'Adventure':        'Acción',
  'Comedy':           'Comedia',
  'Drama':            'Drama',
  'Horror':           'Terror',
  'Thriller':         'Terror',
  'Crime':            'Drama',
  'Mystery':          'Drama',
  'Science-Fiction':  'Sci-Fi',
  'Fantasy':          'Sci-Fi',
  'Anime':            'Animación',
  'Animation':        'Animación',
  'Documentary':      'Documental',
  'Reality':          'Documental',
  'Romance':          'Romance',
}

export function mapShow(show) {
  const tvGenre = show.genres?.[0]
  const genre   = GENRE_MAP[tvGenre] || 'Drama'
  const raw     = show.rating?.average
  const rating  = raw ? Math.max(1, Math.min(5, Math.round(raw / 2))) : 3
  const year    = show.premiered?.slice(0, 4) || ''
  const image   = show.image?.medium || null

  return { title: show.name, genre, rating, image, year }
}

export async function searchShows(query, signal) {
  const url = `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`
  const res = await fetch(url, { signal })
  if (!res.ok) throw new Error(`TVMaze error ${res.status}`)
  const data = await res.json()
  return data.slice(0, 7).map(({ show }) => ({ id: show.id, ...mapShow(show) }))
}
