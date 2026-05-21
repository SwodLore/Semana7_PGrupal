# 🎬 CineTracker — Semana 7 Práctica 2

**Asignatura:** Desarrollo de Aplicaciones Web (IS093A)
**Tema:** React Hooks: `useState`, `useEffect`, `useContext`, `useRef`, `useReducer`, `useCallback`, `useMemo` y Hooks Personalizados

**INTEGRANTES:**
- Araujo Champi Jose Eduardo
- Melgarejo Guzman Renzo Gustavo
- Poves Martinez Alessando Piero
- Sulluchuco Vilcapoma Anyelo

---

## Proyecto: CineTracker — Watchlist de Películas / Series

Dashboard para gestionar una lista personal de películas y series:
- Buscar en **TVMaze API** con debounce y `AbortController`
- Agregar manualmente con género y rating de 1–5 ★
- Marcar como vista / pendiente, eliminar
- Filtrar: Todas / Pendientes / Vistas + por género
- Ordenar por rating, A→Z, Z→A
- Tema claro/oscuro persistido en `localStorage`
- Estadísticas en tiempo real (total, vistas, pendientes, % completado)

---

## Instalación y arranque

> Requisito: **Node.js** instalado (`node --version`).

```bash
# 1. Instalar dependencias
npm install           # o:  pnpm install

# 2. Desarrollo
npm run dev           # http://localhost:5173

# 3. Lint (objetivo: 0 warnings)
npm run lint

# 4. Build de producción
npm run build
```

---

## Estructura del proyecto

```
Semana7_PGrupal/
├── src/
│   ├── contexts/
│   │   └── ThemeContext.jsx       ← PERSONA 2 (consume useLocalStorage)
│   ├── hooks/
│   │   ├── useMoviesReducer.js    ← PERSONA 1
│   │   ├── useLocalStorage.js     ← PERSONA 2 (custom hook)
│   │   ├── useDebounce.js         ← custom hook auxiliar
│   │   └── useMovieSearch.js      ← custom hook (TVMaze + debounce + abort)
│   ├── components/
│   │   └── MovieList.jsx          ← PERSONA 3
│   ├── services/
│   │   └── tvmaze.js              ← cliente TVMaze
│   ├── App.jsx                    ← PERSONA 1 (Dashboard + useReducer)
│   ├── main.jsx
│   └── index.css
├── eslint.config.js               ← PERSONA 4
├── vite.config.js
└── package.json
```

---

## División de trabajo

### PERSONA 1 — Arquitecto de Estado (25%)
**Archivos:** `src/hooks/useMoviesReducer.js`, `src/App.jsx`
**Hooks:** `useReducer`, `useState`
- `ACTION_TYPES`: ADD, REMOVE, TOGGLE, FILTER, FILTER_GENRE, SORT
- Estado: `{ items, filter, genre, sort }` — actualizaciones **inmutables** con spread.

### PERSONA 2 — Ingeniero de Efectos & Contexto (20%)
**Archivos:** `src/contexts/ThemeContext.jsx`, `src/hooks/useLocalStorage.js`
**Hooks:** `useContext`, `useEffect`, `useState`
- `ThemeProvider` aplica `document.body.className` con **cleanup** y persiste el tema vía `useLocalStorage`.
- `useLocalStorage(key, defaultValue)` → API idéntica a `useState`, con lazy init + try/catch.

### PERSONA 3 — Optimizador de Rendimiento (20%)
**Archivo:** `src/components/MovieList.jsx`
**Hooks:** `useMemo`, `useCallback`, `useRef`, `useEffect`
- `useMemo` recalcula `processedMovies` (filter + genre + search + sort) solo cuando cambian sus dependencias.
- `useCallback` estabiliza `handleRemove` / `handleToggle` para `React.memo` futuro.
- `useRef` + `useEffect` hacen scroll al top cuando cambia `movies.length`.

### PERSONA 4 — QA & Hook Validator (15%)
**Archivos:** `eslint.config.js`, este `README.md`
**Responsabilidades:**
- ✅ ESLint en cero warnings de `react-hooks/exhaustive-deps`.
- ✅ Verificar **Reglas de Hooks** y cleanup en `useEffect`.
- ✅ Garantizar que el **custom hook** está integrado y es reutilizable.
- ✅ Documentar el flujo de estado, justificación técnica y métricas Profiler.
- ✅ Eliminar código muerto (`src/components/TaskList.jsx` del template inicial).

---

## ✅ Validación QA — Persona 4

### 1. Resultado de `npm run lint`

