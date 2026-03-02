# Architecture

## High-Level Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                     App (ThemeProvider + Redux)                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                   Redux Store (reducerManager)                      │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────┐                 │  │
│  │  │   Desktop   │  │    Counter   │  │    Notes    │  ← lazy loaded  │  │
│  │  │  (always)   │  │ (on demand)  │  │ (on demand) │  ← injected     │  │
│  │  └─────────────┘  └──────────────┘  └─────────────┘  ← removed      │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                           │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ <header>  Header (theme selector + feature buttons)                │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ <main>    Desktop (grid layout)                                    │   │
│  │           ┌───────┐ ┌───────┐ ┌───────┐                            │   │
│  │           │Window │ │Window │ │Window │                            │   │
│  │           │ Error │ │ Error │ │ Error │                            │   │
│  │           │Bound. │ │Bound. │ │Bound. │                            │   │
│  │           │ lazy  │ │ lazy  │ │ lazy  │                            │   │
│  │           │ comp  │ │ comp  │ │ comp  │                            │   │
│  │           └───────┘ └───────┘ └───────┘                            │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │ <footer>  FooterTaskbar                                            │   │
│  └────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘
              │                          │
              ▼                          ▼
        localStorage              componentLoader
      (layouts, theme)           (dynamic imports)
```

## Overview

Desktop UI is a feature-based React app that mimics a desktop environment with draggable windows. Each window can load its own component and Redux slice lazily, keeping the initial bundle small. The app supports window focus, keyboard shortcuts, three themes (Light, Dark, Gradient), layout management controls, responsive breakpoints (XL/LG/MD/SM), and multiple feature components (Notes, Timer, Counter, FormEditor with mock API, SimpleExample).

## Key Concepts

### Dynamic Reducer Injection

Redux uses a custom reducer manager (`reducerManager.ts`) that supports adding and removing reducers at runtime. When a window with a `lazyLoadReducerName` mounts, its slice is injected; when the last window using that slice unmounts, the reducer is removed.

```
Desktop (always loaded)
  └── Counter (injected when window opens)
  └── FormEditor (injected when window opens)
  └── Notes (NotesReducer, injected when Notes window opens)
  └── Timer (no Redux – local state only)
