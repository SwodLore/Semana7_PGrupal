# Dashboard Gestor de Tareas — Semana 7 Práctica 2

**Asignatura:** Desarrollo de Aplicaciones Web (IS093A)  
**Tema:** React Hooks: useState, useEffect, useContext, useRef, useReducer, useCallback, useMemo y Hooks Personalizados

**INTEGRANTES:**
-Araujo Champi Jose Eduardo 
-Melgarejo Guzman Renzo Gustavo 
-Poves Martinez Alessando Piero
-Sulluchuco Vilcapoma Anyelo
---

## Proyecto: Gestor de Tareas con Prioridades

Un dashboard para gestionar tareas con:
- Agregar / eliminar / marcar como completada
- Prioridad por tarea: **alta / media / baja**
- Filtrar: Todas / Pendientes / Completadas
- Ordenar A→Z / Z→A
- Tema claro/oscuro persistido en `localStorage`

---

## Instalación y arranque

> Requisito: tener **Node.js** instalado. Verificar con `node --version`.

```bash
# 1. Instalar pnpm (solo una vez, globalmente)
npm install -g pnpm

# 2. Entrar al proyecto
cd dashboard-hooks

# 3. Instalar dependencias
pnpm install

# 4. Correr en desarrollo
pnpm dev
```

---

## Estructura del proyecto

```
dashboard-hooks/
├── src/
│   ├── contexts/
│   │   └── ThemeContext.jsx      ← PERSONA 2
│   ├── hooks/
│   │   ├── useTasksReducer.js    ← PERSONA 1
│   │   └── useLocalStorage.js   ← PERSONA 2
│   ├── components/
│   │   └── TaskList.jsx          ← PERSONA 3
│   ├── App.jsx                   ← PERSONA 1 (conectar todo)
│   ├── main.jsx                  ← base lista ✅
│   └── index.css                 ← base lista ✅
├── eslint.config.js              ← PERSONA 4
├── vite.config.js                ← base lista ✅
└── package.json                  ← base lista ✅
```

---

## División de trabajo

---

### PERSONA 1 — Arquitecto de Estado

**Archivo:** [src/hooks/useTasksReducer.js](src/hooks/useTasksReducer.js)  
**Archivo:** [src/App.jsx](src/App.jsx) (completar los TODOs)  
**Hooks:** `useReducer`, `useState`  
**Peso rúbrica:** 25%

**Qué implementar en `useTasksReducer.js`:**

Completar el `switch` en `tasksReducer` con los 5 casos:

| Acción | Qué hace |
|--------|----------|
| `ADD` | Agrega `{ id: Date.now(), title, priority, done: false }` al array |
| `REMOVE` | Filtra el item con `action.payload` (id) |
| `TOGGLE` | Cambia `done` del item con ese id (inmutablemente con `.map`) |
| `FILTER` | Cambia `state.filter` a `action.payload` |
| `SORT` | Cambia `state.sort` a `action.payload` |

**Regla clave:** Nunca mutar `state` directamente. Siempre usar spread `{ ...state, ... }`.

---

### PERSONA 2 — Ingeniero de Efectos & Contexto

**Archivo:** [src/contexts/ThemeContext.jsx](src/contexts/ThemeContext.jsx)  
**Archivo:** [src/hooks/useLocalStorage.js](src/hooks/useLocalStorage.js)  
**Hooks:** `useContext`, `useEffect`, `useState`  
**Peso rúbrica:** 20%

**Qué implementar en `ThemeContext.jsx`:**
1. Inicializar `theme` con `localStorage.getItem('theme') || 'light'`
2. `useEffect` que aplique `document.body.className = theme` con cleanup
3. `useEffect` que persista en `localStorage.setItem('theme', theme)`
4. `toggleTheme` que alterne entre `'light'` y `'dark'`

**Qué implementar en `useLocalStorage.js`:**
1. `useState` que lea el valor inicial desde `localStorage` con `JSON.parse` (y `try/catch`)
2. `useEffect` que escriba en `localStorage` cada vez que `value` cambie

---

### PERSONA 3 — Optimizador de Rendimiento

**Archivo:** [src/components/TaskList.jsx](src/components/TaskList.jsx)  
**Hooks:** `useMemo`, `useCallback`, `useRef`, `useEffect`  
**Peso rúbrica:** 20%

