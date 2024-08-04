import React, {useCallback, useEffect} from 'react';
import { useStore } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { lazyLoadReducer, removeLazyLoadedReducer } from  '../../utils/lazyLoadReducer';
import featureReducer, { decrement, increment } from './ComponentLazy2Slice';
import { DesktopUIWindow } from '../Desktop/types';

interface ComponentLazyProps {
  windowId: string;
  windowName: string;
}

const LAZY_LOAD_REDUCER_NAME = 'ComponentLazy2';

const ComponentLazy: React.FC<ComponentLazyProps> = ({ windowId, windowName }) => {
  const store = useStore();
  const dispatch = useAppDispatch();
  const value = useAppSelector((state: RootState) => state[LAZY_LOAD_REDUCER_NAME]?.value || 0);
  const windows = useAppSelector((state) => state.Desktop.desktopWindows);

  const handleRemove = useCallback(() => {
    const found = windows.find((window: DesktopUIWindow) => {
      return window.name === windowName && window.id !== windowId;
    });
    if (!found) {
      removeLazyLoadedReducer(store, LAZY_LOAD_REDUCER_NAME);
    }
  }, [store, windowId, windowName, windows]);

  useEffect(() => {
    lazyLoadReducer(store, LAZY_LOAD_REDUCER_NAME, featureReducer);
    return () => {
      handleRemove();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ display: 'flex', gap: '1em' }}>
      <button type="button" onClick={() => dispatch(decrement())}>-</button>
      <div>{value}</div>
      <button type="button" onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}

export default ComponentLazy;
