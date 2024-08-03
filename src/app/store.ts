import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { createReducerManager } from '../utils/reducerManager';
import DesktopReducer from '../features/Desktop/DesktopSlice'

/*export const store = configureStore({
  reducer: {
    Desktop: DesktopReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});*/

export function setupStore(preloadedState?: any): EnhancedStore {
  const reducerManager = createReducerManager({
    Desktop: DesktopReducer,
  });

  const store = configureStore({
    reducer: reducerManager.reduce,
    preloadedState,
  });

  (store as any).reducerManager = reducerManager;

  return store;
}

export const store = setupStore();

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
