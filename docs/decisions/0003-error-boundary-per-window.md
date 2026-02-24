# ADR 0003: Error Boundary Per Window

## Status

Accepted

## Context

Lazy-loaded components or their reducers can throw. A single app-level error boundary would take down the whole UI.

## Decision

Wrap each window’s content in an `ErrorBoundary`. Failed windows show a fallback with a reset option; other windows remain usable.

## Consequences

- **Pros**: Isolated failures; better UX; app stays responsive
- **Cons**: Users must manually reset or close a failed window
- **Future**: Integrate with error reporting (e.g. Sentry) in `componentDidCatch`