```bash
$ npm run lint

> dashboard-hooks@0.0.0 lint
> eslint src

# ── 0 errores, 0 warnings ──
```

Meta cumplida: **cero warnings de `react-hooks/exhaustive-deps`** y cero errores en todo el proyecto.

### 2. Refactors aplicados por QA

| Archivo | Problema detectado | Solución |
|---|---|---|
| `src/App.jsx` | `setShowDrop(results.length > 0)` dentro de `useEffect` → **set-state-in-effect** | Convertido a estado **derivado**: `const showDrop = !dismissed && apiQuery.trim() !== '' && results.length > 0`. Se eliminó el useState `showDrop` y el effect que lo seteaba. |
| `src/hooks/useMovieSearch.js` | `setResults([])` síncrono al limpiar query | Resultado **derivado**: se calcula `exposedResults = trimmed ? results : []` fuera del effect; el effect ya no necesita resetear. |
| `src/components/TaskList.jsx` | Código muerto del template inicial (no se importaba) + warning de deps | **Eliminado**. |
| `src/contexts/ThemeContext.jsx` | El custom hook `useLocalStorage` no estaba en uso (rúbrica 20%) | Refactorizado para que `ThemeProvider` **consuma** `useLocalStorage('theme', 'light')`. |
| `src/components/MovieList.jsx` | `useMemo` con deps innecesarias (warning) | Implementado el filtro/orden/búsqueda real para que cada dep se use. |

### 3. Reglas de Hooks — checklist verificado

- [x] **Solo en el nivel superior** del componente o custom hook (nunca en `if`, `for`, callbacks anidadas).
- [x] **Solo en componentes funcionales o custom hooks** (nombres en `useXxx`).
- [x] **Mismo orden de llamada** en cada render (no hay early returns antes de hooks).
- [x] **Arrays de dependencias completos** en `useEffect` / `useMemo` / `useCallback`.
- [x] **Cleanup activo** en todos los `useEffect` que se suscriben a algo:
  - `ThemeContext` → limpia `document.body.className`.
  - `App.jsx` → remueve `mousedown` listener.
  - `useDebounce` → `clearTimeout`.
  - `useMovieSearch` → `controller.abort()` + flag `cancelled`.

### 4. Verificación de cleanup de `useEffect`

En **React DevTools → Components**:
1. Desmontar el `ThemeProvider` (toggle del componente).
2. Confirmar en el inspector del `<body>` que **`className` queda vacío** — prueba que el cleanup `document.body.className = ''` se ejecutó.
3. Cambiar el tema rápidamente varias veces: no se acumulan listeners ni clases residuales.

En `useMovieSearch`:
- Escribir rápido en el buscador: el `AbortController.abort()` cancela los fetches anteriores antes de que terminen (verificable en pestaña Network → estado `cancelled`).

---

## 🔄 Diagrama de flujo de estado

### Máquina de estado del `moviesReducer`

El estado global vive en un único objeto manejado por `useReducer`:

```js
state = {
  items:  Movie[],        // [{ id, title, genre, rating, image, year, watched }]
  filter: 'all' | 'pending' | 'watched',
  genre:  'all' | <Género>,
  sort:   'rating' | 'title-asc' | 'title-desc',
}
```

**Transiciones (acciones → nuevo state):**

```
                     ┌─────────────────────┐
                     │   initialState      │
                     │ items:[], filter:   │
                     │ 'all', genre:'all', │
                     │ sort:'rating'       │
                     └──────────┬──────────┘
                                │
   ┌────────────┬───────────────┼───────────────┬────────────────┐
   ▼            ▼               ▼               ▼                ▼
 ADD          REMOVE          TOGGLE          FILTER /         SORT
 (title,      (id)            (id)            FILTER_GENRE     (value)
 genre,         │               │             (value)            │
 rating)       items =        items =           │              sort =
   │       filter(≠id)       map(toggle      filter =         value
   ▼            │             watched)       value             │
 items =        ▼               │               │              ▼
 [...items,   nuevo state     nuevo state     nuevo state    nuevo state
  {id:UUID,
   …,
   watched:false}]
   │
   ▼
 nuevo state  ← inmutabilidad: spread `{ ...state, items: [...] }`
```

### Ciclo completo de render (al agregar una película desde TVMaze)

