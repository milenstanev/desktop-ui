export const componentLoader = {
  ComponentLazy: () => import('../../components/ComponentLazy'),
  ComponentLazy2: () => import('../../components/ComponentLazy'),
};

export type ComponentNames = keyof typeof componentLoader;
