import React, {lazy, useCallback, Suspense, useMemo, useEffect} from 'react';
import '/node_modules/react-grid-layout/css/styles.css';
import '/node_modules/react-resizable/css/styles.css';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { removeWindow, addWindow } from './DesktopSlice';
import WindowComponent from '../../components/Window';
import { componentLoader, ComponentNames } from './componentLoader';
import styles from '../../app/Desktop.module.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);
export type Breakpoint = 'lg' | 'md' | 'sm';
export type Layouts = {
  [key in Breakpoint]: Layout[];
};

const Desktop: React.FC = () => {
  const windows = useAppSelector((state) => state.Desktop);
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

  useEffect(() => {
    setTimeout(() => dispatch(removeWindow()), 2000);
    setTimeout(() => dispatch(addWindow({
      id: '1',
      name: 'Component 1000',
      lazyLoadComponent: 'ComponentLazy2',
    })), 4000);
  }, [dispatch]);

  return (
    <div className={styles.desktop}>
      <ResponsiveReactGridLayout
        cols={{ lg: 12, md: 8, sm: 2 }}
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        /*onLayoutChange={(currentLayout, allLayouts) => console.log(currentLayout, allLayouts)}*/
      >
        {windows.map((window) => (
          <div key={window.id}>
            <WindowComponent>
              <Suspense fallback={'loading'}>
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

