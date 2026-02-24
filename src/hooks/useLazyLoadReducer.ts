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
