# Future Features Roadmap

This document suggests enhancements for the Desktop UI project. Each feature includes a description, rationale, and rough effort level.

---

## 1. UX & Window Management

### 1.1 Window State (Minimize / Maximize)

**Description**: Allow windows to be minimized to the taskbar and maximized to fullscreen, similar to a real desktop.

**Details**:
- Add `state: 'normal' | 'minimized' | 'maximized'` to `DesktopUIWindow`
- Minimized windows hide content but stay in layout; taskbar shows them
- Maximized window takes full grid area, temporarily
- Persist state in Redux and localStorage

**Why**: Aligns with user expectations from OS desktops and improves multi-window workflow.

**Effort**: Medium (2–3 days)

---

### 1.2 Window Focus & Z-Index ✅ IMPLEMENTED

**Description**: Bring a window to front when clicked; show visual focus state with gradient border.

**Status**: Implemented with animated gradient borders, z-index management, and theme-specific styling.

**Implementation**: See `DesktopSlice.ts` (focusedWindowId tracking), `Window.tsx` (focus handlers), and `Window.module.css` (gradient border animations).

---

### 1.3 Window Stacking / Overlap Mode

**Description**: Optional “free” layout where windows can overlap instead of grid snapping.

**Details**:
- Add layout mode: `grid` (current) vs `free`
- In free mode, use absolute positioning; windows can overlap
- Still support drag; optional resize handles

**Why**: More flexibility for users who prefer overlapping windows.

**Effort**: Large (4–5 days)

---

### 1.4 Keyboard Shortcuts ✅ PARTIALLY IMPLEMENTED

**Description**: Shortcuts for common actions (close window, focus next, minimize, etc.).

**Status**: Implemented `Escape` and `Cmd/Ctrl + W` to close focused window.

**Remaining**:
- `Cmd/Ctrl + M`: Minimize focused window
- `Cmd/Ctrl + 1/2/3`: Focus window by index
- Add shortcut cheatsheet in Help or Settings

**Implementation**: See `Desktop.tsx` (keyboard event listener).

**Effort for remaining**: Small (1 day)

---

### 1.5 Layout Management Controls ✅ IMPLEMENTED

**Description**: Quick controls for managing window layouts.

**Status**: Implemented with three control buttons in header.

**Details**:
- **Organize Grid**: Arranges all windows in equal-sized grid (3×3 each, 4 per row)
- **Reset Layout**: Resets windows to default positions (4×4 each, tiled 3 per row)
- **Close All**: Removes all windows and clears layouts

**Implementation**: See `DesktopSlice.ts` (organizeGrid, resetLayouts, removeAllWindows actions), `Header.tsx` (control buttons).

---


## 2. Taskbar & System UI

### 2.1 Clickable Taskbar Icons

**Description**: Taskbar shows one icon per open window; click to focus/restore.

**Details**:
- FooterTaskbar renders icons for each window
- Click focuses and restores if minimized
- Active window visually highlighted

**Why**: Matches desktop paradigm and supports minimize/restore flow.

**Effort**: Medium (2 days)

---

### 2.2 System Menu / Start Menu

**Description**: A “Start” or menu button that opens a list of available “apps” (component types).

**Details**:
- Replace or complement header buttons with a dropdown
- Shows SimpleExample, Counter, FormEditor, Notes, Timer (and future features)
- Click to add window

**Why**: Cleaner UI as the number of component types grows.

**Effort**: Small (1 day)

---

### 2.3 Clock & System Tray

**Description**: Show current time and a simple system tray area.

**Details**:
- Clock in taskbar (local time)
- Optional tray area for “running” indicators or settings

**Why**: Feels more like a real desktop environment.

**Effort**: Small (0.5–1 day)

---

## 3. Theming & Appearance

### 3.1 Theme System ✅ IMPLEMENTED

**Description**: Let users switch between multiple themes.

**Status**: Implemented with three themes (Light, Dark, Gradient) via dropdown selector.

**Details**:
- CSS variables for colors
- Dropdown in header with theme selector
- Persist preference in localStorage
- Gradient theme includes golden accents, larger grid gaps, and icons

**Implementation**: See `ThemeContext.tsx`, `index.css`, `Header.tsx`.

---

### 3.2 Customizable Window Header Styles

**Description**: Allow different header colors or styles per window type or user preference.

**Details**:
- `theme` or `headerColor` on window config
- Or global theme settings

**Why**: Personalization and visual hierarchy.

**Effort**: Small (0.5–1 day)

---

### 3.3 Custom Wallpaper

**Description**: Let users choose a background image or color for the desktop.

**Details**:
- Background image/color in Desktop component
- Settings UI to pick from presets or upload
- Persist in localStorage

**Why**: Personalization and product differentiation.

**Effort**: Small (1 day)

---

## 4. Data & Persistence

### 4.1 Named Layouts / Workspaces

**Description**: Save and load named layouts (e.g. “Work”, “Dev”, “Dashboard”).

**Details**:
- Store multiple layout presets (windows + positions)
- Dropdown or list to switch
- Persist presets in localStorage or IndexedDB

**Why**: Users switch contexts; presets speed that up.

**Effort**: Medium (2–3 days)

---

### 4.2 Export / Import Layout

**Description**: Export current layout as JSON and import it elsewhere.

**Details**:
- Export: serialize desktop state to JSON
- Import: validate, then apply
- Useful for sharing setups or moving between devices

**Why**: Portability and backup.

**Effort**: Small (1 day)

---

### 4.3 IndexedDB for Large State

**Description**: Use IndexedDB instead of localStorage when state grows.

