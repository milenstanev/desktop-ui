import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './Header.module.css';
import { useAppDispatch } from './hooks';
import {addWindow} from '../features/Desktop/DesktopSlice';
import {ComponentNames} from "../features/Desktop/componentLoader";

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const addComponent = useCallback((name: string, lazyLoadComponent: ComponentNames) => {
    dispatch(addWindow({ id: uuidv4(), name, lazyLoadComponent}));
  }, []);

  return (
    <header className={styles.header}>
      <h1>Desktop UI</h1>
      <button onClick={() => addComponent("Lazy 1", "ComponentLazy")}>
        Add component lazy 1
      </button>
      <button onClick={() => addComponent("Lazy 2", "ComponentLazy2")}>
        Add component lazy 2
      </button>
      <button onClick={() => addComponent("Lazy 3", "ComponentLazy3")}>
        Add component lazy 3
      </button>
    </header>
  );
}

export default Header;
