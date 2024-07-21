export const componentLoader = {
  ComponentLazy: () => import('../../components/ComponentLazy'),
  ComponentLazy2: () => import('../../components/ComponentLazy2'),
  ComponentLazy3: () => import('../ComponentLazy3/ComponentLazy3'),
};

export type ComponentNames = keyof typeof componentLoader;
