import React, {lazy, useCallback, Suspense, useState} from 'react';
import { useStore } from "react-redux";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {removeWindow, updateLayouts} from './DesktopSlice';
import { LayoutBreakpoint, DesktopUIWindow } from './types';
import WindowComponent from '../../components/Window';
import { componentLoader, ComponentNames } from '../../utils/componentLoader';
import { removeLazyLoadedReducer } from "../../utils/lazyLoadReducer";
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
  const [breakpoint, setBreakpoint] = useState<LayoutBreakpoint>('lg');
  const dispatch = useAppDispatch();
  const store = useStore();

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

  const unloadWindow = useCallback((id: string, lazyLoadReducerName: string) => {
    dispatch(removeWindow(id));

    const foundComponentWithSameReducer = windows.find((window: DesktopUIWindow) => {
      return window.lazyLoadReducerName === lazyLoadReducerName && window.id !== id;
    });

    if (!foundComponentWithSameReducer) {
      removeLazyLoadedReducer(store, lazyLoadReducerName);
    }
  }, [dispatch, store, windows]);

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
        {windows.map((window: DesktopUIWindow) => (
          <div key={window.id}>
            <WindowComponent
              name={window.name}
              id={window.id}
              removeWindow={unloadWindow}
              lazyLoadReducerName={window.lazyLoadReducerName}
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

