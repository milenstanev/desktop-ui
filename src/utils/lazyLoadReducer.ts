import { EnhancedStore, Reducer } from '@reduxjs/toolkit';

export function lazyLoadReducer(store: EnhancedStore, key: string, reducer: Reducer) {
  const reducerManager = (store as any).reducerManager;
  if (!reducerManager.getReducerMap()[key]) {
    reducerManager.add(key, reducer);
    store.replaceReducer(reducerManager.reduce);
  }
}
