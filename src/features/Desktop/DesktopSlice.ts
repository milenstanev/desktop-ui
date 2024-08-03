import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { Layouts, Layout } from 'react-grid-layout';
import { DesktopUIWindow, LayoutBreakpoint } from './types';
import { LOCAL_STORAGE_LAYOUT_KEY, LOCAL_STORAGE_DESKTOP_KEY } from './config';

interface State {
  desktopWindows: DesktopUIWindow[];
  layouts: Layouts;
}

const storedWindows = localStorage.getItem(LOCAL_STORAGE_DESKTOP_KEY);
const desktopWindows = storedWindows ? JSON.parse(storedWindows) as DesktopUIWindow[] : [];

const storedLayouts = localStorage.getItem(LOCAL_STORAGE_LAYOUT_KEY);
const layouts = storedLayouts ? JSON.parse(storedLayouts) as Layouts : { lg: [], md: [], sm: [] };

const saveWindowsToLocalStorage = (desktopWindows: DesktopUIWindow[]) => {
  localStorage.setItem(LOCAL_STORAGE_DESKTOP_KEY, JSON.stringify(desktopWindows));
}
const saveLayoutsToLocalStorage = (layouts: Layouts) => {
  localStorage.setItem(LOCAL_STORAGE_LAYOUT_KEY, JSON.stringify(layouts));
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

        const breakpoints: LayoutBreakpoint[] = ['lg', 'md', 'sm'];
        breakpoints.forEach((breakpoint) => {
          state.layouts[breakpoint] = state.layouts[breakpoint].filter(layout => layout.i !== action.payload);
        });
        saveLayoutsToLocalStorage(state.layouts);
      }
    },
    addWindow: (state, action: PayloadAction<DesktopUIWindow>) => {
      if(!state.desktopWindows.find((window) => window.id === action.payload.id)) {
        state.desktopWindows.unshift(action.payload);
        saveWindowsToLocalStorage(state.desktopWindows);

        const lg: Layout = action.payload.layout?.lg ?? { i: `${action.payload.id}`, x: 0, y: 0, w: 4, h: 2 };
        const md: Layout = action.payload.layout?.md ?? { i: `${action.payload.id}`, x: 0, y: 0, w: 4, h: 2 };
        const sm: Layout = action.payload.layout?.sm ?? { i: `${action.payload.id}`, x: 0, y: 0, w: 1, h: 1 };

        state.layouts.lg.push(lg);
        state.layouts.md.push(md);
        state.layouts.sm.push(sm);
        saveLayoutsToLocalStorage(state.layouts);
      }
    },
    updateLayouts: (
      state,
      action: PayloadAction<{ layout: Layout[], breakpoint: LayoutBreakpoint }>
    ) => {
      state.layouts = {
        ...state.layouts,
        [action.payload.breakpoint]: action.payload.layout,
      };
      saveLayoutsToLocalStorage(state.layouts);
    },
  }
});

export const {
  removeWindow,
  addWindow,
  updateLayouts,
} = DesktopSlice.actions;

export default DesktopSlice.reducer;
