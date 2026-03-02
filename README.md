<div align="center">

![Desktop UI Banner](.github/images/desktop-ui-banner.png)

# Desktop UI - Starter Template

[![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764abc?logo=redux&logoColor=white)](https://redux-toolkit.js.org/)
[![Tests](https://img.shields.io/badge/Tests-93%20unit%20%2B%2034%20E2E%20%7C%20100%25%20stable-success)](https://github.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

A **production-ready starter template** for building modular workspace UIs with React and Redux. This template demonstrates **dynamic reducer injection**, **code splitting by feature**, and **persistent layout** without a backend—perfect for building desktop-like applications, dashboards, or multi-window interfaces.

## ✨ What You Get

This starter template includes:

- 🎯 **Example Features**: Pre-built components (Counter, Timer, Notes, Form Editor, Simple Example) that demonstrate different patterns
- 🎨 **Zero Hardcoded Strings**: All strings, configuration, and constants are centralized in `src/constants.ts` for easy customization
- ✅ **Full Test Coverage**: 93 unit tests with Jest + React Testing Library and 34 E2E tests with Playwright
- 🚀 **Production Patterns**: Error boundaries, lazy loading, persistent state, and keyboard shortcuts out of the box
- 🎭 **Theme Support**: Three themes (Light, Dark, Gradient) with smooth transitions and theme-specific styling
- 📱 **Responsive Layout**: Grid adapts to 4 breakpoints (XL/LG/MD/SM) with configurable row heights and gaps
- 🎛️ **Layout Controls**: Organize grid, reset layouts, and close all windows with dedicated buttons
- 🎨 **Icon Support**: Lucide React icons for enhanced UI (gradient theme)
- 🔌 **Mock API**: Built-in mock API service for FormEditor - works without backend, easy to replace with real API

## 🎉 Recent Improvements

**Latest updates** (March 2026):
- ✅ **100% Test Stability**: All E2E tests pass consistently across 100+ runs
- 📱 **PWA Ready**: Service worker, offline support, and installable app
- 📊 **Performance Monitoring**: Web Vitals tracking for Core Web Vitals metrics
- 📦 **Bundle Analysis**: Visual bundle size analysis with webpack-bundle-analyzer
- 🔒 **Quality Gates**: Pre-commit hooks (lint, type-check, tests)
- 📝 **Conventional Commits**: Enforced commit message format with commitlint
- 🎯 **Consolidated Test Selectors**: Single source of truth in `TEST_SELECTORS` file
- 🔗 **Absolute Imports**: Clean `~/` path aliases throughout the codebase
- 🎹 **Keyboard Shortcuts Hook**: Reusable `useKeyboardShortcuts` hook
- 🚀 **No More `any` Types**: Proper TypeScript types in all Form components

[View enhancements summary →](docs/ENHANCEMENTS_SUMMARY.md)

## Why Use This Template

- **Bundle Optimization**: Only the Desktop shell and grid load upfront; feature code loads on demand. Redux state for a feature exists only while at least one window of that type is open.
- **Easy to Extend**: New features are added as self-contained folders under `features/` with their own slice (optional), tests, and a single entry in the component loader—no changes to core store or routing.
- **Maintainable**: Persistence is handled by middleware so reducers stay pure; window focus and keyboard shortcuts are centralized; all UI copy and test selectors use constants to avoid drift.

## Technical Decisions & Impact

| Decision | Rationale | Impact |
|----------|-----------|--------|
| **Custom reducer manager** | Redux's `combineReducers` is static; we need to add/remove slices when windows open/close. | Smaller initial state and bundle; feature state is created and torn down with the feature. |
| **Middleware for persistence** | Writing to `localStorage` inside reducers would mix side effects with state updates. | Reducers stay pure and testable; persistence is one place and easy to swap (e.g. to IndexedDB). |
| **Lazy component + lazy reducer** | A feature's component and state should load together. | No "empty" slice at startup; clear lifecycle per feature. |
| **Per-window ErrorBoundary** | A bug in one feature shouldn't take down the whole grid. | Isolated failures; user can close the broken window and keep working. |
| **Single drag handle (title bar)** | Making the whole header draggable would block button clicks. | Predictable UX: drag by title, click buttons without starting a drag. |
| **Centralized constants** | All strings, config, and magic numbers in one place. | Easy to customize, no string drift between code and tests, simple i18n setup. |
| **Centralized test selectors** | All `data-testid` values in `testSelectors.ts`. | Type-safe, refactor-friendly, single source of truth for E2E tests. |
| **Path aliases (`~/`)** | Use `~/constants` instead of `../../../../constants`. | Cleaner imports, easier refactoring, less error-prone. |
| **Co-located tests** | Tests live in `__tests__/` folders within each feature. | Easy to find, maintain, and delete features with their tests. |

## Tech Stack

- **React 18** (TypeScript), **Redux Toolkit**, **react-grid-layout**
- **UI**: Lucide React (icons), CSS Modules, CSS Variables
- **Testing**: Jest + React Testing Library (unit), Playwright (E2E)
- **PWA**: Workbox (service worker), Web Vitals (performance monitoring)
- **Quality**: Husky (git hooks), Commitlint (conventional commits), ESLint, Prettier
- **Build**: webpack-bundle-analyzer, react-app-rewired

## Getting Started

**Prerequisites:** Node.js 16+, npm 7+

```bash
npm install
npm start   # http://localhost:3000
```

### Configuration

Copy `.env.example` to `.env` to customize settings:

```bash
cp .env.example .env
```

**Key Environment Variables:**
- `REACT_APP_ENABLE_PWA` - Enable/disable PWA features (default: false in dev, true in production)
- `REACT_APP_ENABLE_VITALS_LOGGING` - Enable/disable Web Vitals console logging

See [PWA Guide](./docs/PWA_GUIDE.md) for detailed configuration options.

| Script | Description |
|--------|-------------|
| `npm start` | Dev server |
| `npm test` | Unit tests (watch mode) |
| `npm run test:unit` | Run all unit tests once (93 tests) |
| `npm run test:e2e` | Run all E2E tests (34 tests) |
| `npm run test:e2e:ui` | Run E2E tests with Playwright UI |
| `npm run test:all` | Run both unit and E2E tests |
| `npm run test:flaky` | Stability test (100 E2E runs) |
| `npm run build` | Production build with PWA |
| `npm run build:analyze` | Build + bundle size analysis |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run type-check` | TypeScript type checking |
| `npm run format` | Format code with Prettier |

Run `npm run test:all` to execute all tests.

## Project Structure

```
src/
├── app/           # Store (with reducer manager), shell, header, footer
├── components/    # Shared components in dedicated folders
│   ├── Desktop/   # Desktop grid component with slice
│   ├── Window/    # Window wrapper with close button
│   ├── ErrorBoundary/ # Error boundary for each window
│   ├── Loader/    # SVG-based loading spinner
│   └── Icons/     # SVG icon components
├── features/      # Feature components with co-located tests
│   ├── FormEditor/
│   │   ├── __tests__/
│   │   │   ├── unit/    # Jest unit tests
│   │   │   └── e2e/     # Playwright E2E tests
│   │   ├── FormFields/
│   │   ├── FormEditor.tsx
│   │   └── README.md
│   ├── Notes/
│   │   ├── __tests__/
│   │   │   ├── unit/
│   │   │   └── e2e/
│   │   └── Notes.tsx
│   └── ... (Timer, Counter, SimpleExample)
├── contexts/      # Theme context (light/dark/gradient)
├── hooks/         # useLazyLoadReducer
├── middleware/    # Desktop persistence to localStorage
├── utils/         # reducerManager, lazyLoadReducer, componentLoader
├── constants.ts   # ALL strings, config, and constants
└── testSelectors.ts # Centralized test IDs
```

## Adding a New Feature

1. **Create feature folder**: `src/features/YourFeature/`
   ```
   YourFeature/
   ├── __tests__/
   │   ├── unit/
   │   │   └── YourFeature.test.tsx
   │   └── e2e/
   │       └── your-feature.spec.ts
   ├── YourFeature.tsx
   └── YourFeatureSlice.ts (optional)
   ```
2. **Add component**: `YourFeature.tsx` (optionally with a Redux slice)
3. **Register in componentLoader**: Add entry to `src/utils/componentLoader.ts`
   ```typescript
   export const componentLoader = {
     YourFeature: () => import('../features/YourFeature/YourFeature'),
     // ... other features
   };
   ```
4. **Add constants**: Add strings to `src/constants.ts`
   - Add to `COMPONENT_NAMES`: `YOUR_FEATURE: 'Your Feature'`
   - Add to `REDUCER_NAMES` (if using Redux): `YOUR_FEATURE: 'YourFeatureReducer'`
   - Add button label to `APP_STRINGS`: `BUTTON_ADD_YOUR_FEATURE: 'Your Feature'`
   - Add feature-specific strings: `YOUR_FEATURE_STRINGS: { ... }`
5. **Add button in Header**: Add handler and button in `src/app/Header.tsx`
   ```typescript
   const handleAddYourFeature = useCallback(() => {
     const id = uuidv4();

     dispatch(
       addWindow({
         id,
         name: COMPONENT_NAMES.YOUR_FEATURE,
         lazyLoadComponent: 'YourFeature', // Must match componentLoader key!
         layout: undefined,
         lazyLoadReducerName: REDUCER_NAMES.YOUR_FEATURE, // Optional, if using Redux
       })
     );
   }, [dispatch]);
   ```
6. **Write tests**: Create `YourFeature.test.tsx` and E2E tests (see [Best Practices](./docs/BEST_PRACTICES.md#e2e-testing-best-practice) for E2E testing guidelines)

See [FEATURE_COMPONENTS.md](./docs/FEATURE_COMPONENTS.md) for detailed examples.

## Important: Middleware Persistence

⚠️ **Critical Pattern**: Any action that modifies Desktop state must be registered in the middleware for persistence. See [MIDDLEWARE_PERSISTENCE.md](./docs/MIDDLEWARE_PERSISTENCE.md) for complete details.

## Adding Desktop Actions

If you add a new action to `DesktopSlice` that modifies windows or layouts, you **MUST** register it in the middleware for persistence:

1. **Add action to DesktopSlice**: `src/components/Desktop/DesktopSlice.ts`
2. **Register in middleware**: `src/middleware/desktopStorageMiddleware.ts`
   ```typescript
   import { yourNewAction } from '../components/Desktop/DesktopSlice';
   
   if (
     removeWindow.match(action) ||
     addWindow.match(action) ||
     yourNewAction.match(action) ||  // ← Add your action here
     // ... other actions
   ) {
     // Persist to localStorage
   }
   ```

**Why?** Without this registration, your changes won't be saved to localStorage and will be lost on page reload.

**Example actions that need registration:**
- Any action that adds/removes windows
- Any action that modifies layouts
- Any action that affects window positions or sizes

## Customization Guide

### Path Aliases

This project uses `~` as an alias for the `src/` directory throughout the codebase:

```typescript
// Use ~ alias everywhere:
import { TEST_SELECTORS } from '~/testSelectors';
import { APP_STRINGS } from '~/constants';
import Desktop from '~/components/Desktop/Desktop';
import { useTheme } from '~/contexts/ThemeContext';
```

**Benefits:**
- Cleaner imports without `../../../` chains
- Easier refactoring when moving files
- Consistent import style across the project

Configured in:
- `tsconfig.json` - TypeScript path resolution (IDE support)
- `package.json` (jest config) - Jest module resolution (test runtime)
- `config-overrides.js` - Webpack alias for runtime (via react-app-rewired)

### Changing All Text and Labels

All user-facing strings are in `src/constants.ts`. Update these constants to customize:

- App title and button labels (`APP_STRINGS`) - includes layout control buttons
- Component names (`COMPONENT_NAMES`)
- UI text for windows, errors, themes (`WINDOW_STRINGS`, `ERROR_BOUNDARY_STRINGS`, `THEME_STRINGS`, `DESKTOP_STRINGS`)
- Feature-specific text (`NOTES_STRINGS`, `TIMER_STRINGS`, `COUNTER_STRINGS`, `FORM_EDITOR_STRINGS`, etc.)

### Changing Layout Configuration

Layout settings are in `LAYOUT_CONFIG` in `src/constants.ts`:

- Breakpoints and column counts
- Drag handle class name
- Z-index values

Window layout behavior is configured in `src/components/Desktop/Desktop.tsx`:

- `rowHeight`: Height of each grid row unit (default: 80px)
- `margin`: Gap between windows (default: [10, 10], gradient theme: [20, 20])
- `containerPadding`: Padding around the grid

Default window sizes are in `src/components/Desktop/config.ts`:

- `defaultWindowsPositions`: Initial size for new windows
- `windowPresets`: Predefined sizes (small, medium, large, full)

### Renaming Features

To rename a feature (e.g., "Counter" → "Calculator"):

1. Update `COMPONENT_NAMES` in `src/constants.ts`
2. Update `APP_STRINGS` button labels
3. Rename the feature folder and files
4. Update imports in `componentLoader.ts` and `Header.tsx`
5. Update test files

## Documentation

### Getting Started
- [Configuration](./docs/CONFIGURATION.md) - Environment variables and settings
- [Best Practices](./docs/BEST_PRACTICES.md) - Code quality guidelines

### Features & Guides
- [PWA Guide](./docs/PWA_GUIDE.md) - Progressive Web App setup
- [Performance](./docs/PERFORMANCE.md) - Web Vitals and optimization
- [Git Workflow](./docs/GIT_WORKFLOW.md) - Commit guidelines and hooks
- [API Documentation](./docs/API_DOCUMENTATION.md) - Hooks and utilities reference

### Project Info
- [Architecture](./docs/ARCHITECTURE.md) - System design and decisions
- [Enhancements Summary](./docs/ENHANCEMENTS_SUMMARY.md) - New features overview

## License

MIT
