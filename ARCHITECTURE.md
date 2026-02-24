# Architecture

## High-Level Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  App (ThemeProvider)                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         Redux Store (reducerManager)                     │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐  (lazy: Notes, …)  │  │
│  │  │   Desktop   │  │ ComponentLazy2│  │   Notes     │  ← injected on open │  │
│  │  │ (always)    │  │ (on demand)  │  │ (on demand) │  ← removed on close  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘                      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌────────────┐  ┌─────────────────────────────────────┐  ┌──────────────┐   │
│  │  Header    │  │  Desktop (grid)                     │  │ FooterTaskbar│   │
│  │  + theme   │  │  ┌───────┐ ┌───────┐ ┌───────┐     │  │              │   │
│  │  + buttons │  │  │Window │ │Window │ │Window │ …   │  └──────────────┘   │
│  └────────────┘  │  │+Error │ │+Error │ │+Error │     │                     │
│                  │  │Boundary│ │Boundary│ │Boundary│     │                     │
│                  │  │ lazy  │ │ lazy  │ │ lazy  │     │                     │
│                  │  │ comp  │ │ comp  │ │ comp  │     │                     │
│                  │  └───────┘ └───────┘ └───────┘     │                     │
│                  └─────────────────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────────────────┘
         │                        │
         ▼                        ▼
   localStorage              componentLoader
   (layouts, theme)          (dynamic imports)
```

## Overview

Desktop UI is a feature-based React app that mimics a desktop environment with draggable windows. Each window can load its own component and Redux slice lazily, keeping the initial bundle small. The app supports window focus, keyboard shortcuts, light/dark theme, and multiple feature components (Notes, Timer, and lazy-loaded counters).

## Key Concepts

### Dynamic Reducer Injection

Redux uses a custom reducer manager (`reducerManager.ts`) that supports adding and removing reducers at runtime. When a window with a `lazyLoadReducerName` mounts, its slice is injected; when the last window using that slice unmounts, the reducer is removed.

```
Desktop (always loaded)
  └── ComponentLazy2 (injected when window opens)
  └── ComponentLazy3 (injected when window opens)
  └── Notes (NotesReducer, injected when Notes window opens)
  └── Timer (no Redux – local state only)
```

### Lazy Component Loading

Components are loaded via `React.lazy` and the `componentLoader` map. Each window defines a `lazyLoadComponent` key that maps to a dynamic import. This keeps initial JS small.

### Local Storage Persistence

Window positions and layouts are persisted to `localStorage`. A middleware subscribes to relevant actions and saves state after each change, keeping reducers pure. Theme preference (light/dark) is also stored in `localStorage`.

### Error Boundaries

Each window content is wrapped in an `ErrorBoundary`. If a lazy component or its slice throws, only that window fails; the rest of the app continues. The boundary offers a “Try again” reset.

### Window Focus & Z-Index

The Desktop slice tracks `focusedWindowId`. Clicking a window’s header (title area) focuses it; the focused window is brought to the front (higher z-index) and gets a visible focus ring. New windows receive focus on add; focus is cleared when a window is removed.

### Keyboard Shortcuts

- **Escape** and **Cmd+W** / **Ctrl+W** close the currently focused window (and clean up its lazy reducer when applicable).

### Theme (Light / Dark)

`ThemeContext` provides `theme`, `setTheme`, and `toggleTheme`. The choice is persisted in `localStorage` and applied via `data-theme` on the document root; CSS variables (`--bg`, `--text`, `--border`) drive the look. The header has a “Dark mode” / “Light mode” toggle.

### Drag Handle

Only the **window title area** (header text) is the drag handle (class `drag-handle`). Buttons (e.g. Remove) do not start a drag, so clicking them behaves as expected.

### Shared Copy & Constants

UI strings used in the header and tests live in `src/constants.ts`: `APP_STRINGS` for display copy, `APP_TEST` for test selectors (regexes derived from those strings). This keeps the app and tests in sync.

## Feature Components

Feature components live in `src/features/<Name>/` with their own folder, optional Redux slice, unit tests (`*.test.tsx`), and E2E coverage in `tests/*.spec.ts`.

| Feature       | Path                    | Redux              | Description                    |
| ------------- | ----------------------- | ------------------ | ------------------------------ |
| Desktop       | `features/Desktop/`     | DesktopSlice       | Grid, windows list, layouts   |
| ComponentLazy | `components/`           | –                  | Simple counter (legacy)        |
| ComponentLazy2| `features/ComponentLazy2/` | ComponentLazy2Slice | Counter with lazy reducer  |
| ComponentLazy3| `features/ComponentLazy3/` | –                | Demo window                    |
| Notes         | `features/Notes/`       | NotesSlice         | Add/remove text notes          |
| Timer         | `features/Timer/`       | –                  | Stopwatch (Start/Pause/Reset)  |

See `docs/FEATURE_COMPONENTS.md` for how to add new features.

## Data Flow

1. **Open window**: `addWindow` → Desktop slice (sets `focusedWindowId`) → layout persisted via middleware
2. **Load lazy component**: `lazy()` + `useLazyLoadReducer` → reducer injected, component rendered
3. **Close window**: `removeWindow` (or Escape / Cmd+W) → if last instance of that slice, reducer removed
4. **Persist layout**: Drag/resize → `updateLayouts` → middleware saves to localStorage
5. **Focus window**: Click header → `setFocus(id)` → window reordered and styled as focused
6. **Theme**: Toggle in header → ThemeContext updates → `data-theme` + localStorage updated

## File Roles

| File / Folder          | Role                                              |
| ---------------------- | ------------------------------------------------- |
| `reducerManager.ts`    | Add/remove reducers at runtime                    |
| `lazyLoadReducer.ts`   | Helpers to inject/remove reducers                 |
| `componentLoader.ts`   | Map of lazy component names to dynamic imports    |
| `useLazyLoadReducer`   | Hook to inject a feature’s reducer on mount       |
| `DesktopSlice`         | Windows list, layouts, `focusedWindowId`         |
| `ThemeContext.tsx`     | Light/dark theme state and persistence           |
| `constants.ts`         | APP_STRINGS (UI copy), APP_TEST (test selectors) |
| `middleware/desktopStorageMiddleware.ts` | Persist Desktop state to localStorage    |
| `features/Notes/`      | Notes feature (slice + component + tests)         |
| `features/Timer/`      | Timer feature (component + tests, no slice)       |

## Why This Structure?

- **Feature folders**  
  Each feature (Notes, Timer, Desktop, …) lives in one place with its component, optional slice, and tests. Adding a feature doesn’t touch the core store or other features.

- **Reducer manager + single root reducer**  
  The store has one “root” reducer that is actually the reducer manager’s `reduce` function. That function delegates to a combined reducer that can change over time (slices added/removed). We never touch Redux’s default `combineReducers` at the top level; we own the composition.

- **Lazy reducer + lazy component together**  
  When a window opens, we load the component (via `React.lazy` + `componentLoader`) and inject the slice (via `useLazyLoadReducer`). When the last window of that type closes, we remove the slice and optionally let the chunk be GC’d. State and code stay in sync.

- **Middleware for persistence**  
  Reducers only compute the next state. Writing to `localStorage` (or later IndexedDB) happens in middleware that listens for specific actions. That keeps reducers pure and keeps persistence in one place.

- **Constants for copy and tests**  
  `APP_STRINGS` and `APP_TEST` in `constants.ts` ensure the UI and tests use the same labels. Renaming a button is one change, not a hunt through tests.
