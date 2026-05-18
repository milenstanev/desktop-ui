/**
 * Load Remote Feature via Module Federation
 *
 * Dynamically loads a remote container and fetches the Feature export.
 * Provides the host's React/ReactDOM to the remote to avoid multiple React instances.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactJsxRuntime from 'react/jsx-runtime';
import {
  getFeature,
  hasFeature,
  registerFeature,
} from '~/core/feature-registry';
import type { FeatureModule } from '~/core/feature-types';
import { lazyLoadReducer } from '~/core/utils/lazyLoadReducer';
import { store, type StoreWithReducerManager } from '~/core/store';

export interface RemoteConfig {
  name: string;
  url: string;
  entryUrls: string[];
}

type ShareScope = Record<string, Record<string, unknown>>;

type ModuleFederationContainer = {
  init: (scope: unknown) => Promise<void>;
  get: (module: string) => Promise<() => { default: unknown }>;
};

const remoteLoadCache = new Map<string, Promise<FeatureModule>>();
const initializedContainers = new WeakSet<ModuleFederationContainer>();

function isFeatureModule(value: unknown): value is FeatureModule {
  if (value == null || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Partial<FeatureModule>;
  return (
    typeof candidate.name === 'string' &&
    typeof candidate.displayName === 'string' &&
    typeof candidate.component === 'function'
  );
}

function ensureSharedSingleton(
  scope: ShareScope,
  moduleKey: string,
  moduleValue: unknown,
  version: string
): void {
  if (scope[moduleKey]) {
    return;
  }

  scope[moduleKey] = {
    [version]: {
      get: () => Promise.resolve(() => moduleValue),
      loaded: 1,
      from: 'desktopUI',
    },
  };
}

function getReactDomVersion(): string {
  const version = (ReactDOM as unknown as { version?: string }).version;
  if (typeof version === 'string' && version.trim()) {
    return version;
  }
  return React.version;
}

function getAnalyticsRemoteBaseUrl(): string {
  const configured = process.env.REACT_APP_ANALYTICS_REMOTE_URL;
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  const isLocalHost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '[::1]';
  if (isLocalHost) {
    return 'http://localhost:3002';
  }

  // In production, default to same-origin deployment.
  // The loader will also try a "/remote" variant for Vercel microfrontends.
  if (process.env.NODE_ENV === 'production') {
    return `${window.location.origin}`;
  }

  return 'http://localhost:3002';
}

function buildRemoteEntryUrls(baseUrl: string): string[] {
  const resolved = new URL(baseUrl, window.location.origin);
  const basePath = resolved.pathname.replace(/\/+$/, '');

  const toEntryUrl = (path: string): string => {
    const normalizedPath = path.replace(/\/+$/, '');
    return normalizedPath
      ? `${resolved.origin}${normalizedPath}/remoteEntry.js`
      : `${resolved.origin}/remoteEntry.js`;
  };

  const candidates: string[] = [];
  candidates.push(toEntryUrl(basePath));

  if (basePath.endsWith('/remote')) {
    const rootPath = basePath.slice(0, -'/remote'.length);
    candidates.push(toEntryUrl(rootPath));
  } else {
    candidates.push(toEntryUrl(`${basePath}/remote`));
  }

  // Always keep pure origin as final fallback.
  candidates.push(toEntryUrl(''));

  return Array.from(new Set(candidates));
}

const REMOTES: Record<string, RemoteConfig> = {
  analytics: {
    name: 'analytics',
    url: getAnalyticsRemoteBaseUrl(),
    entryUrls: buildRemoteEntryUrls(getAnalyticsRemoteBaseUrl()),
  },
};

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

/**
 * Load a feature from a remote micro-frontend and register it.
 * Injects the reducer if present.
 */
export async function loadRemoteFeature(
  remoteName: string
): Promise<FeatureModule> {
  const existingFeature = hasFeature(remoteName)
    ? getFeature(remoteName)
    : null;
  if (existingFeature) {
    return existingFeature;
  }

  const cached = remoteLoadCache.get(remoteName);
  if (cached) {
    return cached;
  }

  const loadPromise = loadRemoteFeatureInternal(remoteName);
  remoteLoadCache.set(remoteName, loadPromise);

  try {
    return await loadPromise;
  } catch (error) {
    remoteLoadCache.delete(remoteName);
    throw error;
  }
}

async function loadRemoteFeatureInternal(
  remoteName: string
): Promise<FeatureModule> {
  const config = REMOTES[remoteName];
  if (!config) {
    throw new Error(`Unknown remote: ${remoteName}`);
  }

  let loadError: Error | null = null;
  for (const entryUrl of config.entryUrls) {
    try {
      await loadScript(entryUrl);
      loadError = null;
      break;
    } catch (error) {
      loadError = error instanceof Error ? error : new Error(String(error));
    }
  }
  if (loadError) {
    throw loadError;
  }

  const container = (window as unknown as Record<string, unknown>)[
    remoteName
  ] as ModuleFederationContainer | undefined;

  if (!container?.init || !container?.get) {
    const availableContainerGlobals = Object.keys(
      window as unknown as Record<string, unknown>
    )
      .filter((key) => /^[a-zA-Z_$][\w$]*$/.test(key))
      .filter(
        (key) =>
          ['desktopUI', 'analytics', 'host'].includes(key) ||
          key.toLowerCase().includes('remote')
      )
      .slice(0, 10);

    throw new Error(
      `Remote "${remoteName}" container not found. Tried: ${config.entryUrls.join(
        ', '
      )}. Ensure one URL serves a valid remoteEntry.js that exposes "${remoteName}".` +
        (availableContainerGlobals.length
          ? ` Available container-like globals: ${availableContainerGlobals.join(', ')}.`
          : '')
    );
  }

  const win = window as Window & {
    __webpack_init_sharing__?: (scope: string) => Promise<void>;
    __webpack_share_scopes__?: {
      default: ShareScope;
    };
  };
  if (typeof win.__webpack_init_sharing__ === 'function') {
    await win.__webpack_init_sharing__('default');
  }

  const scope = win.__webpack_share_scopes__?.default ?? {};
  ensureSharedSingleton(scope, 'react', React, React.version);
  ensureSharedSingleton(scope, 'react-dom', ReactDOM, getReactDomVersion());
  ensureSharedSingleton(
    scope,
    'react/jsx-runtime',
    ReactJsxRuntime,
    React.version
  );

  if (!initializedContainers.has(container)) {
    await container.init(scope);
    initializedContainers.add(container);
  }

  const factory = await container.get('./Feature');
  const mod = factory();
  if (!isFeatureModule(mod.default)) {
    throw new Error(`Invalid FeatureModule from remote "${remoteName}"`);
  }
  const feature = mod.default;

  registerFeature(feature);

  if (feature.reducer) {
    const appStore = store as StoreWithReducerManager;
    const reducerMap = appStore.reducerManager.getReducerMap();
    const existingReducer = reducerMap[feature.reducer.name];

    if (
      existingReducer &&
      existingReducer !== feature.reducer.reducer &&
      process.env.NODE_ENV !== 'production'
    ) {
      console.warn(
        `Reducer "${feature.reducer.name}" already exists with a different implementation. Keeping existing reducer.`
      );
    }

    lazyLoadReducer(appStore, feature.reducer.name, feature.reducer.reducer);
  }

  if (feature.init) {
    await feature.init();
  }

  return feature;
}

export function getRemoteConfig(remoteName: string): RemoteConfig | undefined {
  return REMOTES[remoteName];
}

export function getAvailableRemotes(): string[] {
  return Object.keys(REMOTES);
}