```
 ┌────────────────────────────────────────────────────────────────────┐
 │ 1. Usuario teclea "breaking bad" en el buscador                    │
 │    → setApiQuery() + setDismissed(false)                           │
 └────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
 ┌────────────────────────────────────────────────────────────────────┐
 │ 2. useDebounce(400ms) retiene el valor                             │
 │    Cleanup: clearTimeout cada keystroke                            │
 └────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
 ┌────────────────────────────────────────────────────────────────────┐
 │ 3. useMovieSearch dispara fetch(TVMaze) con AbortController        │
 │    Cleanup: controller.abort() si query cambia antes de responder  │
 └────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
 ┌────────────────────────────────────────────────────────────────────┐
 │ 4. setResults(data) → re-render Dashboard                          │
 │    showDrop derivado = !dismissed && query && results.length>0     │
 └────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
 ┌────────────────────────────────────────────────────────────────────┐
 │ 5. Click en resultado → dispatch({ type: ADD, ...data })           │
 │    moviesReducer devuelve { ...state, items: [...items, newItem] } │
 └────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
 ┌────────────────────────────────────────────────────────────────────┐
 │ 6. Dashboard re-renderiza → MovieList recibe `movies` nuevo        │
 │    useMemo recalcula processedMovies (cambió `movies`)             │
 │    useCallback mantiene refs estables de handleRemove/handleToggle │
 │    useEffect([movies.length]) → scrollTo top                       │
 └────────────────────────────────────────────────────────────────────┘
```

**Resumen del ciclo de render:**
1. `handleSelect` → `dispatch({ type: 'ADD', ... })`
2. `moviesReducer` retorna nuevo `state` (spread inmutable).
3. `Dashboard` re-renderiza → `MovieList` recibe `movies` nuevo.
4. `useMemo` recalcula `processedMovies` (porque cambió `movies`).
5. `useEffect([movies.length])` ejecuta `scrollTo({ top: 0 })`.
6. Los handlers `useCallback` mantienen su referencia → React no rerendea los `<li>` vecinos innecesariamente.

---

## 🧠 Justificación técnica de cada hook

### Tabla resumen

| Hook | ¿Por qué no `useState` simple? |
|---|---|
| **`useReducer`** | `state` tiene **4 sub-valores** (`items`, `filter`, `genre`, `sort`) y las actualizaciones (`ADD`, `TOGGLE`, etc.) dependen del estado previo. Centralizar la lógica en un reducer evita bugs de inmutabilidad y hace los flujos testeables. |
| **`useContext`** | El tema (`theme`, `toggleTheme`) lo necesita el header y potencialmente cualquier subcomponente. Sin contexto habría **prop drilling** por toda la app. |
| **`useEffect`** | Sincroniza React con sistemas externos: DOM (`document.body.className`), `localStorage`, listeners (`mousedown`), HTTP (`fetch`). El **cleanup** evita memory leaks y race conditions. |
| **`useMemo`** | `processedMovies` aplica `filter`+`genre`+`search`+`sort` sobre el array completo. Sin memoización se recalcula en cada render, aunque sólo haya cambiado el tema o el foco del input. |
| **`useCallback`** | `handleRemove`, `handleToggle`, `handleSelect`, etc. se pasan como props. Estabilizar su referencia evita romper futuras optimizaciones con `React.memo` y mantiene las deps de hooks consumidores estables. |
| **`useRef`** | `inputRef` para auto-focus tras agregar y `dropdownRef` para detección de click-fuera. Persiste entre renders **sin** disparar uno nuevo — `useState` aquí causaría re-renders inútiles. |
| **`useLocalStorage`** (custom) | Encapsula el patrón repetitivo `useState(() => JSON.parse(localStorage…))` + `useEffect(() => localStorage.setItem(…))`. Lo consume `ThemeContext`, y queda **reutilizable** para cualquier preferencia futura. |
| **`useDebounce`** (custom) | Demora 400ms el query para no martillear la API de TVMaze mientras el usuario teclea. Reutilizable en cualquier input. |

### Comparativa "antes / después" (código real)

**`useReducer` vs múltiples `useState`** — si usáramos `useState` separados:

```jsx
// ❌ Sin useReducer: 4 estados sueltos, cada actualización es un punto de bug
const [items,  setItems]  = useState([])
const [filter, setFilter] = useState('all')
const [genre,  setGenre]  = useState('all')
const [sort,   setSort]   = useState('rating')
// ADD: setItems(prev => [...prev, newItem])   ← cada componente debe spread bien
// TOGGLE: setItems(prev => prev.map(...))     ← mutaciones accidentales fáciles

// ✅ Con useReducer: una sola transición declarativa
dispatch({ type: 'ADD', payload: title, genre, rating })
// El reducer impone inmutabilidad en un único lugar testeable.
```

**`useMemo` evita recalcular el filter+sort en cada render:**

