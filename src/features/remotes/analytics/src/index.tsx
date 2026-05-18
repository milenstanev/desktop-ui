/**
 * Standalone entry for development.
 * When consumed by host, only Feature.ts is loaded via remoteEntry.
 */
import React from 'react';
import { createRoot } from 'react-dom/client';
import AnalyticsFeature from './Feature';

const root = document.getElementById('root');
if (root) {
  const App = AnalyticsFeature.component;
  createRoot(root).render(
    <React.StrictMode>
      <App windowId="dev" windowName="Analytics (standalone)" />
    </React.StrictMode>
  );
}
