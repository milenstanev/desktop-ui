import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import {
  initGoogleAnalytics,
  sendGAEvent,
} from './core/analytics/googleAnalytics';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
initGoogleAnalytics();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA capabilities
// Only enable in production (configurable via environment variable)
const enablePWA =
  process.env.REACT_APP_ENABLE_PWA === 'true' ||
  process.env.NODE_ENV === 'production';

if (enablePWA) {
  serviceWorkerRegistration.register({
    onSuccess: () => console.log('✅ Service worker registered successfully'),
    onUpdate: (registration) => {
      console.log('🔄 New content available, please refresh.');
      // Optionally show a notification to the user
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    },
  });
  console.log('📱 PWA enabled - Service worker active');
} else {
  serviceWorkerRegistration.unregister();
  console.log('🚫 PWA disabled - Running in development mode');
}

// Performance monitoring with Web Vitals
// Configurable via environment variable
const enableVitalsLogging =
  process.env.REACT_APP_ENABLE_VITALS_LOGGING === 'true';

reportWebVitals((metric) => {
  // Log metrics if enabled (typically in development)
  if (enableVitalsLogging) {
    console.log(`📊 ${metric.name}:`, {
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
    });
  }

  // In production, send Web Vitals to Google Analytics
  if (process.env.NODE_ENV === 'production') {
    sendGAEvent(metric.name, {
      value: Math.round(metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
});
