# Micro-Frontend Architecture

Desktop UI supports local features and remote micro-frontends via Webpack Module Federation. Features can run inside the monolith or as independent remote apps.

## Problem

Large applications struggle with:
- Monolithic deployments (one team blocks all releases)
- Tight coupling (features depend on each other)
- Slow build and test cycles

## Architecture

```
App Shell (Desktop UI)
│
├── Local Features (from monolith)
│   ├── Counter
│   ├── Notes
│   ├── Form Editor
│   └── Timer
│
└── Remote Features (via Module Federation)
    └── Analytics (src/features/remotes/analytics, optional submodule)
```

## Feature Contract

Every feature — local or remote — implements the `FeatureModule` interface:

```typescript
interface FeatureModule {
  name: string;
  displayName: string;
  component: ComponentType<RemoteWindowProps>;
  reducer?: { name: string; reducer: Reducer };
  init?: () => void | Promise<void>;
}
```

## Local vs Remote

| Aspect | Local | Remote |
|--------|-------|--------|
| Code location | `src/features/*` | Separate app (e.g. `src/features/remotes/analytics`) |
| Loaded via | `componentLoader` | `loadRemoteFeature()` |
| Deployed with | Main app | Independently |
| Reducer | Injected via `useLazyLoadReducer` | Injected via `loadRemoteFeature` |

## Remote Feature Example: Analytics

The analytics remote app (`src/features/remotes/analytics`) exposes a Feature module:

**src/features/remotes/analytics/src/Feature.tsx**

```typescript
const AnalyticsFeature: FeatureModule = {
  name: 'analytics',
  displayName: 'Analytics',
  component: AnalyticsComponent,
  reducer: { name: 'analytics', reducer: analyticsSlice.reducer },
};
export default AnalyticsFeature;
```

**src/features/remotes/analytics/webpack.config.js**

```javascript
new ModuleFederationPlugin({
  name: 'analytics',
  filename: 'remoteEntry.js',
  exposes: { './Feature': './src/Feature' },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});
```

## Loading a Remote

1. User clicks **Load Analytics Feature** in the Architecture panel
2. `loadRemoteFeature('analytics')` fetches `http://localhost:3002/remoteEntry.js`
3. The remote container initializes shared scope (React, Redux)
4. `registerFeature()` adds the feature to the registry
5. Reducer is injected via `store.reducerManager.add()`
6. A new window opens with the remote component

## Deployment Strategy

- **Local features**: Built and deployed with the main app
- **Remote features**: Built and deployed independently; host loads them at runtime
- **Shared dependencies**: React, Redux as singletons; versions must be compatible

### Environment Variables

- `REACT_APP_ANALYTICS_REMOTE_URL` — Analytics remote URL (default: `http://localhost:3002`)

For production, set the full URL where the remote is deployed:

```
REACT_APP_ANALYTICS_REMOTE_URL=https://analytics.myapp.com
```

## Running the Demo

1. **Build and serve desktop-ui** (port 3000):
   ```bash
   npm run build && npx serve -s build -l 3000
   ```

2. **Start analytics remote** (port 3002):
   ```bash
   cd src/features/remotes/analytics && npm install && npm run start
   ```
   Or from repo root: `npm run analytics:start`

### Using the analytics remote as a Git submodule

To track the analytics app in a separate repo:

1. Create a new repo (e.g. `desktop-ui-analytics-remote`) and push the contents of `src/features/remotes/analytics` there.
2. Remove the in-tree folder and add the submodule:
   ```bash
   rm -rf src/features/remotes/analytics
   git submodule add <analytics-repo-url> src/features/remotes/analytics
   ```
3. After cloning desktop-ui, run `git submodule update --init --recursive` to fetch the analytics remote.

3. **Open desktop-ui** in the browser, expand **Architecture**, click **Load Analytics Feature**
