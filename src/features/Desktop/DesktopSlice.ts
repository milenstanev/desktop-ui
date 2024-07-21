import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { Layouts } from 'react-grid-layout';
import { ComponentNames } from './componentLoader';

export interface DesktopUIWindow {
  id: string;
  name: string;
  lazyLoadComponent?: ComponentNames;
}

interface State {
  desktopWindows: DesktopUIWindow[];
  layouts: Layouts | undefined;
}

const LOCAL_STORAGE_DESKTOP_KEY = 'desktop';
const LOCAL_STORAGE_LAYOUT_KEY = 'layouts';

const storedWindows = localStorage.getItem(LOCAL_STORAGE_DESKTOP_KEY);
const desktopWindows = storedWindows ? JSON.parse(storedWindows) as DesktopUIWindow[] : [];
const storedLayouts = localStorage.getItem(LOCAL_STORAGE_LAYOUT_KEY);
const layouts = storedLayouts ? JSON.parse(storedLayouts) as Layouts : undefined;
const saveWindowsToLocalStorage = (desktopWindows: DesktopUIWindow[]) => {
  localStorage.setItem(LOCAL_STORAGE_DESKTOP_KEY, JSON.stringify(desktopWindows));
}

const initialState: State = {
  desktopWindows,
  layouts,
}

export const DesktopSlice = createSlice({
  name: "Desktop",
  initialState,
  reducers: {
    removeWindow: (state, action: PayloadAction<string>) => {
      const index = state.desktopWindows.findIndex(window => window.id === action.payload);
      if (index !== -1) {
        state.desktopWindows.splice(index, 1);
        saveWindowsToLocalStorage(state.desktopWindows);
      }
    },
    addWindow: (state, action: PayloadAction<DesktopUIWindow>) => {
      if(!state.desktopWindows.find((window) => window.id === action.payload.id)) {
        state.desktopWindows.unshift(action.payload);
        saveWindowsToLocalStorage(state.desktopWindows);
        if (state.layouts) {
          state.layouts.lg.push({ i: `${action.payload.id}`, x: 0, y: 0, w: 4, h: 2 });
        }
      }
    },
    updateLayouts: (state, action: PayloadAction<Layouts>) => {
      state.layouts = action.payload;
      localStorage.setItem(LOCAL_STORAGE_LAYOUT_KEY, JSON.stringify(action.payload));
    },
  }
});

export const {
  removeWindow,
  addWindow,
  updateLayouts,
} = DesktopSlice.actions;

export default DesktopSlice.reducer;
