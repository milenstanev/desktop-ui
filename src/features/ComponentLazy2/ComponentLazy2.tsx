import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { RootState } from '../../app/store';
import featureReducer, { decrement, increment } from './ComponentLazy2Slice';
import useLazyLoadReducer from "../../hooks/useLazyLoadReducer";

interface ComponentLazyProps {
  windowId: string;
  windowName: string;
  lazyLoadReducerName: string;
}

const ComponentLazy: React.FC<ComponentLazyProps> = ({ lazyLoadReducerName }) => {
  useLazyLoadReducer({
    lazyLoadReducerName,
    featureReducer,
  });
  const dispatch = useAppDispatch();
  const value = useAppSelector((state: RootState) => state[lazyLoadReducerName]?.value || 0);

  return (
    <div style={{ display: 'flex', gap: '1em' }}>
      <button type="button" onClick={() => dispatch(decrement())}>-</button>
      <div>{value}</div>
      <button type="button" onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}

export default ComponentLazy;
