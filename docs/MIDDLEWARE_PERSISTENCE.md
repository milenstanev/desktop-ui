# Middleware Persistence Pattern

This document explains how localStorage persistence works in the Desktop UI application and how to properly register new actions.

## Overview

The application uses Redux middleware to persist Desktop state (windows and layouts) to localStorage. This keeps reducers pure while ensuring state survives page reloads.

## How It Works

### 1. Middleware Pattern

The `desktopStorageMiddleware` listens for specific Redux actions and persists state to localStorage when they occur:

```typescript
// src/middleware/desktopStorageMiddleware.ts
export const desktopStorageMiddleware: Middleware<object, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    if (
      removeWindow.match(action) ||
      addWindow.match(action) ||
      updateLayouts.match(action) ||
      resetLayouts.match(action) ||
      removeAllWindows.match(action) ||
      organizeGrid.match(action)
    ) {
      const state = store.getState();
      const { desktopWindows, layouts } = state.Desktop;

      try {
        localStorage.setItem(
          LOCAL_STORAGE_DESKTOP_KEY,
          JSON.stringify(desktopWindows)
        );
        localStorage.setItem(
          LOCAL_STORAGE_LAYOUT_KEY,
          JSON.stringify(layouts)
        );
      } catch {
        console.warn(MIDDLEWARE_STRINGS.PERSIST_ERROR);
      }
    }

    return result;
  };
```

### 2. Action Registration

The middleware uses action matchers (`action.match()`) to determine if an action should trigger persistence. Each action that modifies `desktopWindows` or `layouts` must be registered.

## Adding a New Action

### Step-by-Step Guide

**1. Create the action in DesktopSlice**

```typescript
// src/components/Desktop/DesktopSlice.ts
const DesktopSlice = createSlice({
  name: 'Desktop',
  initialState,
  reducers: {
    // ... existing actions
    minimizeWindow: (state, action: PayloadAction<string>) => {
      const window = state.desktopWindows.find(w => w.id === action.payload);
      
      if (window) {
        window.minimized = true; // Modifies state
      }
    },
  },
});

export const { minimizeWindow } = DesktopSlice.actions;
```

**2. Import the action in middleware**

```typescript
// src/middleware/desktopStorageMiddleware.ts
import {
  removeWindow,
  addWindow,
  updateLayouts,
  resetLayouts,
  removeAllWindows,
  organizeGrid,
  minimizeWindow, // ← Add your import
} from '../components/Desktop/DesktopSlice';
```

**3. Register in the if condition**

```typescript
if (
  removeWindow.match(action) ||
  addWindow.match(action) ||
  updateLayouts.match(action) ||
  resetLayouts.match(action) ||
  removeAllWindows.match(action) ||
  organizeGrid.match(action) ||
  minimizeWindow.match(action) // ← Add your matcher
) {
  // Persist to localStorage
}
```

## What Happens If You Forget?

If you don't register an action in the middleware:

❌ **Problem**: Changes are applied to Redux state but NOT saved to localStorage
❌ **Result**: State is lost on page reload
❌ **User Impact**: Users lose their window arrangements, positions, and configurations

## Currently Registered Actions

| Action | Purpose | Modifies |
|--------|---------|----------|
| `addWindow` | Adds a new window | `desktopWindows`, `layouts` |
| `removeWindow` | Removes a window | `desktopWindows`, `layouts` |
| `updateLayouts` | Updates window positions/sizes | `layouts` |
| `resetLayouts` | Resets all layouts to defaults | `layouts` |
| `organizeGrid` | Organizes windows in grid | `layouts` |
| `removeAllWindows` | Clears all windows | `desktopWindows`, `layouts` |

## Actions That DON'T Need Registration

Actions that only modify `focusedWindowId` do NOT need registration because focus is not persisted:

```typescript
// This action does NOT need middleware registration
setFocus: (state, action: PayloadAction<string | null>) => {
  state.focusedWindowId = action.payload; // Only modifies focus
},
```

## Testing Persistence

When adding a new action, add a test in `desktopStorageMiddleware.test.ts`:

```typescript
it('persists when yourAction is dispatched', () => {
  store.dispatch(yourAction(payload));

  const savedData = localStorage.getItem(LOCAL_STORAGE_DESKTOP_KEY);
  expect(savedData).toBeTruthy();
  
  const data = JSON.parse(savedData!);
  // Assert expected state
});
```

## Checklist for New Actions

When adding a new Desktop action:

- [ ] Action added to `DesktopSlice.ts`
- [ ] Action imported in `desktopStorageMiddleware.ts`
- [ ] Action matcher added to middleware if condition
- [ ] Test added to `desktopStorageMiddleware.test.ts`
- [ ] Verified state persists after page reload

## Common Mistakes

### ❌ Mistake 1: Forgetting to Import

```typescript
// BAD: Action not imported
if (
  removeWindow.match(action) ||
  yourAction.match(action) // ← Error: yourAction is not defined
) {
```

### ❌ Mistake 2: Wrong Import Path

```typescript
// BAD: Importing from wrong file
import { yourAction } from './DesktopSlice'; // ← Wrong path
```

### ❌ Mistake 3: Not Adding to If Condition

```typescript
// BAD: Action imported but not registered
import { yourAction } from '../components/Desktop/DesktopSlice';

if (
  removeWindow.match(action) ||
  addWindow.match(action)
  // ← Missing: yourAction.match(action) ||
) {
```

## Best Practices

1. **Always test persistence** after adding a new action
2. **Document the action** in the middleware comment block
3. **Add tests** for the new action in middleware tests
4. **Update this document** when adding new patterns
5. **Review the middleware** when reviewing PRs that add Desktop actions

## Related Files

- `src/middleware/desktopStorageMiddleware.ts` - The middleware implementation
- `src/middleware/desktopStorageMiddleware.test.ts` - Middleware tests
- `src/components/Desktop/DesktopSlice.ts` - Desktop actions
- `src/components/Desktop/config.ts` - localStorage keys

## Questions?

If you're unsure whether an action needs registration:

**Ask yourself**: Does this action modify `desktopWindows` or `layouts`?
- **Yes** → Register in middleware
- **No** → No registration needed

When in doubt, register it. Extra registrations are harmless, but missing registrations cause bugs.
