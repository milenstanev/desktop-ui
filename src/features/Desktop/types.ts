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
  layout: WindowLayout | undefined;
  lazyLoadReducerName?: string | undefined;
};
