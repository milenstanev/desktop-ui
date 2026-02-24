import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './Header.module.css';
import { useAppDispatch } from './hooks';
import { addWindow } from '../features/Desktop/DesktopSlice';
import { useTheme } from '../contexts/ThemeContext';
import { APP_STRINGS } from '../constants';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <h1>{APP_STRINGS.HEADING_TITLE}</h1>
      <div>
        <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
          {theme === 'light' ? 'Dark' : 'Light'} mode
        </button>
        <button onClick={() => {
        dispatch(addWindow({
          id: uuidv4(),
          name: 'Lazy 1',
          lazyLoadComponent: 'ComponentLazy',
          layout: undefined,
        }));
      }}>
        {APP_STRINGS.BUTTON_ADD_LAZY_1}
      </button>
      <button
        onClick={() => {
        dispatch(addWindow({
          id: uuidv4(),
          name: 'Lazy 2',
          lazyLoadComponent: 'ComponentLazy2',
          layout: undefined,
          lazyLoadReducerName: 'ComponentLazy2Reducer',
        }));
      }}>
        {APP_STRINGS.BUTTON_ADD_LAZY_2}
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
        {APP_STRINGS.BUTTON_ADD_LAZY_3}
      </button>
      <button
        onClick={() => {
          dispatch(addWindow({
            id: uuidv4(),
            name: 'Notes',
            lazyLoadComponent: 'Notes',
            layout: undefined,
            lazyLoadReducerName: 'NotesReducer',
          }));
        }}
      >
        {APP_STRINGS.BUTTON_ADD_NOTES}
      </button>
      <button
        onClick={() => {
          dispatch(addWindow({
            id: uuidv4(),
            name: 'Timer',
            lazyLoadComponent: 'Timer',
            layout: undefined,
          }));
        }}
      >
        {APP_STRINGS.BUTTON_ADD_TIMER}
      </button>
      </div>
    </header>
  );
}

export default Header;
