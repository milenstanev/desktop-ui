import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { createReducerManager } from '../utils/reducerManager';
import DesktopReducer from '../features/Desktop/DesktopSlice';
import { desktopStorageMiddleware } from '../middleware/desktopStorageMiddleware';
import type { ReducerManager } from '../utils/reducerManager';

export interface StoreWithReducerManager extends EnhancedStore {
  reducerManager: ReducerManager;
}

export function setupStore(preloadedState?: Record<string, unknown>): StoreWithReducerManager {
  const reducerManager = createReducerManager({
    Desktop: DesktopReducer,
  });

  const store = configureStore({
    reducer: reducerManager.reduce,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(desktopStorageMiddleware),
  }) as StoreWithReducerManager;

  store.reducerManager = reducerManager;

  return store;
}

export const store = setupStore();

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
