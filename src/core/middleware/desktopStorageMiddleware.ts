import { Middleware } from '@reduxjs/toolkit';
import { removeAllWindows } from '~/features/Desktop/DesktopSlice';
import {
  LOCAL_STORAGE_DESKTOP_KEY,
  LOCAL_STORAGE_LAYOUT_KEY,
} from '~/features/Desktop/config';
import type { RootState } from '~/core/store';
import { MIDDLEWARE_STRINGS } from '~/shared/constants';

const DESKTOP_SLICE_NAME = 'Desktop';
const WINDOWS_PROPERTY = 'desktopWindows';
const LAYOUTS_PROPERTY = 'layouts';

/**
 * Desktop Storage Middleware
 *
 * Persists Desktop `desktopWindows` and `layouts` when their references change.
 * This avoids brittle action whitelists and automatically handles new actions
 * that mutate either of these two state branches.
 *
 * `removeAllWindows` is handled explicitly by removing persisted keys.
 */

export const desktopStorageMiddleware: Middleware<object, RootState> =
  (store) => (next) => (action) => {
    const prevDesktopState = store.getState()[DESKTOP_SLICE_NAME];
    const result = next(action);
    const nextDesktopState = store.getState()[DESKTOP_SLICE_NAME];

    if (removeAllWindows.match(action)) {
      try {
        localStorage.removeItem(LOCAL_STORAGE_DESKTOP_KEY);
        localStorage.removeItem(LOCAL_STORAGE_LAYOUT_KEY);
      } catch {
        console.warn(MIDDLEWARE_STRINGS.PERSIST_ERROR);
      }
      return result;
    }

    const windowsChanged =
      prevDesktopState[WINDOWS_PROPERTY] !== nextDesktopState[WINDOWS_PROPERTY];
    const layoutsChanged =
      prevDesktopState[LAYOUTS_PROPERTY] !== nextDesktopState[LAYOUTS_PROPERTY];

    if (windowsChanged || layoutsChanged) {
      const {
        [WINDOWS_PROPERTY]: desktopWindows,
        [LAYOUTS_PROPERTY]: layouts,
      } = nextDesktopState;

      try {
        localStorage.setItem(
          LOCAL_STORAGE_DESKTOP_KEY,
          JSON.stringify(desktopWindows)
        );
        localStorage.setItem(LOCAL_STORAGE_LAYOUT_KEY, JSON.stringify(layouts));
      } catch {
        console.warn(MIDDLEWARE_STRINGS.PERSIST_ERROR);
      }
    }

    return result;
  };
