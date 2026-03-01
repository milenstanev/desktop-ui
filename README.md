# Desktop UI

A **modular workspace UI** built with React and Redux where each “window” is a lazily loaded feature: its component and Redux slice are loaded only when the window is opened, and removed when the last window of that type is closed. The project demonstrates **dynamic reducer injection**, **code splitting by feature**, and **persistent layout** without a backend.

## Why This Project Exists

- **Bundle size**: Only the Desktop shell and grid load upfront; feature code (Notes, Timer, counters) loads on demand. Redux state for a feature exists only while at least one window of that type is open.
- **Scalability**: New features are added as self-contained folders under `features/` with their own slice (optional), tests, and a single entry in the component loader—no changes to core store or routing.
- **Maintainability**: Persistence is handled by middleware so reducers stay pure; window focus and keyboard shortcuts are centralized; UI copy and test selectors share constants to avoid drift.

## Technical Decisions & Impact

| Decision | Rationale | Impact |
|----------|-----------|--------|
| **Custom reducer manager** | Redux’s `combineReducers` is static; we need to add/remove slices when windows open/close. | Smaller initial state and bundle; feature state is created and torn down with the feature. |
| **Middleware for persistence** | Writing to `localStorage` inside reducers would mix side effects with state updates. | Reducers stay pure and testable; persistence is one place and easy to swap (e.g. to IndexedDB). |
| **Lazy component + lazy reducer** | A feature’s component and state should load together. | No “empty” slice at startup; clear lifecycle per feature. |
| **Per-window ErrorBoundary** | A bug in one feature shouldn’t take down the whole grid. | Isolated failures; user can close the broken window and keep working. |
| **Single drag handle (title bar)** | Making the whole header draggable would block button clicks. | Predictable UX: drag by title, click buttons without starting a drag. |

## Tech Stack

- **React 18** (TypeScript), **Redux Toolkit**, **react-grid-layout**
- **Testing**: Jest + React Testing Library (unit), Playwright (E2E)
- **CI**: GitHub Actions (lint, typecheck, unit tests, E2E tests, build)

## Getting Started

**Prerequisites:** Node.js 16+, npm 7+

```bash
npm install
npm start   # http://localhost:3000
```

| Script | Description |
|--------|-------------|
| `npm start` | Dev server |
| `npm test` | Unit tests (watch) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npx playwright test` | E2E (run with app on port 3000) |

## Project Structure

```
src/
├── app/           # Store (with reducer manager), shell, header, footer
├── components/    # Shared: Window, ErrorBoundary
├── features/      # One folder per feature (Desktop, Notes, Timer, …)
├── contexts/     # Theme (light/dark)
├── hooks/         # useLazyLoadReducer
├── middleware/    # Desktop persistence to localStorage
└── utils/         # reducerManager, lazyLoadReducer, componentLoader
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the high-level diagram and “Why this structure?”.

## Docs

- [Architecture & diagram](./ARCHITECTURE.md)
- [Why this structure?](./ARCHITECTURE.md#why-this-structure)
- [Performance & benchmarks](./docs/PERFORMANCE.md)
- [ADRs](./docs/decisions/)
- [Feature components](./docs/FEATURE_COMPONENTS.md)
- [Implemented features](./docs/IMPLEMENTED_FEATURES.md)
- [Future features](./docs/FUTURE_FEATURES.md)
