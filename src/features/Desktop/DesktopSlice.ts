import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Layouts, Layout } from 'react-grid-layout';
import { DesktopUIWindow, LayoutBreakpoint } from './types';
import {
  LOCAL_STORAGE_LAYOUT_KEY,
  LOCAL_STORAGE_DESKTOP_KEY,
  INITIAL_STATE_CONFIG,
} from './config';
import { safeParseJson } from '~/shared/utils/storage';
import {
  createDefaultLayoutsForWindows,
  createEmptyLayouts,
  createLayoutsForNewWindow,
  createOrganizedLayoutsForWindows,
  removeWindowFromAllLayouts,
} from './layoutUtils';

/**
 * Desktop Slice
 *
 * Manages the state for the desktop grid, including windows, layouts, and focus.
 *
 * IMPORTANT: Persistence to localStorage
 * ========================================
 * Persistence middleware tracks reference changes to `desktopWindows` and
 * `layouts`, so any reducer that mutates one of those two branches is persisted
 * automatically.
 */

interface State {
  desktopWindows: DesktopUIWindow[];
  layouts: Layouts;
  focusedWindowId: string | null;
}

function isDesktopUIWindowArray(value: unknown): value is DesktopUIWindow[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item != null &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.name === 'string'
    )
  );
}

function isLayouts(value: unknown): value is Layouts {
  if (value == null || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    Array.isArray(obj.lg) && Array.isArray(obj.md) && Array.isArray(obj.sm)
  );
}

const storedWindows = safeParseJson<DesktopUIWindow[]>(
  LOCAL_STORAGE_DESKTOP_KEY,
  [],
  isDesktopUIWindowArray
);

const hasStoredWindows = storedWindows.length > 0;
const desktopWindows: DesktopUIWindow[] = hasStoredWindows
  ? storedWindows
  : INITIAL_STATE_CONFIG.initialWindows;

const rawLayouts = safeParseJson<Layouts>(
  LOCAL_STORAGE_LAYOUT_KEY,
  hasStoredWindows ? createEmptyLayouts() : INITIAL_STATE_CONFIG.initialLayouts,
  isLayouts
);
// Migrate old layouts to include xl breakpoint
const layouts: Layouts = {
  xl: (rawLayouts as any).xl || [],
  lg: rawLayouts.lg || [],
  md: rawLayouts.md || [],
  sm: rawLayouts.sm || [],
};

const isFirstVisit = !hasStoredWindows;
const initialState: State = {
  desktopWindows,
  layouts,
  focusedWindowId:
    isFirstVisit && desktopWindows.length > 0 ? desktopWindows[0].id : null,
};

export const DesktopSlice = createSlice({
  name: 'Desktop',
  initialState,
  reducers: {
    removeWindow: (state, action: PayloadAction<string>) => {
      const index = state.desktopWindows.findIndex(
        (window) => window.id === action.payload
      );
      if (index !== -1) {
        if (state.focusedWindowId === action.payload) {
          state.focusedWindowId = null;
        }
        state.desktopWindows.splice(index, 1);
        removeWindowFromAllLayouts(state.layouts, action.payload);
      }
    },
    addWindow: (state, action: PayloadAction<DesktopUIWindow>) => {
      if (
        !state.desktopWindows.find((window) => window.id === action.payload.id)
      ) {
        const windowCount = state.layouts.lg.length;
        state.desktopWindows.unshift(action.payload);
        state.focusedWindowId = action.payload.id;

        const { xl, lg, md, sm } = createLayoutsForNewWindow(
          action.payload.id,
          windowCount,
          action.payload.layout
        );
        state.layouts.xl.push(xl);
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
    resetLayouts: (state) => {
      state.layouts = createDefaultLayoutsForWindows(state.desktopWindows);
    },
    removeAllWindows: (state) => {
      state.desktopWindows = [];
      state.layouts = createEmptyLayouts();
      state.focusedWindowId = null;
    },
    organizeGrid: (state) => {
      state.layouts = createOrganizedLayoutsForWindows(state.desktopWindows);
    },
  },
});

export const {
  removeWindow,
  addWindow,
  updateLayouts,
  setFocus,
  resetLayouts,
  removeAllWindows,
  organizeGrid,
} = DesktopSlice.actions;

export default DesktopSlice.reducer;
