import React from 'react';
import ErrorBoundary from '../components/ErrorBoundary';
import styles from './Window.module.css';

interface WindowProps {
  id: string;
  name?: string;
  removeWindow: (id: string, lazyLoadReducerName: string) => void;
  lazyLoadReducerName?: string;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
  id,
  name,
  removeWindow,
  lazyLoadReducerName = '',
  children
}) => (
  <div className={styles.window}>
    <header className={styles.header}>
      <span>{name}</span>
      <div>
        <button className="drag-handle">
          Drag here
        </button>
        <button onClick={() => {
          removeWindow(id, lazyLoadReducerName);
        }}>
          Remove
        </button>
      </div>
    </header>
    <main className={styles.main}>
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
    </main>
  </div>
);

export default Window;
