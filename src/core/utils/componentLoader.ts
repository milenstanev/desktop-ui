/**
 * Component Loader
 *
 * Centralized registry for lazy-loaded feature components.
 * Each entry returns a dynamic import that enables code splitting.
 *
 * @example
 * ```typescript
 * const Component = React.lazy(componentLoader.Counter);
 * ```
 *
 * To add a new feature:
 * 1. Add an entry here with the component's dynamic import
 * 2. The component will be automatically code-split
 * 3. Use the key when creating windows in Desktop
 */
export const componentLoader = {
  SimpleExample: () => import('~/features/SimpleExample/SimpleExample'),
  Counter: () => import('~/features/Counter/Counter'),
  FormEditor: () => import('~/features/FormEditor/FormEditor'),
  Notes: () => import('~/features/Notes/Notes'),
  Timer: () => import('~/features/Timer/Timer'),
};

/**
 * Type representing all available component names in the loader
 */
export type ComponentNames = keyof typeof componentLoader;
