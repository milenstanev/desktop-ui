export const componentLoader = {
  ComponentLazy: () => import('../components/ComponentLazy'),
  ComponentLazy2: () => import('../features/ComponentLazy2/ComponentLazy2'),
  ComponentLazy3: () => import('../features/ComponentLazy3/ComponentLazy3'),
  Notes: () => import('../features/Notes/Notes'),
  Timer: () => import('../features/Timer/Timer'),
};

export type ComponentNames = keyof typeof componentLoader;
