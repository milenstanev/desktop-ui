# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- ARCHITECTURE.md with project structure and data flow
- Architecture Decision Records (ADRs) for dynamic reducer injection, localStorage persistence, and error boundaries
- Unit tests for reducerManager, storage, DesktopSlice, ErrorBoundary
- GitHub Actions CI: lint, type check, unit tests, build
- Prettier configuration
- Safe JSON parse for localStorage with validation
- Desktop storage middleware (reducers stay pure)
- ErrorBoundary with "Try again" reset button
- Accessibility: aria-label, role, aria-labelledby on Window component
- React.memo on Window for performance
- Project-specific README

### Changed

- DesktopSlice: removed direct localStorage calls; persistence via middleware
- Improved type safety: StoreWithReducerManager, removed `any` casts
- App.test.tsx: fixed misleading test description
- Window: added type="button" to avoid form submission
