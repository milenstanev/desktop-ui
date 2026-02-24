import React, { lazy, useCallback, Suspense, useState, useEffect, useMemo } from 'react';
import { useStore } from "react-redux";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { removeWindow, updateLayouts, setFocus } from './DesktopSlice';
import { LayoutBreakpoint, DesktopUIWindow } from './types';
import WindowComponent from '../../components/Window';
import { componentLoader, ComponentNames } from '../../utils/componentLoader';
import { removeLazyLoadedReducer } from "../../utils/lazyLoadReducer";
import type { StoreWithReducerManager } from "../../app/store";
import styles from './Desktop.module.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface LazyLoadedComponentProps extends React.Attributes {
  windowId: string;
  windowName: string;
  lazyLoadReducerName: string;
}
type LazyComponentType = React.ComponentType<LazyLoadedComponentProps>;

const Desktop: React.FC = () => {
  const windows = useAppSelector((state) => state.Desktop.desktopWindows);
  const savedLayouts = useAppSelector((state) => state.Desktop.layouts);
  const focusedWindowId = useAppSelector((state) => state.Desktop.focusedWindowId);
  const [breakpoint, setBreakpoint] = useState<LayoutBreakpoint>('lg');
  const dispatch = useAppDispatch();
  const store = useStore();

  const windowsSorted = useMemo(() => {
    if (!focusedWindowId) return windows;
    const focused = windows.find((w: DesktopUIWindow) => w.id === focusedWindowId);
    if (!focused) return windows;
    const rest = windows.filter((w: DesktopUIWindow) => w.id !== focusedWindowId);
    return [...rest, focused];
  }, [windows, focusedWindowId]);

  const loadWindow = useCallback((componentName: ComponentNames) => {
    const loader = componentLoader[componentName];

    if (loader) {
      return lazy(() =>
        loader().then((module) => {
          return { default: module.default as LazyComponentType };
        })
      );
    } else {
      throw new Error(`Unknown component: ${componentName}`);
    }
  },[]);

  const handleRemoveWindow = useCallback((id: string, lazyLoadReducerName: string) => {
    dispatch(removeWindow(id));

    const componentWithSameReducer = windows.find((window: DesktopUIWindow) => (
      window.lazyLoadReducerName === lazyLoadReducerName && window.id !== id
    ));
    if (!componentWithSameReducer) {
      removeLazyLoadedReducer(store as StoreWithReducerManager, lazyLoadReducerName);
    }
  }, [dispatch, store, windows]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedWindowId) return;
      if (e.key === 'Escape' || (e.key === 'w' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        const win = windows.find((w: DesktopUIWindow) => w.id === focusedWindowId);
        if (win) {
          dispatch(removeWindow(focusedWindowId));
          const componentWithSameReducer = windows.find(
            (w: DesktopUIWindow) => w.lazyLoadReducerName === win.lazyLoadReducerName && w.id !== focusedWindowId
          );
          if (!componentWithSameReducer) {
            removeLazyLoadedReducer(store as StoreWithReducerManager, win.lazyLoadReducerName ?? '');
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedWindowId, windows, dispatch, store]);

  const handleFocusWindow = useCallback((id: string) => {
    dispatch(setFocus(id));
  }, [dispatch]);

  /*const layouts: Layouts = useMemo(() => {
    const layoutsData: Layouts = { lg: [], md: [], sm: [], };
    let xPosition = -1;

    windows.forEach((window: DesktopUIWindow, index: number) => {
      xPosition++;
      if (xPosition > 2) {
        xPosition = 0;
      }
      layoutsData.lg.push({ i: `${window.id}`, x: xPosition * 4, y: index, w: 4, h: 2 });
      layoutsData.md.push({ i: `${window.id}`, x: xPosition * 4, y: index, w: 4, h: 2 });
      layoutsData.sm.push({ i: `${window.id}`, x: xPosition * 4, y: index, w: 1, h: 1 });
    });
    return layoutsData;
  }, [windows]);*/

  return (
    <div className={styles.desktop}>
      <ResponsiveReactGridLayout
        cols={{ lg: 12, md: 8, sm: 2 }}
        layouts={savedLayouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        onDragStop={(layout) => {
          dispatch(updateLayouts({ layout, breakpoint }));
        }}
        onResizeStop={(layout) => {
          dispatch(updateLayouts({ layout, breakpoint }));
        }}
        onBreakpointChange={(newBreakpoint: LayoutBreakpoint) => setBreakpoint(newBreakpoint)}
        draggableHandle=".drag-handle"
      >
        {windowsSorted.map((window: DesktopUIWindow) => (
          <div key={window.id} style={{ zIndex: window.id === focusedWindowId ? 10 : 1 }}>
            <WindowComponent
              name={window.name}
              id={window.id}
              removeWindow={handleRemoveWindow}
              lazyLoadReducerName={window.lazyLoadReducerName}
              isFocused={window.id === focusedWindowId}
              onFocus={() => handleFocusWindow(window.id)}
            >
              <Suspense fallback={<div>Loading...</div>}>
                {window.lazyLoadComponent && (
                  React.createElement(
                    loadWindow(window.lazyLoadComponent),
                    {
                      windowId: window.id,
                      windowName: window.name,
                      lazyLoadReducerName: window.lazyLoadReducerName,
                    } as LazyLoadedComponentProps
                  )
                )}
              </Suspense>
            </WindowComponent>
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default Desktop;

