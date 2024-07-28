import React from 'react';
import { useAppDispatch } from '../app/hooks';
import { removeWindow } from '../features/Desktop/DesktopSlice';
import ErrorBoundary from '../components/ErrorBoundary';
import styles from './Window.module.css';

interface WindowProps {
  id: string;
  name?: string;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
   id,
   name,
   children
}) => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.window}>
      <header className={styles.header}>
        <span>{name}</span>
        <div>
          <button className="drag-handle">
            Drag here
          </button>
          <button onClick={() => dispatch(removeWindow(id))}>
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
  )
}

export default Window;
