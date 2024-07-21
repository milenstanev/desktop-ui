import React, {lazy, useCallback, Suspense, useMemo, useEffect} from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Responsive, WidthProvider, Layouts } from 'react-grid-layout';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { updateLayouts } from './DesktopSlice';
import WindowComponent from '../../components/Window';
import { componentLoader, ComponentNames } from './componentLoader';
import styles from './Desktop.module.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const Desktop: React.FC = () => {
  const windows = useAppSelector((state) => state.Desktop.desktopWindows);
  const savedLayouts = useAppSelector((state) => state.Desktop.layouts);
  const dispatch = useAppDispatch();

  const loadComponent = useCallback((componentName: ComponentNames) => {
    const loader = componentLoader[componentName];

    if (loader) {
      return lazy(loader);
    } else {
      throw new Error(`Unknown component: ${componentName}`);
    }
  },[]);

  const layouts: Layouts = useMemo(() => {
    const layoutsData: Layouts = { lg: [], md: [], sm: [], };
    let xPosition = -1;

    windows.forEach((window, index) => {
      xPosition++;
      if (xPosition > 2) {
        xPosition = 0;
      }
      layoutsData.lg.push({ i: `${window.id}`, x: xPosition * 4, y: index, w: 4, h: 2 });
      layoutsData.md.push({ i: `${window.id}`, x: xPosition * 4, y: index, w: 4, h: 2 });
      layoutsData.sm.push({ i: `${window.id}`, x: xPosition * 4, y: index, w: 1, h: 1 });
    });
    return layoutsData;
  }, [windows]);

  return (
    <div className={styles.desktop}>
      <ResponsiveReactGridLayout
        cols={{ lg: 12, md: 8, sm: 2 }}
        layouts={savedLayouts ?? layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        onLayoutChange={(currentLayout, allLayouts) => {
          dispatch(updateLayouts(allLayouts));
        }}
        draggableHandle=".drag-handle"
      >
        {windows.map((window) => (
          <div key={window.id}>
            <WindowComponent name={window.name} id={window.id}>
              <Suspense fallback={<div>Loading...</div>}>
                {window.lazyLoadComponent && (
                  React.createElement(loadComponent(window.lazyLoadComponent))
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

