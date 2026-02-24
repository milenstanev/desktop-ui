# Desktop UI

A React-based desktop-style interface with draggable, resizable windows. Windows are lazy-loaded with their own Redux slices, and layouts persist across sessions.

## Tech Stack

- **React 18** with TypeScript
- **Redux Toolkit** with dynamic reducer injection
- **react-grid-layout** for draggable/resizable window layouts
- **Playwright** for E2E testing

## Getting Started

### Prerequisites

- Node.js 16+
- npm 7+

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Runs the app at [http://localhost:3000](http://localhost:3000).

### Scripts

| Script     | Description                    |
| ---------- | ------------------------------ |
| `npm start`| Start dev server               |
| `npm test` | Run unit tests (watch mode)    |
| `npm run build` | Production build          |
| `npx playwright test` | Run E2E tests         |

### E2E Tests

Start the app, then run:

```bash
npx playwright test
```

## Project Structure

```
src/
├── app/                 # App shell, store, header, footer
├── components/          # Shared UI (Window, ErrorBoundary)
├── features/            # Feature modules (Desktop, lazy-loaded windows)
├── hooks/               # Custom hooks (useLazyLoadReducer)
└── utils/               # Reducer manager, component loader, lazy load helpers
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for details.

## Learn More

- [Architecture Overview](./ARCHITECTURE.md)
- [Architecture Decision Records](./docs/decisions/)
- [Future Features Roadmap](./docs/FUTURE_FEATURES.md)
- [Implemented Features (this branch)](./docs/IMPLEMENTED_FEATURES.md)