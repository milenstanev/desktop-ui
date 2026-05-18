/**
 * Analytics Feature Module
 *
 * Exported for Module Federation. Implements FeatureModule contract.
 */
import React from 'react';
import { createSlice } from '@reduxjs/toolkit';
import type { FeatureModule, RemoteWindowProps } from './shared/feature-types';

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: { views: 0, clicks: 0 },
  reducers: {
    incrementViews: (state) => {
      state.views += 1;
    },
    incrementClicks: (state) => {
      state.clicks += 1;
    },
  },
});

const AnalyticsComponent: React.FC<RemoteWindowProps> = ({ windowName }) => {
  const [views, setViews] = React.useState(0);
  const [clicks, setClicks] = React.useState(0);

  return (
    <div
      style={{
        padding: 16,
        fontFamily: 'system-ui',
        minHeight: 120,
      }}
      data-testid="analytics-remote-feature"
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: 14 }}>
        {windowName} (remote)
      </h3>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <span style={{ color: '#666' }}>Views: </span>
          <strong>{views}</strong>
          <button
            type="button"
            onClick={() => setViews((v) => v + 1)}
            style={{ marginLeft: 8 }}
          >
            +1
          </button>
        </div>
        <div>
          <span style={{ color: '#666' }}>Clicks: </span>
          <strong>{clicks}</strong>
          <button
            type="button"
            onClick={() => setClicks((c) => c + 1)}
            style={{ marginLeft: 8 }}
          >
            +1
          </button>
        </div>
      </div>
      <p style={{ fontSize: 12, color: '#888', marginTop: 12 }}>
        Loaded from analytics remote via Module Federation
      </p>
    </div>
  );
};

const AnalyticsFeature: FeatureModule = {
  name: 'analytics',
  displayName: 'Analytics',
  component: AnalyticsComponent,
  reducer: {
    name: 'analytics',
    reducer: analyticsSlice.reducer,
  },
};

export default AnalyticsFeature;
