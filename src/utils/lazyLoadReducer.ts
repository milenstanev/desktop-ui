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
