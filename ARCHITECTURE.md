# Architecture

## Overview

Desktop UI is a feature-based React app that mimics a desktop environment with draggable windows. Each window can load its own component and Redux slice lazily, keeping the initial bundle small.

## Key Concepts

### Dynamic Reducer Injection

Redux uses a custom reducer manager (`reducerManager.ts`) that supports adding and removing reducers at runtime. When a window with a `lazyLoadReducerName` mounts, its slice is injected; when the last window using that slice unmounts, the reducer is removed.

```
Desktop (always loaded)
  └── ComponentLazy2 (injected when window opens)
  └── ComponentLazy3 (injected when window opens)
```

### Lazy Component Loading

Components are loaded via `React.lazy` and the `componentLoader` map. Each window defines a `lazyLoadComponent` key that maps to a dynamic import. This keeps initial JS small.

### Local Storage Persistence

Window positions and layouts are persisted to `localStorage`. A middleware subscribes to relevant actions and saves state after each change, keeping reducers pure.

### Error Boundaries

Each window content is wrapped in an `ErrorBoundary`. If a lazy component or its slice throws, only that window fails; the rest of the app continues.

## Data Flow

1. **Open window**: `addWindow` → Desktop slice → layout persisted via middleware
2. **Load lazy component**: `lazy()` + `useLazyLoadReducer` → reducer injected, component rendered
3. **Close window**: `removeWindow` → if last instance of that slice, reducer removed
4. **Persist layout**: Drag/resize → `updateLayouts` → middleware saves to localStorage

## File Roles

| File / Folder       | Role                                              |
| ------------------- | ------------------------------------------------- |
| `reducerManager.ts` | Add/remove reducers at runtime                    |
| `lazyLoadReducer.ts`| Helpers to inject/remove reducers                 |
| `componentLoader.ts`| Map of lazy component names to dynamic imports    |
| `useLazyLoadReducer`| Hook to inject a feature’s reducer on mount       |
| `DesktopSlice`      | Windows list + layouts; consumed by grid          |
