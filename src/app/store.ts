import { configureStore } from "@reduxjs/toolkit";
import DesktopReducer from '../features/Desktop/DesktopSlice'

export const store = configureStore({
  reducer: {
    Desktop: DesktopReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
