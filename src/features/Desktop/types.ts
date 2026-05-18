import { Layout } from 'react-grid-layout';
import { ComponentNames } from '~/core/utils/componentLoader';

export type LayoutBreakpoint = 'xl' | 'lg' | 'md' | 'sm';

export type WindowLayout = {
  [key in LayoutBreakpoint]: Layout;
};

export type DesktopUIWindow = {
  id: string;
  name: string;
  lazyLoadComponent?: ComponentNames;
  /** For remote micro-frontends loaded via Module Federation */
  remoteFeatureName?: string;
  layout: WindowLayout | undefined;
  lazyLoadReducerName?: string | undefined;
};
