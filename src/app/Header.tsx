import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './Header.module.css';
import { useAppDispatch } from './hooks';
import { addWindow } from '../features/Desktop/DesktopSlice';
import { WindowLayout } from '../features/Desktop/types';
import { ComponentNames } from "../utils/componentLoader";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();

  const addComponent = useCallback((
    id: string,
    name: string,
    lazyLoadComponent: ComponentNames,
    layout?: WindowLayout,
  ) => {
    dispatch(addWindow({ id, name, lazyLoadComponent, layout }));
  }, [dispatch]);

  return (
    <header className={styles.header}>
      <h1>Desktop UI</h1>
      <button onClick={() => {
        const id = uuidv4();
        addComponent(id,'Lazy 1', 'ComponentLazy');
      }}>
        Add component lazy 1
      </button>
      <button onClick={() => {
        const id = uuidv4();
        addComponent(id,'Lazy 2', 'ComponentLazy2');
      }}>
        Add component lazy 2
      </button>
      <button onClick={() => {
        const id = uuidv4();
        addComponent(
          id,
          'Lazy 3',
          'ComponentLazy3',
          {
            lg: { i: id, x: 0, y: 0, w: 4, h: 2.3, },
            md: { i: id, x: 0, y: 0, w: 4, h: 2.3, },
            sm: { i: id, x: 0, y: 0, w: 4, h: 2, }
          }
        );
      }}>
        Add component lazy 3
      </button>
    </header>
  );
}

export default Header;
