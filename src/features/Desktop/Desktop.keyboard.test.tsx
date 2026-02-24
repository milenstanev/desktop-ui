import React from 'react';
import { Provider } from 'react-redux';
import { render, fireEvent } from '@testing-library/react';
import { setupStore } from '../../app/store';
import { addWindow } from './DesktopSlice';
import Desktop from './Desktop';
import type { DesktopUIWindow } from './types';

function renderDesktopWithWindow() {
  const store = setupStore();
  const windowPayload: DesktopUIWindow = {
    id: 'keyboard-test-window',
    name: 'Keyboard Test',
    layout: undefined,
    lazyLoadComponent: 'ComponentLazy',
    lazyLoadReducerName: 'ComponentLazy2Reducer',
  };
  store.dispatch(addWindow(windowPayload));

  render(
    <Provider store={store}>
      <Desktop />
    </Provider>
  );

  return store;
}

describe('Desktop keyboard shortcuts', () => {
  it('closes focused window on Escape', () => {
    const store = renderDesktopWithWindow();
    expect(store.getState().Desktop.desktopWindows).toHaveLength(1);
    expect(store.getState().Desktop.focusedWindowId).toBe('keyboard-test-window');

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(store.getState().Desktop.desktopWindows).toHaveLength(0);
    expect(store.getState().Desktop.focusedWindowId).toBeNull();
  });

  it('closes focused window on Cmd+W (Mac) or Ctrl+W', () => {
    const store = renderDesktopWithWindow();

    fireEvent.keyDown(window, { key: 'w', metaKey: true });

    expect(store.getState().Desktop.desktopWindows).toHaveLength(0);
  });
});