**Details**:
- Migrate persistence to IndexedDB
- Keep localStorage as fallback for small state
- Optional compression for big layouts

**Why**: localStorage has ~5MB limit; IndexedDB scales better.

**Effort**: Medium (2 days)

---

## 5. Extensibility & Architecture

### 5.1 Plugin / Widget Registry

**Description**: Central registry for available components; plugins register themselves.

**Details**:
- Registry: `{ name, loader, reducer?, defaultLayout? }`
- Components self-register on load
- Header or Start menu reads from registry

**Why**: Easier to add new window types without editing core code.

**Effort**: Medium (2–3 days)

---

### 5.2 Runtime Window Registration

**Description**: Add new window types at runtime (e.g. from config or remote).

**Details**:
- Dynamic `componentLoader` and reducer registration
- Config-driven window definitions

**Why**: Enables customization and multi-tenant setups.

**Effort**: Large (3–4 days)

---

### 5.3 IPC / Message Passing Between Windows

**Description**: Windows can send and receive messages (e.g. pub/sub or targeted).

**Details**:
- Event bus or Redux-based messaging
- `postMessage`-style API for window-to-window communication

**Why**: Enables coordinated workflows across components.

**Effort**: Medium–Large (3 days)

---

## 6. Testing & Quality

### 6.1 E2E Tests in CI

**Description**: Run Playwright E2E tests in GitHub Actions.

**Details**:
- Start dev server in CI
- `npx playwright install`
- Run `npx playwright test`
- Optional: only on PRs to main

**Why**: Catch integration issues before merge.

**Effort**: Small (0.5–1 day)

---

### 6.2 Visual Regression Tests

**Description**: Screenshot-based regression for Desktop and windows.

**Details**:
- Playwright screenshots or Percy/Chromatic
- Baseline on main; compare on PRs

**Why**: Avoid unintended UI changes.

**Effort**: Medium (1–2 days)

---

### 6.3 Error Reporting Integration

**Description**: Send errors to Sentry or similar.

**Details**:
- Integrate Sentry SDK
- Report in `ErrorBoundary.componentDidCatch`
- Optional user feedback form

**Why**: Real-world monitoring and faster debugging.

**Effort**: Small (1 day)

---

## 7. Performance

### 7.1 Virtualization for Many Windows

**Description**: Only render windows in viewport when many are open.

**Details**:
- Use `react-window` or similar
- Or lazy-render offscreen windows with placeholder

**Why**: Keeps performance good with 20+ windows.

**Effort**: Large (3–4 days)

---

### 7.2 Debounced Layout Persistence

**Description**: Debounce localStorage writes during rapid drag/resize.

**Details**:
- Middleware debounces persistence by ~300ms
- Reduces write load during interaction

**Why**: Smoother UX and fewer writes.

**Effort**: Small (0.5 day)

---

## 8. Accessibility

### 8.1 Focus Management

**Description**: Correct focus behavior when opening/closing windows.

**Details**:
- Focus new window when opened
- Return focus to trigger on close
- Trap focus inside modal-style windows if needed

**Why**: Better keyboard and screen reader use.

**Effort**: Small–Medium (1–2 days)

---

### 8.2 Screen Reader Announcements

**Description**: Announce window and layout changes.

**Details**:
- Use `aria-live` regions
- Announce: “Window added”, “Window closed”, “Layout updated”

**Why**: Keeps assistive tech users in sync with UI changes.

**Effort**: Small (0.5–1 day)

---

## 9. Developer Experience

### 9.1 Storybook for Components

**Description**: Add Storybook for Window, ErrorBoundary, and future components.

**Details**:
- Stories for each component
- Document props and variants

**Why**: Easier development and design review.

**Effort**: Small (1 day)

---

### 9.2 Development Tools Panel

**Description**: Dev-only panel for Redux state and layout debugging.

**Details**:
- Toggle to show current state
- Inspect/edit layouts
- Trigger actions for testing

**Why**: Faster debugging during development.

**Effort**: Medium (1–2 days)

---

## 10. Mobile & Responsiveness

### 10.1 Touch-Friendly Window Controls

**Description**: Larger tap targets and swipe gestures on small screens.

**Details**:
- Bigger drag handle and close button
- Optional swipe-to-close

**Why**: Usability on tablets and phones.

**Effort**: Medium (1–2 days)

---

### 10.2 Stacked Layout on Mobile

**Description**: On small screens, show windows as a vertical stack with tabs.

**Details**:
- Single visible window with tab bar to switch
- Or accordion-style list

**Why**: Grid layout is hard to use on phones.

**Effort**: Medium (2 days)

---

## Priority Matrix (Suggested)

| Priority | Feature | Status | Effort |
|----------|---------|--------|--------|
| ~~High~~ | ~~Window Focus & Z-Index~~ | ✅ Done | ~~Small~~ |
| ~~Medium~~ | ~~Keyboard Shortcuts~~ | ✅ Partial | ~~Small–Medium~~ |
| ~~Medium~~ | ~~Dark/Light Theme~~ | ✅ Done | ~~Small~~ |
| High | Taskbar Icons (clickable) | Pending | Medium |
| High | E2E Tests in CI | Pending | Small |
| High | Error Reporting (Sentry) | Pending | Small |
| Medium | Window Minimize/Maximize | Pending | Medium |
| Medium | Named Layouts / Workspaces | Pending | Medium |
| Low | Plugin Registry | Pending | Medium |
| Low | Virtualization | Pending | Large |

---

## Contributing

When implementing a feature:

1. Create an ADR in `docs/decisions/` for significant changes
2. Add/update tests
3. Update this document if the roadmap changes
4. Add an entry to `CHANGELOG.md`
