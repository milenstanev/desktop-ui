/**
 * Dynamic reducer injection: attach a feature's Redux slice when its window mounts,
 * and detach when the last window of that type unmounts.
 *
 * - lazyLoadReducer(store, key, reducer): registers the reducer under `key` with
 *   the store's reducer manager and replaces the store's root reducer with the
 *   manager's current reduce function. Redux's store.replaceReducer() is what
 *   makes the new root reducer active. Called from useLazyLoadReducer when a
 *   feature component mounts.
 *
 * - removeLazyLoadedReducer(store, key): removes the reducer for `key` and
 *   replaces the root reducer again so the slice's state is no longer in the
 *   tree. Called from Desktop when the last window using that slice is closed.
 *
 * The store must be created with the reducer manager's reduce as the root
 * reducer (see app/store.ts).
 */
import { Reducer } from '@reduxjs/toolkit';
import type { StoreWithReducerManager } from '../app/store';

export function lazyLoadReducer(
  store: StoreWithReducerManager,
  key: string,
  reducer: Reducer
): void {
  if (!store.reducerManager.getReducerMap()[key]) {
    store.reducerManager.add(key, reducer);
    store.replaceReducer(store.reducerManager.reduce);
  }
}

export function removeLazyLoadedReducer(
  store: StoreWithReducerManager,
  key: string
): void {
  if (store.reducerManager.getReducerMap()[key]) {
    store.reducerManager.remove(key);
    store.replaceReducer(store.reducerManager.reduce);
  }
}
