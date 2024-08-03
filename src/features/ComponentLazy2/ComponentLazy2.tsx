import React, { useEffect } from 'react';
import { useStore } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import { lazyLoadReducer } from  '../../utils/lazyLoadReducer';
import featureReducer, { decrement, increment } from './ComponentLazy2Slice';

interface ComponentLazyProps {
  windowId: string;
}

const LAZY_LOAD_REDUCER_NAME = 'ComponentLazy2';

const ComponentLazy: React.FC<ComponentLazyProps> = ({ windowId }) => {
  const store = useStore();
  const dispatch = useAppDispatch();
  const value = useAppSelector((state: RootState) => state[LAZY_LOAD_REDUCER_NAME]?.value || 0);

  useEffect(() => {
    lazyLoadReducer(store, LAZY_LOAD_REDUCER_NAME, featureReducer);
  }, [windowId, store]);

  return (
    <div style={{ display: 'flex', gap: '1em' }}>
      <button type="button" onClick={() => dispatch(decrement())}>-</button>
      <div>{value}</div>
      <button type="button" onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}

export default ComponentLazy;
