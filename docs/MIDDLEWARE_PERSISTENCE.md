# Middleware Persistence Pattern

This document explains how Desktop state persistence works.

## Overview

`desktopStorageMiddleware` persists the Desktop slice to `localStorage` after each action **only when** one of these references changes:

- `Desktop.desktopWindows`
- `Desktop.layouts`

This removes the old need to manually register every action in a matcher list.

## Behavior

### Automatic persistence

After an action is reduced:

1. Middleware compares previous and next references for `desktopWindows` and `layouts`.
2. If either reference changed, it saves both keys:
   - `desktopUI.desktop`
   - `desktopUI.layouts`

### Full reset action

`removeAllWindows` is handled explicitly:

- Middleware removes both keys from `localStorage` instead of writing empty state.

## Why this is safer

- New reducers that mutate windows/layouts are persisted automatically.
- No action whitelist drift.
- Fewer persistence regressions during feature work.

## What still does not persist

`focusedWindowId` is intentionally not persisted.

## Testing guidance

When adding Desktop reducers:

- If reducer mutates `desktopWindows` or `layouts`, persistence should happen automatically.
- Add/adjust tests in `desktopStorageMiddleware.test.ts` only when behavior changes (e.g. special-case actions like full reset).

## Related files

- `src/core/middleware/desktopStorageMiddleware.ts`
- `src/core/middleware/desktopStorageMiddleware.test.ts`
- `src/features/Desktop/DesktopSlice.ts`