**Qué implementar en `TaskList.jsx`:**

1. **`useMemo` — `processedTasks`:** filtrar y ordenar las tareas:
   - `filter === 'done'` → solo las completadas
   - `filter === 'pending'` → solo las pendientes
   - `filter === 'all'` → todas
   - Luego ordenar por `task.title` según `sort` (`'asc'` o `'desc'`)

2. **`useCallback` — `handleRemove` y `handleToggle`:** estabilizar las funciones para no causar re-renders en hijos.

3. **`useRef` + `useEffect`:** activar el `inputRef.current?.focus()` cada vez que cambie `tasks.length`.

---

### PERSONA 4 — QA & Hook Validator

**Archivo:** [eslint.config.js](eslint.config.js) (ya configurado)  
**Peso rúbrica:** 15%

**Qué hacer:**

1. **Validar ESLint** — ejecutar `pnpm lint` y corregir todos los warnings:
   ```bash
   pnpm lint
   ```
   Meta: **cero warnings** de `react-hooks/exhaustive-deps`.

2. **React DevTools Profiler:**
   - Instalar extensión "React Developer Tools" en Chrome/Firefox
   - Abrir `http://localhost:5173`, ir a la pestaña **Profiler**
   - Hacer clic en ⏺ Record, agregar 3 tareas, filtrar, cambiar tema, detener
   - Tomar captura de pantalla mostrando render times

3. **Verificar cleanup de useEffect:**
   - En DevTools → Components, desmontar el `ThemeProvider` y confirmar que `body.className` se limpia

4. **Completar este README** con:
   - Nombres de los integrantes arriba
   - Capturas del Profiler (reemplazar los `[Captura]` abajo)
   - Justificaciones técnicas de cada hook

---

## Diagrama de flujo de estado

```
Usuario escribe tarea y presiona "Agregar"
        │
        ▼
  dispatch({ type: 'ADD', payload: título, priority })
        │
        ▼
  tasksReducer(state, action)  →  nuevo state (inmutable)
        │
        ▼
  App re-renderiza
        │
        ├──► TaskList recibe tasks actualizadas
        │         │
        │         ├── useMemo recalcula processedTasks (si tasks/filter/sort cambió)
        │         └── useEffect hace focus al input
        │
        └──► useEffect en ThemeContext (si theme cambió)
                  ├── body.className = theme
                  └── localStorage.setItem('theme', theme)
```

---

## Justificación técnica de hooks

| Hook | ¿Por qué no useState simple? |
|------|------------------------------|
| `useReducer` | Estado con 3 sub-valores interrelacionados. La lógica de update depende del estado anterior. |
| `useContext` | Evita pasar `theme`/`toggleTheme` por props a cada componente (prop drilling). |
| `useEffect` | Sincroniza efectos secundarios (DOM, localStorage) de forma reactiva. El cleanup evita memory leaks. |
| `useMemo` | Evita recalcular filtro+orden en cada render si las dependencias no cambiaron. |
| `useCallback` | Estabiliza referencias de funciones pasadas como props a componentes hijos (`React.memo`). |
| `useRef` | Accede al DOM del input sin disparar re-render. Con `useState` el re-render sería innecesario. |
| `useLocalStorage` (custom) | Encapsula lógica repetitiva de persistencia. Reutilizable en cualquier componente. |

---

## Capturas React DevTools Profiler

> **TODO (Persona 4):** Insertar capturas aquí.

```
[Captura 1 — Profiler mostrando render time y commits]
[Captura 2 — Comparación antes/después de useMemo y useCallback]
```

---

## Checklist de entrega

- [ ] `pnpm dev` corre sin errores
- [ ] `pnpm lint` — cero warnings de `react-hooks/exhaustive-deps`
- [ ] Agregar, eliminar y marcar tareas funciona
- [ ] Filtro y ordenamiento funcionan correctamente
- [ ] Tema claro/oscuro persiste al recargar la página
- [ ] Auto-focus en input al agregar tarea (useRef)
- [ ] Capturas del Profiler en este README
- [ ] Subir a GitHub
- [ ] Subir ZIP en ADESA
