/** App / Header copy – used in navigation (Header) and App.test.tsx */
export const APP_STRINGS = {
  HEADING_TITLE: 'Desktop UI',
  BUTTON_ADD_LAZY_1: 'Add component lazy 1',
  BUTTON_ADD_LAZY_2: 'Add component lazy 2',
  BUTTON_ADD_LAZY_3: 'Add component lazy 3',
} as const;

/** Selectors for App.test.tsx (regex for flexible matching) */
export const APP_TEST = {
  HEADING_TITLE: new RegExp(APP_STRINGS.HEADING_TITLE, 'i'),
  BUTTON_ADD_LAZY_1: new RegExp(APP_STRINGS.BUTTON_ADD_LAZY_1, 'i'),
  BUTTON_ADD_LAZY_2: new RegExp(APP_STRINGS.BUTTON_ADD_LAZY_2, 'i'),
  BUTTON_ADD_LAZY_3: new RegExp(APP_STRINGS.BUTTON_ADD_LAZY_3, 'i'),
} as const;
