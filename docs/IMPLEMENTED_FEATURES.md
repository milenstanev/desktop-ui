# Implemented Features (feature/implemented-features)

This branch implements three features from the [Future Features Roadmap](./FUTURE_FEATURES.md), with tests.

---

## 1. Window focus & z-index

**What**: A single window can be focused. The focused window is brought to the front (higher z-index) and has a visible focus ring.

**Changes**:
- **DesktopSlice**: `focusedWindowId: string | null` in state; `setFocus(id | null)` action; new windows get focus on add; focus is cleared when a window is removed.
- **Desktop**: Sorts windows so the focused one is last (rendered on top); passes `isFocused` and `onFocus` to each `Window`; sets `zIndex` on the wrapper div.
- **Window**: `isFocused` and `onFocus` props; header is clickable/focusable to focus the window; `.focused` class for border and box-shadow.

**Tests**: `DesktopSlice.test.ts` (focus on add, clear on remove, setFocus); `Window.test.tsx` (focused class, onFocus when header clicked).

---

## 2. Keyboard shortcuts

**What**: **Escape** and **Cmd+W** (Mac) / **Ctrl+W** (Windows/Linux) close the currently focused window.

**Changes**:
- **Desktop**: `useEffect` that subscribes to `keydown` on `window`; if `focusedWindowId` is set and key is `Escape` or `w` with meta/ctrl, dispatches `removeWindow` and cleans up the lazy reducer when needed.

**Tests**: `Desktop.keyboard.test.tsx` (Escape and Cmd+W close the focused window).

---

## 3. Dark / light theme toggle

**What**: Users can switch between light and dark theme. The choice is persisted in `localStorage` and applied via `data-theme` on the document root.

**Changes**:
- **config**: `LOCAL_STORAGE_THEME_KEY = 'desktopUI.theme'`.
- **ThemeContext**: `ThemeProvider`, `useTheme()` with `theme`, `setTheme`, `toggleTheme`; initial theme from localStorage; syncs `data-theme` and localStorage on change.
- **index.css**: CSS variables for `--bg`, `--text`, `--border`; `[data-theme="dark"]` overrides.
- **Window.module.css**: Uses `var(--border)` for window border.
- **App**: Wraps the app in `ThemeProvider`.
- **Header**: “Dark mode” / “Light mode” button that calls `toggleTheme`.

**Tests**: `ThemeContext.test.tsx` (default light, setTheme, toggleTheme, data-theme attribute, error when used outside provider).

---

## How to run tests

```bash
npm test -- --watchAll=false
```

All new and updated tests should pass.
