import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Layouts, Layout } from 'react-grid-layout';
import { DesktopUIWindow, LayoutBreakpoint } from './types';
import { LOCAL_STORAGE_LAYOUT_KEY, LOCAL_STORAGE_DESKTOP_KEY, defaultWindowsPositions } from './config';
import { safeParseJson } from '../../utils/storage';

interface State {
  desktopWindows: DesktopUIWindow[];
  layouts: Layouts;
  focusedWindowId: string | null;
}

function isDesktopUIWindowArray(value: unknown): value is DesktopUIWindow[] {
  return Array.isArray(value) && value.every(
    (item) =>
      item != null &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.name === 'string'
  );
}

function isLayouts(value: unknown): value is Layouts {
  if (value == null || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    Array.isArray(obj.lg) &&
    Array.isArray(obj.md) &&
    Array.isArray(obj.sm)
  );
}

const defaultLayouts: Layouts = { lg: [], md: [], sm: [] };
const desktopWindows = safeParseJson<DesktopUIWindow[]>(
  LOCAL_STORAGE_DESKTOP_KEY,
  [],
  isDesktopUIWindowArray
);
const layouts = safeParseJson<Layouts>(
  LOCAL_STORAGE_LAYOUT_KEY,
  defaultLayouts,
  isLayouts
);

const initialState: State = {
  desktopWindows,
  layouts,
  focusedWindowId: null,
};

export const DesktopSlice = createSlice({
  name: 'Desktop',
  initialState,
  reducers: {
    removeWindow: (state, action: PayloadAction<string>) => {
      const index = state.desktopWindows.findIndex((window) => window.id === action.payload);
      if (index !== -1) {
        if (state.focusedWindowId === action.payload) {
          state.focusedWindowId = null;
        }
        state.desktopWindows.splice(index, 1);

        const breakpoints: LayoutBreakpoint[] = ['lg', 'md', 'sm'];
        breakpoints.forEach((breakpoint) => {
          state.layouts[breakpoint] = state.layouts[breakpoint].filter(
            (layout) => layout.i !== action.payload
          );
        });
      }
    },
    addWindow: (state, action: PayloadAction<DesktopUIWindow>) => {
      if (!state.desktopWindows.find((window) => window.id === action.payload.id)) {
        state.desktopWindows.unshift(action.payload);
        state.focusedWindowId = action.payload.id;

        const lg: Layout =
          action.payload.layout?.lg ?? {
            ...defaultWindowsPositions.lg,
            i: `${action.payload.id}`,
          };
        const md: Layout =
          action.payload.layout?.md ?? {
            ...defaultWindowsPositions.md,
            i: `${action.payload.id}`,
          };
        const sm: Layout =
          action.payload.layout?.sm ?? {
            ...defaultWindowsPositions.sm,
            i: `${action.payload.id}`,
          };

        state.layouts.lg.push(lg);
        state.layouts.md.push(md);
        state.layouts.sm.push(sm);
      }
    },
    updateLayouts: (
      state,
      action: PayloadAction<{ layout: Layout[]; breakpoint: LayoutBreakpoint }>
    ) => {
      state.layouts = {
        ...state.layouts,
        [action.payload.breakpoint]: action.payload.layout,
      };
    },
    setFocus: (state, action: PayloadAction<string | null>) => {
      state.focusedWindowId = action.payload;
    },
  },
});

export const { removeWindow, addWindow, updateLayouts, setFocus } = DesktopSlice.actions;

export default DesktopSlice.reducer;