```jsx
// Sin useMemo: filter+sort sobre N items se ejecuta en cada keystroke del tema
const processedMovies = movies.filter(...).sort(...)   // ❌ corre siempre

// Con useMemo: solo recalcula si cambian movies, filter, genre, sort o search
const processedMovies = useMemo(() =>
  movies.filter(...).sort(...),
  [movies, filter, genre, sort, search]
)                                                      // ✅ skip si no cambian deps
```

**`useCallback` mantiene refs estables para futuros `React.memo`:**

```jsx
// ❌ Sin useCallback: cada render crea nueva función → cada <MovieCard memo>
//    re-renderiza aunque sus props "lógicas" no cambien.
const handleRemove = (id) => dispatch({ type: 'REMOVE', payload: id })

// ✅ Con useCallback: mismo objeto función entre renders → React.memo funciona.
const handleRemove = useCallback((id) =>
  dispatch({ type: 'REMOVE', payload: id }), [])
```

**`useRef` vs `useState` para focus:**

```jsx
// ❌ Con useState: guardar el nodo dispara re-render extra
const [node, setNode] = useState(null)
<input ref={setNode} />
useEffect(() => { node?.focus() }, [node])

// ✅ Con useRef: cero re-renders, lectura imperativa del DOM
const inputRef = useRef(null)
<input ref={inputRef} />
inputRef.current?.focus()
```

**`useContext` vs prop drilling:**

```jsx
// ❌ Prop drilling: pasar theme/toggleTheme por todos los niveles
<App theme={t} toggle={f}>
  <Dashboard theme={t} toggle={f}>
    <Header theme={t} toggle={f} />

// ✅ useContext: cualquier descendiente lo consume directamente
const { theme, toggleTheme } = useContext(ThemeContext)
```

---

## 🛠️ Custom Hooks — API

### `useLocalStorage(key, defaultValue)`

```js
import { useLocalStorage } from './hooks/useLocalStorage'

const [theme, setTheme] = useLocalStorage('theme', 'light')
const [watchlist, setWatchlist] = useLocalStorage('cinetracker-watchlist', [])
```

- API idéntica a `useState`: retorna `[value, setValue]`.
- Lazy init lee `localStorage` solo en el primer render.
- `try/catch` protege contra JSON corrupto (fallback al `defaultValue`).
- `useEffect` con deps `[key, value]` re-sincroniza en cada cambio.

### `useDebounce(value, delay = 400)`

```js
const debouncedQuery = useDebounce(apiQuery, 400)
```

- Cleanup con `clearTimeout` cancela el timer si `value` cambia antes del delay.

### `useMovieSearch(query)`

```js
const { results, loading, error } = useMovieSearch(apiQuery)
```

- Combina `useDebounce` + `fetch` + `AbortController`.
- Cancela peticiones en vuelo cuando el query cambia.
- Flag interno `cancelled` evita setState tras unmount.

---

## 📊 React DevTools Profiler — métricas

### Cómo medir (protocolo de la sesión)

1. Instalar **React Developer Tools** (Chrome / Firefox).
2. `npm run dev` → abrir `http://localhost:5173`.
3. DevTools → ⚙ Settings → Profiler → ✅ **"Record why each component rendered"**.
4. Pestaña **⚛ Profiler** → ⏺ Record.
5. Ejecutar guión de interacción:
   - **(a)** Escribir "breaking" en el buscador (espera resultados TVMaze).
   - **(b)** Click en "Breaking Bad" → se agrega a la watchlist.
   - **(c)** Agregar 2 películas manuales con género/rating distintos.
   - **(d)** Cambiar filtro a `Pendientes`, luego a `Vistas`.
   - **(e)** Toggle theme 🌙 ↔ ☀️.
   - **(f)** Eliminar 1 película.
6. ⏹ Stop. Revisar pestañas **Flamegraph** y **Ranked**.

### Tabla de métricas (referencia esperada con `~5 items`)

| Interacción | Commits | Componentes que re-renderizan | Duración (ms aprox) | Observación |
|---|---:|---|---:|---|
| Keystroke en buscador (con debounce) | 1 | `Dashboard` (por `apiQuery`) | < 2 ms | `MovieList` **no** se re-renderiza |
| Llegada de resultados TVMaze | 1 | `Dashboard` (por `results`) | < 3 ms | Solo el dropdown renderiza items |
| Agregar película (`dispatch ADD`) | 1 | `Dashboard` + `MovieList` | 3–6 ms | `useMemo` recalcula `processedMovies` (justificado) |
| Toggle theme | 1 | `Dashboard`, `Header` (consume `ThemeContext`) | < 3 ms | `MovieList` **no** se re-renderiza (no consume context) |
| Cambiar filtro / orden | 1 | `Dashboard` + `MovieList` | 2–4 ms | `useMemo` recalcula con nuevo orden |
| Toggle `watched` de 1 item | 1 | `Dashboard` + `MovieList` | 2–4 ms | Sin `React.memo` en `<li>` todavía: oportunidad de mejora |
| Click outside (cerrar dropdown) | 1 | `Dashboard` (por `dismissed`) | < 1 ms | Sin efectos colaterales |

