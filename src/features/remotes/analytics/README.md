# Analytics Remote

Micro-frontend that exposes an Analytics feature via Module Federation. Consumed by Desktop UI.

This folder can be a **Git submodule** (separate repo) or live in-tree.

## Development

```bash
npm install
npm run start
```

Runs on port 3002. The main app loads `http://localhost:3002/remoteEntry.js` when loading the Analytics feature.

## Build

```bash
npm run build
```

Output in `dist/`. Deploy `dist/` and configure Desktop UI with `REACT_APP_ANALYTICS_REMOTE_URL` pointing to the deployed URL.
