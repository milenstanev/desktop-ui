import { test, expect } from '@playwright/test';
import { TIMER_STRINGS } from '~/constants';
import { TEST_SELECTORS } from '~/testSelectors';

const BUTTON_ROLE = 'button';
const ADD_TIMER_BUTTON_NAME = /add timer/i;
const START_TIMER_BUTTON_NAME = /start timer/i;
const PAUSE_TIMER_BUTTON_NAME = /pause timer/i;
const RESET_TIMER_BUTTON_NAME = /reset timer/i;

test.describe('Timer feature', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
    await page.getByTestId(TEST_SELECTORS.APP_HEADING).waitFor();
  });

  test('opens Timer window and shows timer UI', async ({ page }) => {
    const addTimerButton = page.getByRole(BUTTON_ROLE, {
      name: ADD_TIMER_BUTTON_NAME,
    });
    const timerContainer = page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER);
    const timerDisplay = page.getByRole(TIMER_STRINGS.TIMER_ROLE);
    const startButton = page.getByRole(BUTTON_ROLE, {
      name: START_TIMER_BUTTON_NAME,
    });
    const pauseButton = page.getByRole(BUTTON_ROLE, {
      name: PAUSE_TIMER_BUTTON_NAME,
    });
    const resetButton = page.getByRole(BUTTON_ROLE, {
      name: RESET_TIMER_BUTTON_NAME,
    });

    await addTimerButton.click();

    // Wait for lazy-loaded Timer component
    await expect(timerContainer).toBeVisible();
    await expect(timerDisplay).toBeVisible();

    await expect(timerDisplay).toHaveText(TEST_SELECTORS.TIMER_FORMAT_REGEX);
    await expect(startButton).toBeVisible();
    await expect(pauseButton).toBeVisible();
    await expect(resetButton).toBeVisible();
  });
});
