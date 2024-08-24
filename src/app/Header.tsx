import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './Header.module.css';
import { useAppDispatch } from './hooks';
import { addWindow } from '../features/Desktop/DesktopSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <header className={styles.header}>
      <h1>Desktop UI</h1>
      <button onClick={() => {
        dispatch(addWindow({
          id: uuidv4(),
          name: 'Lazy 1',
          lazyLoadComponent: 'ComponentLazy',
          layout: undefined,
        }));
      }}>
        Add component lazy 1
      </button>
      <button onClick={() => {
        dispatch(addWindow({
          id: uuidv4(),
          name: 'Lazy 2',
          lazyLoadComponent: 'ComponentLazy2',
          layout: undefined,
          lazyLoadReducerName: 'ComponentLazy2Reducer',
        }));
      }}>
        Add component lazy 2
      </button>
      <button onClick={() => {
        const id = uuidv4();
        dispatch(addWindow({
          id,
          name: 'Lazy 3',
          lazyLoadComponent: 'ComponentLazy3',
          layout: {
            lg: { i: id, x: 0, y: 0, w: 4, h: 2.3, },
            md: { i: id, x: 0, y: 0, w: 4, h: 2.3, },
            sm: { i: id, x: 0, y: 0, w: 4, h: 2, }
          },
        }));
      }}>
        Add component lazy 3
      </button>
    </header>
  );
}

export default Header;
