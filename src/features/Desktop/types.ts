import {Layout} from 'react-grid-layout';
import {ComponentNames} from '../../utils/componentLoader';

export type LayoutBreakpoint = 'lg' | 'md' | 'sm';

export type WindowLayout = {
  [key in LayoutBreakpoint]: Layout;
};

export type DesktopUIWindow = {
  id: string;
  name: string;
  lazyLoadComponent?: ComponentNames;
  layout?: WindowLayout;
}