> Las cifras varían según hardware. Lo importante es la **relación** entre interacción y componentes que se renderizan: si `MovieList` se re-renderiza al togglear tema, hay un bug; si `processedMovies` se recalcula al teclear (antes del debounce), hay un bug.

### Capturas (insertar tras grabar la sesión)

```
docs/profiler-1-flamegraph.png   ← Flame graph completo de la sesión
docs/profiler-2-why-rendered.png ← "Why did this render?" en Dashboard
docs/profiler-3-ranked.png       ← Vista Ranked con duración por componente
docs/devtools-cleanup-body.png   ← <body class=""> tras desmontar ThemeProvider
docs/network-aborted-fetch.png   ← Network tab con requests "(canceled)" de TVMaze
```

Cuando las añadas:

```markdown
![Flamegraph del Profiler](docs/profiler-1-flamegraph.png)
![Why did this render](docs/profiler-2-why-rendered.png)
![Vista Ranked](docs/profiler-3-ranked.png)
![Cleanup del body](docs/devtools-cleanup-body.png)
![Fetch cancelado](docs/network-aborted-fetch.png)
```

### Criterios de aceptación (Profiler valida)

- ✅ `MovieList` **no** se re-renderiza al cambiar `theme` (no consume `ThemeContext`).
- ✅ `processedMovies` **no** se recalcula al cambiar sólo `apiQuery` (no es dep del `useMemo`).
- ✅ Al teclear rápido, los renders por keystroke son **<2 ms** porque el fetch está debounceado a 400 ms.
- ✅ Handlers (`useCallback`) mantienen la misma referencia entre renders consecutivos (verificable en "Why did this render?" → "Props did not change").
- ✅ Tras `dispatch(ADD)`, el flame graph muestra una sola cadena `Dashboard → MovieList → li…` sin re-render de `Header` ni `ThemeProvider`.

### Oportunidades de mejora detectadas con el Profiler

| Hallazgo | Acción recomendada |
|---|---|
| `<li>` (MovieCard inline) se re-renderiza al togglear cualquier item | Extraer `MovieCard` como componente y envolver en `React.memo`. Los `useCallback` ya están listos para esto. |
| `Header` se re-renderiza al cambiar `apiQuery` (recibe `theme` del padre) | Separar `Header` como consumidor directo de `ThemeContext`. |

---

## ✅ Checklist de entrega

- [x] `npm run dev` corre sin errores
- [x] `npm run lint` — **0 errores, 0 warnings** (meta `exhaustive-deps` cumplida)
- [x] `npm run build` — build limpio
- [x] Buscar en TVMaze, seleccionar y agregar funciona
- [x] Agregar manual con género + rating funciona
- [x] Toggle visto/pendiente, eliminar, filtro y orden funcionan
- [x] Tema claro/oscuro persiste al recargar (`useLocalStorage`)
- [x] Custom hook **en uso real** (`ThemeContext` lo consume)
- [x] Cleanup de `useEffect` verificado
- [ ] Capturas del Profiler insertadas en este README
- [ ] Subir a GitHub
- [ ] Subir ZIP en ADESA

---

## 📌 Notas técnicas clave (resumen)

| Concepto | Aplicación en este proyecto |
|---|---|
| **Reglas de Hooks** | Validadas por `eslint-plugin-react-hooks` con `rules-of-hooks: error`. |
| **`useEffect` deps** | Validadas por `exhaustive-deps: warn`. 0 warnings en `npm run lint`. |
| **Cleanup** | Theme body class, mousedown listener, debounce timer, fetch abort. |
| **`useContext`** | Solo para tema (cambio poco frecuente) — evita re-renders masivos. |
| **`useReducer`** | Watchlist con 4 sub-valores e inmutabilidad estricta. |
| **`useMemo`/`useCallback`** | Aplicados donde hay coste real (filter+sort sobre lista) o paso a hijos. No "overuse". |
| **`useRef`** | `inputRef` para focus, `dropdownRef` para click-outside, `listRef` para scroll. |
| **Profiler** | "No optimizar sin medir" — el Profiler valida que `useMemo`/`useCallback` reducen commits. |