```

### Lazy Component Loading

Components are loaded via `React.lazy` and the `componentLoader` map. Each window defines a `lazyLoadComponent` key that maps to a dynamic import. This keeps initial JS small.

### Local Storage Persistence

Window positions and layouts are persisted to `localStorage`. A middleware (`desktopStorageMiddleware`) subscribes to relevant actions and saves state after each change, keeping reducers pure. Theme preference (light/dark/gradient) is also stored in `localStorage`.

**CRITICAL: Action Registration**

Any action that modifies `desktopWindows` or `layouts` in `DesktopSlice` MUST be registered in `src/middleware/desktopStorageMiddleware.ts`. Without registration, changes will not persist and will be lost on page reload.

Currently registered actions:
- `addWindow` - Adds a new window
- `removeWindow` - Removes a window
- `updateLayouts` - Updates layouts after drag/resize
- `resetLayouts` - Resets all layouts to defaults
- `organizeGrid` - Organizes windows in grid
- `removeAllWindows` - Clears all windows

When adding new actions, import and add them to the middleware's if condition.

### Error Boundaries

Each window content is wrapped in an `ErrorBoundary`. If a lazy component or its slice throws, only that window fails; the rest of the app continues. The boundary offers a “Try again” reset.

### Window Focus & Z-Index

The Desktop slice tracks `focusedWindowId`. Clicking a window’s header (title area) focuses it; the focused window is brought to the front (higher z-index) and gets a visible focus ring. New windows receive focus on add; focus is cleared when a window is removed.

### Keyboard Shortcuts

- **Escape** and **Cmd+W** / **Ctrl+W** close the currently focused window (and clean up its lazy reducer when applicable).

### Responsive Layout Breakpoints

The grid layout adapts to different screen sizes:
- **XL (>1920px)**: 12 columns, 3 windows per row (4 cols each)
- **LG (1200-1920px)**: 12 columns, 3 windows per row (4 cols each)
- **MD (996-1200px)**: 8 columns, 2 windows per row (4 cols each)
- **SM (<996px)**: 2 columns, 1 window per row (full width)

### Layout Controls

The header provides layout management buttons:
- **Organize Grid**: Arranges all windows in equal-sized grid (3 per row on XL, 4 per row on LG, 3 cols × 3 rows each)
- **Reset Layout**: Resets window positions and sizes to defaults (3 per row on XL, 2 per row on LG, 4 cols × 4 rows each)
- **Close All**: Removes all windows and clears layouts

### Theme System

`ThemeContext` provides `theme` and `setTheme`. Three themes available via dropdown:
- **Light**: Clean white background with blue accents
- **Dark**: Dark background with brighter blue accents
- **Gradient**: Purple gradient background with golden accents

The theme is persisted in `localStorage` and applied via `data-theme` on the document root. CSS variables (`--bg`, `--text`, `--border`) drive the styling. The gradient theme features larger grid gaps (20px vs 10px), icons on buttons (Lucide React), and golden focus borders.


### Drag Handle

Only the **window title area** (header text) is the drag handle (class `drag-handle`). Buttons (e.g. Remove) do not start a drag, so clicking them behaves as expected.

### Shared Copy & Constants

UI strings used in the header and tests live in `src/constants.ts`: `APP_STRINGS` for display copy, `APP_TEST` for test selectors (regexes derived from those strings). This keeps the app and tests in sync.

## Feature Components

Feature components live in `src/features/<Name>/` with their own folder, optional Redux slice, unit tests (`*.test.tsx`), and E2E coverage in `tests/*.spec.ts`.

| Feature       | Path                       | Redux              | Description                    |
| ------------- | -------------------------- | ------------------ | ------------------------------ |
| Desktop       | `components/Desktop/`      | DesktopSlice       | Grid, windows list, layouts    |
| SimpleExample | `features/SimpleExample/`  | –                  | Basic example component        |
| Counter       | `features/Counter/`        | CounterSlice       | Counter with lazy reducer      |
| FormEditor    | `features/FormEditor/`     | –                  | Form with API integration      |
| Notes         | `features/Notes/`          | NotesSlice         | Add/remove text notes          |
| Timer         | `features/Timer/`          | –                  | Stopwatch (Start/Pause/Reset)  |

See `docs/FEATURE_COMPONENTS.md` for how to add new features.

## Data Flow

1. **Open window**: `addWindow` → Desktop slice (sets `focusedWindowId`, calculates position) → layout persisted via middleware
2. **Load lazy component**: `lazy()` + `useLazyLoadReducer` → reducer injected, component rendered (shows Loader during load)
3. **Close window**: `removeWindow` (or Escape / Cmd+W) → if last instance of that slice, reducer removed
4. **Persist layout**: Drag/resize → `updateLayouts` → middleware saves to localStorage
5. **Focus window**: Click header → `setFocus(id)` → window reordered and styled with gradient border
6. **Theme**: Select in dropdown → ThemeContext updates → `data-theme` + localStorage updated
7. **Organize grid**: `organizeGrid` → all windows arranged in equal-sized grid → persisted
8. **Reset layout**: `resetLayouts` → windows repositioned with default sizes → persisted
9. **Close all**: `removeAllWindows` → all windows removed, layouts cleared, focus cleared

## File Roles

| File / Folder          | Role                                              |
| ---------------------- | ------------------------------------------------- |
| `reducerManager.ts`    | Add/remove reducers at runtime                    |
| `lazyLoadReducer.ts`   | Helpers to inject/remove reducers                 |
| `componentLoader.ts`   | Map of lazy component names to dynamic imports    |
| `useLazyLoadReducer`   | Hook to inject a feature’s reducer on mount       |
| `DesktopSlice`         | Windows list, layouts, `focusedWindowId`, layout actions (organizeGrid, resetLayouts, removeAllWindows) |
| `ThemeContext.tsx`     | Theme state (light/dark/gradient) and persistence |
| `constants.ts`         | APP_STRINGS (UI copy), APP_TEST (test selectors) |
| `middleware/desktopStorageMiddleware.ts` | Persist Desktop state to localStorage (MUST register all Desktop actions here) |
| `features/Notes/`      | Notes feature (slice + component + tests)         |
| `features/Timer/`      | Timer feature (component + tests, no slice)       |
| `components/Desktop/`  | Desktop grid with layout management and dynamic spacing |
| `components/Window/`   | Window wrapper with gradient borders and close button |
| `components/ErrorBoundary/` | Error boundary for each window               |
| `components/Desktop/config.ts` | Default window sizes and presets         |
| `components/Loader/`   | SVG-based loading spinner (theme-aware)           |
| `components/Icons/`    | SVG icon components (CloseIcon)                   |

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
