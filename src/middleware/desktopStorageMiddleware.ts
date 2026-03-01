import { Middleware } from '@reduxjs/toolkit';
import { removeWindow, addWindow, updateLayouts } from '../features/Desktop/DesktopSlice';
import {
  LOCAL_STORAGE_DESKTOP_KEY,
  LOCAL_STORAGE_LAYOUT_KEY,
} from '../features/Desktop/config';
import type { RootState } from '../app/store';

export const desktopStorageMiddleware: Middleware<object, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    if (removeWindow.match(action) || addWindow.match(action) || updateLayouts.match(action)) {
      const state = store.getState();
      const { desktopWindows, layouts } = state.Desktop;

      try {
        localStorage.setItem(LOCAL_STORAGE_DESKTOP_KEY, JSON.stringify(desktopWindows));
        localStorage.setItem(LOCAL_STORAGE_LAYOUT_KEY, JSON.stringify(layouts));
      } catch {
        console.warn('Failed to persist desktop state to localStorage');
      }
    }

    return result;
  };
