/**
 * Load Remote Feature via Module Federation
 *
 * Dynamically loads a remote container and fetches the Feature export.
 * Provides the host's React/ReactDOM to the remote to avoid multiple React instances.
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactJsxRuntime from 'react/jsx-runtime';
import { registerFeature } from '~/core/feature-registry';
import type { FeatureModule } from '~/core/feature-types';
import { store } from '~/core/store';

export interface RemoteConfig {
  name: string;
  url: string;
  entryUrl: string;
}

const REMOTES: Record<string, RemoteConfig> = {
  analytics: {
    name: 'analytics',
    url: process.env.REACT_APP_ANALYTICS_REMOTE_URL || 'http://localhost:3002',
    entryUrl:
      (process.env.REACT_APP_ANALYTICS_REMOTE_URL || 'http://localhost:3002') +
      '/remoteEntry.js',
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
  const config = REMOTES[remoteName];
  if (!config) {
    throw new Error(`Unknown remote: ${remoteName}`);
  }

  await loadScript(config.entryUrl);

  const container = (window as unknown as Record<string, unknown>)[
    remoteName
  ] as
    | {
        init: (scope: unknown) => Promise<void>;
        get: (module: string) => Promise<() => { default: FeatureModule }>;
      }
    | undefined;

  if (!container?.init || !container?.get) {
    throw new Error(
      `Remote "${remoteName}" container not found. Ensure ${config.entryUrl} is served and exposes the container.`
    );
  }

  const win = window as Window & {
    __webpack_init_sharing__?: (scope: string) => Promise<void>;
    __webpack_share_scopes__?: {
      default: Record<string, Record<string, unknown>>;
    };
  };
  if (typeof win.__webpack_init_sharing__ === 'function') {
    await win.__webpack_init_sharing__('default');
  }

  const scope = win.__webpack_share_scopes__?.default ?? {};
  const ensureReactInScope = () => {
    if (!scope.react) {
      scope.react = {
        '18.3.1': {
          get: () => Promise.resolve(() => React),
          loaded: 1,
          from: 'desktopUI',
        },
      };
    }
    if (!scope['react-dom']) {
      scope['react-dom'] = {
        '18.3.1': {
          get: () => Promise.resolve(() => ReactDOM),
          loaded: 1,
          from: 'desktopUI',
        },
      };
    }
    if (!scope['react/jsx-runtime']) {
      scope['react/jsx-runtime'] = {
        '18.3.1': {
          get: () => Promise.resolve(() => ReactJsxRuntime),
          loaded: 1,
          from: 'desktopUI',
        },
      };
    }
  };
  ensureReactInScope();
  await container.init(scope);

  const factory = await container.get('./Feature');
  const mod = factory();
  const feature = mod.default;

  if (!feature?.name || !feature?.component) {
    throw new Error(`Invalid FeatureModule from remote "${remoteName}"`);
  }

  registerFeature(feature);

  if (feature.reducer) {
    const storeWithManager = store as typeof store & {
      reducerManager?: { add: (key: string, reducer: unknown) => void };
    };
    if (storeWithManager.reducerManager) {
      storeWithManager.reducerManager.add(
        feature.reducer!.name,
        feature.reducer!.reducer
      );
    }
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
