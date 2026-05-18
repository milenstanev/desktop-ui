/**
 * Feature Module contract (mirrors desktop-ui core/feature-types)
 * Keeps analytics remote self-contained.
 */
import type { ComponentType } from 'react';
import type { Reducer } from '@reduxjs/toolkit';

export interface RemoteWindowProps {
  windowId: string;
  windowName: string;
  lazyLoadReducerName?: string;
}

export interface FeatureReducerSpec {
  name: string;
  reducer: Reducer;
}

export interface FeatureModule {
  name: string;
  displayName: string;
  component: ComponentType<RemoteWindowProps>;
  reducer?: FeatureReducerSpec;
  init?: () => void | Promise<void>;
}
