import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { ComponentNames } from './componentLoader';

interface DesktopUIWindow {
  id: string;
  name: string;
  // lazyLoadComponent?: LazyExoticComponent<FC<{}>>;
  lazyLoadComponent?: ComponentNames;
}

const initialState: DesktopUIWindow[] = [
  {
    id: '1',
    name: 'Component 1',
    lazyLoadComponent: 'ComponentLazy',
  },
  {
    id: '2',
    name: 'Component 2',
  },
  {
    id: '3',
    name: 'Component 3',
  },
  {
    id: '4',
    name: 'Component 2',
  },
  {
    id: '5',
    name: 'Component 3',
  },
];

export const DesktopSlice = createSlice({
  name: "Desktop",
  initialState,
  reducers: {
    removeWindow: (state) => {
      return state.filter((window) => window.id !== '1');
    },
    addWindow: (state, action: PayloadAction<DesktopUIWindow>) => {
      state.unshift(action.payload);
    }
  }
});

export const { removeWindow, addWindow } = DesktopSlice.actions;

export default DesktopSlice.reducer;
