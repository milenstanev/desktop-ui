import React, { Suspense } from 'react';
import { getFeature } from '~/core/feature-registry';
import Loader from '~/shared/components/Loader/Loader';

export interface RemoteFeatureLoaderProps {
  remoteFeatureName: string;
  windowId: string;
  windowName: string;
  lazyLoadReducerName?: string;
}

const RemoteFeatureLoader: React.FC<RemoteFeatureLoaderProps> = ({
  remoteFeatureName,
  windowId,
  windowName,
}) => {
  const feature = getFeature(remoteFeatureName);

  if (!feature) {
    return (
      <div style={{ padding: 16, color: '#c00' }}>
        Feature &quot;{remoteFeatureName}&quot; not loaded.
      </div>
    );
  }

  const Component = feature.component;

  return (
    <Suspense fallback={<Loader />}>
      <Component
        windowId={windowId}
        windowName={windowName}
        lazyLoadReducerName={undefined}
      />
    </Suspense>
  );
};

export default RemoteFeatureLoader;
