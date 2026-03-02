import React, {
  lazy,
  useCallback,
  Suspense,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useStore } from 'react-redux';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useAppSelector, useAppDispatch } from '~/app/hooks';
import { removeWindow, updateLayouts, setFocus } from './DesktopSlice';
import { LayoutBreakpoint, DesktopUIWindow } from './types';
import WindowComponent from '~/components/Window/Window';
import Loader from '~/components/Loader/Loader';
import { componentLoader, ComponentNames } from '~/utils/componentLoader';
import { removeLazyLoadedReducer } from '~/utils/lazyLoadReducer';
import type { StoreWithReducerManager } from '~/app/store';
import styles from './Desktop.module.css';
import { useTheme } from '~/contexts/ThemeContext';
import { DESKTOP_STRINGS, LAYOUT_CONFIG } from '~/constants';
import { useKeyboardShortcuts } from '~/hooks/useKeyboardShortcuts';
import { TEST_SELECTORS } from '~/testSelectors';

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
  const focusedWindowId = useAppSelector(
    (state) => state.Desktop.focusedWindowId
  );
  const [breakpoint, setBreakpoint] = useState<LayoutBreakpoint>('lg');
  const dispatch = useAppDispatch();
  const store = useStore();
  const { theme } = useTheme();

  const windowsSorted = useMemo(() => {
    if (!focusedWindowId) return windows;
    const focused = windows.find(
      (w: DesktopUIWindow) => w.id === focusedWindowId
    );
    if (!focused) return windows;
    const rest = windows.filter(
      (w: DesktopUIWindow) => w.id !== focusedWindowId
    );
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
      throw new Error(
        `${DESKTOP_STRINGS.ERROR_UNKNOWN_COMPONENT} ${componentName}`
      );
    }
  }, []);

  const handleRemoveWindow = useCallback(
    (id: string) => {
      dispatch(removeWindow(id));
      // Note: Reducer cleanup is handled by the useEffect that tracks window changes
    },
    [dispatch]
  );

  // Centralized reducer cleanup: tracks window changes and cleans up unused reducers
  const prevReducersRef = React.useRef<Set<string>>(new Set());

  useEffect(() => {
    // Collect current reducers in use
    const currentReducers = new Set<string>();
    windows.forEach((window: DesktopUIWindow) => {
      if (window.lazyLoadReducerName) {
        currentReducers.add(window.lazyLoadReducerName);
      }
    });

    // Find reducers that are no longer in use
    const reducersToRemove = Array.from(prevReducersRef.current).filter(
      (reducerName) => !currentReducers.has(reducerName)
    );

    // Clean up unused reducers
    reducersToRemove.forEach((reducerName) => {
      removeLazyLoadedReducer(store as StoreWithReducerManager, reducerName);
    });

    // Update tracking for next render
    prevReducersRef.current = currentReducers;
  }, [windows, store]);

  // Keyboard shortcuts for closing focused window
  useKeyboardShortcuts(
    // Escape key handler
    () => {
      if (focusedWindowId) {
        dispatch(removeWindow(focusedWindowId));
      }
    },
    // Cmd/Ctrl+W handler
    () => {
      if (focusedWindowId) {
        dispatch(removeWindow(focusedWindowId));
      }
    },
    // Only enabled when there's a focused window
    !!focusedWindowId
  );

  const handleFocusWindow = useCallback(
    (id: string) => {
      dispatch(setFocus(id));
    },
    [dispatch]
  );

  const gridMargin = useMemo<[number, number]>(() => {
    return theme === 'gradient' ? [20, 20] : [10, 10];
  }, [theme]);

  const containerPadding = useMemo<[number, number]>(() => {
    return theme === 'gradient' ? [20, 20] : [10, 10];
  }, [theme]);

  return (
    <div
      className={styles.desktop}
      data-testid={TEST_SELECTORS.DESKTOP_CONTAINER}
      role="application"
      aria-label={DESKTOP_STRINGS.DESKTOP_ARIA_LABEL}
    >
      <ResponsiveReactGridLayout
        cols={LAYOUT_CONFIG.COLS}
        layouts={savedLayouts}
        breakpoints={LAYOUT_CONFIG.BREAKPOINTS}
        rowHeight={80}
        margin={gridMargin}
        containerPadding={containerPadding}
        onDragStop={(layout) => {
          dispatch(updateLayouts({ layout, breakpoint }));
        }}
        onResizeStop={(layout) => {
          dispatch(updateLayouts({ layout, breakpoint }));
        }}
        onBreakpointChange={(newBreakpoint: LayoutBreakpoint) =>
          setBreakpoint(newBreakpoint)
        }
        draggableHandle={`.${LAYOUT_CONFIG.DRAG_HANDLE_CLASS}`}
      >
        {windowsSorted.map((window: DesktopUIWindow) => (
          <div
            key={window.id}
            style={{
              zIndex:
                window.id === focusedWindowId
                  ? LAYOUT_CONFIG.Z_INDEX_FOCUSED
                  : LAYOUT_CONFIG.Z_INDEX_NORMAL,
            }}
          >
            <WindowComponent
              name={window.name}
              id={window.id}
              removeWindow={handleRemoveWindow}
              lazyLoadReducerName={window.lazyLoadReducerName}
              isFocused={window.id === focusedWindowId}
              onFocus={() => handleFocusWindow(window.id)}
            >
              <Suspense fallback={<Loader />}>
                {window.lazyLoadComponent &&
                  React.createElement(loadWindow(window.lazyLoadComponent), {
                    windowId: window.id,
                    windowName: window.name,
                    lazyLoadReducerName: window.lazyLoadReducerName,
                  } as LazyLoadedComponentProps)}
              </Suspense>
            </WindowComponent>
          </div>
        ))}
      </ResponsiveReactGridLayout>
    </div>
  );
};

export default Desktop;
