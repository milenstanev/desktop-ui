# ADR 0002: Local Storage for Layout Persistence

## Status

Accepted

## Context

Users expect window positions and layouts to persist across refreshes. We need a simple, synchronous persistence layer.

## Decision

Persist `desktopWindows` and `layouts` to `localStorage` via Redux middleware. Reducers stay pure; middleware listens for `addWindow`, `removeWindow`, and `updateLayouts` and saves the relevant slice after each action.

## Consequences

- **Pros**: No backend required; works offline; fast and simple
- **Cons**: Limited to ~5MB; no multi-device sync; must handle corrupted data on load
- **Mitigation**: Parse with try/catch; validate shape; fallback to defaults on failure
