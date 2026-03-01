# Performance & Benchmarks

## Bundle Size (Production Build)

Run `npm run build` and check the printed sizes. Example output (gzipped):

| Asset | Role |
|-------|------|
| `main.*.js` | App shell, Redux, Desktop grid, router-free bootstrap |
| `453.*.chunk.js` | react-grid-layout (shared by all windows) |
| `776.*.chunk.js`, `821.*.chunk.js`, … | Lazy feature chunks (loaded when a window of that type is opened) |

**Impact of dynamic injection:** Features that are never opened never load. Initial load only pays for the shell + grid; Notes, Timer, ComponentLazy2, etc. are separate chunks.

## How to Capture Benchmarks

### 1. Bundle analysis (optional)

```bash
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

Use this to see which packages or modules dominate the main bundle and lazy chunks.

### 2. Lighthouse (production build)

```bash
npm run build
npx serve -s build -l 3000
# In another terminal, or in Chrome DevTools:
# Lighthouse → Performance (and optionally Best Practices / Accessibility)
```

Focus on:

- **LCP** (Largest Contentful Paint): shell + grid should paint quickly.
- **FCP** (First Contentful Paint): minimal JS before first paint.
- **Total Blocking Time**: keep main-thread work low; lazy chunks load after interaction.

### 3. Real-user metrics

If you deploy, consider:

- **Web Vitals** (e.g. `web-vitals` package) sending LCP, FID, CLS to your analytics.
- **Custom marks**: e.g. time from navigation to “first window opened” to measure perceived feature readiness.

## What We Optimize For

- **Initial load**: Only the desktop shell and grid; no feature code until the user opens a window.
- **Per-feature cost**: Each feature is a separate chunk; closing all windows of that type allows the chunk (and its Redux state) to be discarded.
- **Persistence**: `localStorage` is synchronous but small (layout + window list); for very large state, consider IndexedDB and moving persistence off the critical path.
