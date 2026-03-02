/**
 * Test Selectors
 *
 * Centralized data-testid values and test constants for E2E and integration testing.
 * This ensures consistency between component implementations and tests.
 */

export const TEST_SELECTORS = {
  // App/Header component
  APP_HEADING: 'app-heading',

  // Desktop component
  DESKTOP_CONTAINER: 'desktop-container',

  // Theme component
  THEME_DISPLAY: 'theme',

  // FormEditor component
  FORM_EDITOR: 'form-editor',
  FORM_LOADING: 'form-loading',
  FORM_SUBMIT_BUTTON: 'form-submit-button',
  FORM_FIELD_PREFIX: 'form-field-',
  FORM_ERROR_PREFIX: 'form-error-',

  // Notes component
  NOTES_CONTAINER: 'notes-container',
  NOTES_LIST: 'notes-list',
  NOTES_ITEM_PREFIX: 'note-item-',

  // Timer component
  TIMER_CONTAINER: 'timer-container',

  // Counter component
  COUNTER: {
    CONTAINER: 'counter-container',
    VALUE: 'counter-value',
    INCREMENT_BUTTON: 'counter-increment',
    DECREMENT_BUTTON: 'counter-decrement',
  },

  // Window component
  WINDOW_PREFIX: 'window-',
  WINDOW_CONTAINER: 'window-container',
  WINDOW_HEADER: 'window-header',
  WINDOW_CONTENT: 'window-content',
  WINDOW_CLOSE_BUTTON: 'window-close-button',

  // Test constants
  PAGE_TITLE: 'React App',
  HEADING_SELECTOR: 'H1',
  APPLICATION_ROLE: 'application',
  LAZY_LOAD_WAIT_MS: 500,
  FOCUSED_CLASS: 'focused',
  TIMER_FORMAT_REGEX: /^\d{2}:\d{2}$/,
  TEST_NOTE_TEXT: 'E2E test note',
  KEYBOARD_TEST_WINDOW_ID: 'keyboard-test-window',
  KEYBOARD_TEST_WINDOW_NAME: 'Keyboard Test',
  WINDOW_ID_W1: 'w1',
  TIMER_INITIAL_TIME: '00:00',
  TIMER_AFTER_5_SECONDS: '00:05',
  TIMER_AFTER_3_SECONDS: '00:03',
  ADVANCE_TIMER_5_SECONDS: 5000,
  ADVANCE_TIMER_3_SECONDS: 3000,
  TEST_NOTE_MY_FIRST: 'My first note',
  TEST_NOTE_TO_REMOVE: 'To remove',

  // Keyboard shortcuts
  KEYBOARD: {
    ESCAPE: 'Escape',
    CTRL_W: 'Control+KeyW',
  },
} as const;

/**
 * Helper function to generate form field test IDs
 */
export const getFormFieldTestId = (fieldName: string): string => {
  return `${TEST_SELECTORS.FORM_FIELD_PREFIX}${fieldName}`;
};

/**
 * Helper function to generate form error test IDs
 */
export const getFormErrorTestId = (fieldName: string): string => {
  return `${TEST_SELECTORS.FORM_ERROR_PREFIX}${fieldName}`;
};

/**
 * Helper function to generate note item test IDs
 */
export const getNoteItemTestId = (index: number): string => {
  return `${TEST_SELECTORS.NOTES_ITEM_PREFIX}${index}`;
};

/**
 * Helper function to generate window test IDs
 */
export const getWindowTestId = (windowId: string): string => {
  return `${TEST_SELECTORS.WINDOW_PREFIX}${windowId}`;
};
