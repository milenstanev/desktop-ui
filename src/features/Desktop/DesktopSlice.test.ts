import reducer, { addWindow, removeWindow, updateLayouts, setFocus } from './DesktopSlice';
import type { DesktopUIWindow, LayoutBreakpoint } from './types';

const createWindow = (overrides: Partial<DesktopUIWindow> = {}): DesktopUIWindow =>
  ({
    id: 'w1',
    name: 'Test Window',
    layout: undefined,
    lazyLoadComponent: 'ComponentLazy',
    lazyLoadReducerName: 'ComponentLazy2',
    ...overrides,
  }) as DesktopUIWindow;

describe('DesktopSlice', () => {
  const initialState = {
    desktopWindows: [] as DesktopUIWindow[],
    layouts: { lg: [], md: [], sm: [] },
    focusedWindowId: null as string | null,
  };

  it('adds window', () => {
    const window = createWindow();
    const state = reducer(initialState, addWindow(window));
    expect(state.desktopWindows).toHaveLength(1);
    expect(state.desktopWindows[0].id).toBe('w1');
    expect(state.layouts.lg).toHaveLength(1);
    expect(state.focusedWindowId).toBe('w1');
  });

  it('sets focused window when adding', () => {
    const w1 = createWindow({ id: 'w1' });
    const w2 = createWindow({ id: 'w2' });
    let state = reducer(initialState, addWindow(w1));
    expect(state.focusedWindowId).toBe('w1');
    state = reducer(state, addWindow(w2));
    expect(state.focusedWindowId).toBe('w2');
  });

  it('does not add duplicate window by id', () => {
    const window = createWindow();
    let state = reducer(initialState, addWindow(window));
    state = reducer(state, addWindow(window));
    expect(state.desktopWindows).toHaveLength(1);
  });

  it('removes window', () => {
    const window = createWindow();
    let state = reducer(initialState, addWindow(window));
    state = reducer(state, removeWindow('w1'));
    expect(state.desktopWindows).toHaveLength(0);
    expect(state.layouts.lg).toHaveLength(0);
    expect(state.focusedWindowId).toBeNull();
  });

  it('updates layouts', () => {
    const layout = [{ i: 'w1', x: 0, y: 0, w: 4, h: 2 }];
    const state = reducer(
      { ...initialState, layouts: { lg: layout, md: [], sm: [] } },
      updateLayouts({ layout, breakpoint: 'lg' })
    );
    expect(state.layouts.lg).toEqual(layout);
  });

  it('setFocus updates focusedWindowId', () => {
    let state = reducer(initialState, setFocus('w1'));
    expect(state.focusedWindowId).toBe('w1');
    state = reducer(state, setFocus(null));
    expect(state.focusedWindowId).toBeNull();
  });
});
