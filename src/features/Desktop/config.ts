import { WindowLayout } from './types';

export const LOCAL_STORAGE_DESKTOP_KEY = 'desktopUI.desktop';
export const LOCAL_STORAGE_LAYOUT_KEY = 'desktopUI.layouts';
export const defaultWindowsPositions: WindowLayout = {
  lg: { i: '', x: 0, y: 0, w: 4, h: 2 },
  md: { i: '', x: 0, y: 0, w: 4, h: 2 },
  sm: { i: '', x: 0, y: 0, w: 1, h: 1 },
};
