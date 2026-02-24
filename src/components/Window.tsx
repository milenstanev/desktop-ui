import React, { memo } from 'react';
import ErrorBoundary from './ErrorBoundary';
import styles from './Window.module.css';

interface WindowProps {
  id: string;
  name?: string;
  removeWindow: (id: string, lazyLoadReducerName: string) => void;
  lazyLoadReducerName?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = memo(({
  id,
  name,
  removeWindow,
  lazyLoadReducerName = '',
  isFocused = false,
  onFocus,
  children,
}) => (
  <div
    className={`${styles.window} ${isFocused ? styles.focused : ''}`}
    role="application"
    aria-label={name ? `Window: ${name}` : 'Window'}
  >
    <header
      className={styles.header}
      onClick={onFocus}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onFocus?.(); } }}
      role="button"
      tabIndex={0}
      aria-label={name ? `Focus window: ${name}` : 'Focus window'}
    >
      <div className={`drag-handle ${styles.headerDrag}`}>
        <span id={`window-title-${id}`}>{name}</span>
      </div>
      <div>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); removeWindow(id, lazyLoadReducerName); }}
          aria-label="Close window"
        >
          Remove
        </button>
      </div>
    </header>
    <main className={styles.main} aria-labelledby={`window-title-${id}`}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </main>
  </div>
));

Window.displayName = 'Window';

export default Window;
