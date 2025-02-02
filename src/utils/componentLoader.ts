export const componentLoader = {
  ComponentLazy: () => import('../components/ComponentLazy'),
  ComponentLazy2: () => import('../features/ComponentLazy2/ComponentLazy2'),
  ComponentLazy3: () => import('../features/ComponentLazy3/ComponentLazy3'),
};

export type ComponentNames = keyof typeof componentLoader;
