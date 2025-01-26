// reducerManager.ts
import { combineReducers, Reducer } from '@reduxjs/toolkit';

interface ReducerManager {
  getReducerMap: () => { [key: string]: Reducer };
  reduce: (state: any, action: any) => any;
  add: (key: string, reducer: Reducer) => void;
  remove: (key: string) => void;
}

export function createReducerManager(initialReducers: { [key: string]: Reducer }): ReducerManager {
  const reducers = { ...initialReducers };
  let combinedReducer = combineReducers(reducers);
  let keysToRemove: string[] = [];

  return {
    getReducerMap: () => reducers,

    reduce: (state: any, action: any) => {
      if (keysToRemove.length > 0) {
        state = { ...state };
        keysToRemove.forEach(key => delete state[key]);
        keysToRemove = [];
      }
      return combinedReducer(state, action);
    },

    add: (key: string, reducer: Reducer) => {
      if (!key || reducers[key]) {
        return;
      }
      reducers[key] = reducer;
      combinedReducer = combineReducers(reducers);
    },

    remove: (key: string) => {
      if (!key || !reducers[key]) {
        return;
      }
      delete reducers[key];
      keysToRemove.push(key);
      combinedReducer = combineReducers(reducers);
    },
  };
}
