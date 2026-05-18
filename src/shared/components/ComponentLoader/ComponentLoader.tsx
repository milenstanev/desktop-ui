import React, { Suspense } from 'react';
import { getLazyComponent } from '~/core/utils/componentLoader';
import type { ComponentNames } from '~/core/utils/componentLoader';
import Loader from '~/shared/components/Loader/Loader';

export interface ComponentLoaderProps {
  componentName: ComponentNames;
  windowId: string;
  windowName: string;
  lazyLoadReducerName?: string;
}

type LazyWindowProps = {
  windowId: string;
  windowName: string;
  lazyLoadReducerName?: string;
};

const COMPONENTS_REQUIRING_REDUCER = new Set<ComponentNames>([
  'Counter',
  'Notes',
]);

const ComponentLoader: React.FC<ComponentLoaderProps> = ({
  componentName,
  windowId,
  windowName,
  lazyLoadReducerName,
}) => {
  if (COMPONENTS_REQUIRING_REDUCER.has(componentName) && !lazyLoadReducerName) {
    throw new Error(
      `Component "${componentName}" requires a lazyLoadReducerName but none was provided.`
    );
  }

  const LazyComponent = getLazyComponent(
    componentName
  ) as React.ComponentType<LazyWindowProps>;
  return (
    <Suspense fallback={<Loader />}>
      <LazyComponent
        windowId={windowId}
        windowName={windowName}
        lazyLoadReducerName={lazyLoadReducerName}
      />
    </Suspense>
  );
};

export default ComponentLoader;
