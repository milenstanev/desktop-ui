import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA capabilities
const enablePWA =
  process.env.REACT_APP_ENABLE_PWA === 'true' ||
  process.env.NODE_ENV === 'production';

if (enablePWA) {
  serviceWorkerRegistration.register({
    onSuccess: () => console.log('✅ Service worker registered successfully'),
    onUpdate: (registration) => {
      console.log('🔄 New content available, please refresh.');
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

const enableVitalsLogging =
  process.env.REACT_APP_ENABLE_VITALS_LOGGING === 'true';

reportWebVitals((metric) => {
  if (enableVitalsLogging) {
    console.log(`📊 ${metric.name}:`, {
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
    });
  }
});
