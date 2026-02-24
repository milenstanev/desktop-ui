/**
 * Injects a feature's Redux reducer when the feature component mounts.
 *
 * Used by window content that has its own slice (e.g. Notes, ComponentLazy2).
 * On mount we call lazyLoadReducer(store, key, reducer), which adds the slice
 * to the reducer manager and replaces the store's root reducer. The feature
 * can then use useSelector(state => state[key]) as usual. When the last
 * window of this type is closed, Desktop calls removeLazyLoadedReducer(store, key)
 * so the slice and its state are removed.
 */
import { useEffect } from 'react';
import { useStore } from 'react-redux';
import { lazyLoadReducer } from '../utils/lazyLoadReducer';
import type { StoreWithReducerManager } from '../app/store';
import type { Reducer } from '@reduxjs/toolkit';

type UseLazyLoadReducerParams = {
  lazyLoadReducerName: string;
  featureReducer: Reducer;
};

function useLazyLoadReducer({
  lazyLoadReducerName,
  featureReducer,
}: UseLazyLoadReducerParams) {
  const store = useStore() as StoreWithReducerManager;

  useEffect(() => {
    lazyLoadReducer(store, lazyLoadReducerName, featureReducer);
  }, [featureReducer, lazyLoadReducerName, store]);
}

export default useLazyLoadReducer;
