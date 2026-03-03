import React, { memo } from 'react';
import ErrorBoundary from '~/components/ErrorBoundary/ErrorBoundary';
import CloseIcon from '~/components/Icons/CloseIcon';
import styles from './Window.module.css';
import { WINDOW_STRINGS, KEYBOARD_SHORTCUTS, LAYOUT_CONFIG } from '~/constants';
import { TEST_SELECTORS, getWindowTestId } from '~/testSelectors';

interface WindowProps {
  id: string;
  name?: string;
  removeWindow: (id: string) => void;
  lazyLoadReducerName?: string;
  isFocused?: boolean;
  onFocus?: () => void;
  children: React.ReactNode;
}

const WINDOW_TITLE_PREFIX = 'window-title-';
const WINDOW_LABEL_PREFIX = 'Window: ';
const FOCUS_WINDOW_LABEL_PREFIX = 'Focus window: ';

const Window: React.FC<WindowProps> = memo(
  ({ id, name, removeWindow, isFocused = false, onFocus, children }) => (
    <div
      className={`${styles.window} ${isFocused ? styles.focused : ''}`}
      role="region"
      aria-label={
        name
          ? `${WINDOW_LABEL_PREFIX}${name}`
          : WINDOW_STRINGS.WINDOW_ARIA_LABEL
      }
      onClick={onFocus}
      data-testid={getWindowTestId(id)}
    >
      <header
        className={styles.header}
        onKeyDown={(e) => {
          if (
            e.key === KEYBOARD_SHORTCUTS.ENTER ||
            e.key === KEYBOARD_SHORTCUTS.SPACE
          ) {
            e.preventDefault();
            onFocus?.();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={
          name
            ? `${FOCUS_WINDOW_LABEL_PREFIX}${name}`
            : WINDOW_STRINGS.FOCUS_ARIA_LABEL
        }
        data-testid={TEST_SELECTORS.WINDOW_HEADER}
      >
        <div
          className={`${LAYOUT_CONFIG.DRAG_HANDLE_CLASS} ${styles.headerDrag}`}
        >
          <span id={`${WINDOW_TITLE_PREFIX}${id}`}>{name}</span>
        </div>
        <button
          type="button"
          className={styles.closeButton}
          onClick={(e) => {
            e.stopPropagation();
            removeWindow(id);
          }}
          aria-label={WINDOW_STRINGS.CLOSE_ARIA_LABEL}
          data-testid={TEST_SELECTORS.WINDOW_CLOSE_BUTTON}
        >
          <CloseIcon />
        </button>
      </header>
      <main
        className={styles.main}
        aria-labelledby={`${WINDOW_TITLE_PREFIX}${id}`}
        onClick={onFocus}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  )
);

Window.displayName = 'Window';

export default Window;
