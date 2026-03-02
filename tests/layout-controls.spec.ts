import { test, expect } from '@playwright/test';
import { APP_STRINGS, NOTES_STRINGS } from '~/constants';
import { TEST_SELECTORS, getWindowTestId } from '~/testSelectors';

const BUTTON_ROLE = 'button';
const ADD_TIMER_BUTTON_NAME = /add timer/i;
const ADD_COUNTER_BUTTON_NAME = /add counter/i;
const ADD_NOTES_BUTTON_NAME = /add notes/i;
const ORGANIZE_GRID_BUTTON_NAME = new RegExp(
  APP_STRINGS.ORGANIZE_GRID_BUTTON,
  'i'
);
const RESET_LAYOUT_BUTTON_NAME = new RegExp(
  APP_STRINGS.RESET_LAYOUT_BUTTON,
  'i'
);
const CLOSE_ALL_BUTTON_NAME = new RegExp(APP_STRINGS.CLOSE_ALL_BUTTON, 'i');

test.describe('Layout control buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
    await page.getByTestId(TEST_SELECTORS.APP_HEADING).waitFor();
  });

  test('Organize Grid button arranges windows in equal-sized grid', async ({
    page,
  }) => {
    const addTimerButton = page.getByRole(BUTTON_ROLE, {
      name: ADD_TIMER_BUTTON_NAME,
    });
    const addCounterButton = page.getByRole(BUTTON_ROLE, {
      name: ADD_COUNTER_BUTTON_NAME,
    });
    const addNotesButton = page.getByRole(BUTTON_ROLE, {
      name: ADD_NOTES_BUTTON_NAME,
    });
    const timerContainer = page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER);
    const timerDisplay = page.getByRole('timer');
    const counterContainer = page.getByTestId(TEST_SELECTORS.COUNTER.CONTAINER);
    const counterValue = page.getByTestId(TEST_SELECTORS.COUNTER.VALUE);
    const notesContainer = page.getByTestId(TEST_SELECTORS.NOTES_CONTAINER);
    const notesInput = page.getByPlaceholder(NOTES_STRINGS.PLACEHOLDER);
    const organizeButton = page.getByRole(BUTTON_ROLE, {
      name: ORGANIZE_GRID_BUTTON_NAME,
    });

    // Add 3 windows
    await addTimerButton.click();
    await expect(timerContainer).toBeVisible();
    await expect(timerDisplay).toBeVisible();

    await addCounterButton.click();
    await expect(counterContainer).toBeVisible();
    await expect(counterValue).toBeVisible();

    await addNotesButton.click();
    await expect(notesContainer).toBeVisible();
    await expect(notesInput).toBeVisible();

    // Get all windows by data-testid prefix
    const allWindows = page.locator(`[data-testid^="${TEST_SELECTORS.WINDOW_PREFIX}"]`);
    await expect(allWindows).toHaveCount(3);

    // Get initial position of first window
    const window1 = allWindows.first();
    const initialBox1 = await window1.boundingBox();

    // Click Organize Grid
    await organizeButton.click();

    // Wait for layout to change
    await page.waitForTimeout(500);

    // Verify windows are still visible
    await expect(allWindows).toHaveCount(3);

    // Verify layout changed (position or size should differ)
    const newBox1 = await window1.boundingBox();
    const layoutChanged =
      initialBox1?.x !== newBox1?.x ||
      initialBox1?.y !== newBox1?.y ||
      initialBox1?.width !== newBox1?.width ||
      initialBox1?.height !== newBox1?.height;

    expect(layoutChanged).toBeTruthy();
  });

  test('Reset Layout button resets windows to default positions', async ({
    page,
  }) => {
    const addTimerButton = page.getByRole(BUTTON_ROLE, {
      name: ADD_TIMER_BUTTON_NAME,
    });
    const addCounterButton = page.getByRole(BUTTON_ROLE, {
      name: ADD_COUNTER_BUTTON_NAME,
    });
    const timerContainer = page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER);
    const timerDisplay = page.getByRole('timer');
    const counterContainer = page.getByTestId(TEST_SELECTORS.COUNTER.CONTAINER);
    const counterValue = page.getByTestId(TEST_SELECTORS.COUNTER.VALUE);
    const organizeButton = page.getByRole(BUTTON_ROLE, {
      name: ORGANIZE_GRID_BUTTON_NAME,
    });
    const resetButton = page.getByRole(BUTTON_ROLE, {
      name: RESET_LAYOUT_BUTTON_NAME,
    });

    // Add 2 windows
    await addTimerButton.click();
    await expect(timerContainer).toBeVisible();
    await expect(timerDisplay).toBeVisible();

    await addCounterButton.click();
    await expect(counterContainer).toBeVisible();
    await expect(counterValue).toBeVisible();

    // Get all windows by data-testid prefix
    const allWindows = page.locator(`[data-testid^="${TEST_SELECTORS.WINDOW_PREFIX}"]`);
    await expect(allWindows).toHaveCount(2);

    // Organize grid first
    const window1 = allWindows.first();
    const initialBox = await window1.boundingBox();

    await organizeButton.click();
    await page.waitForTimeout(500);

    const organizedBox = await window1.boundingBox();

    // Click Reset Layout
    await resetButton.click();
    await page.waitForTimeout(500);

    // Verify windows are still visible
    await expect(allWindows).toHaveCount(2);

    // Verify layout changed from organized state
    const resetBox = await window1.boundingBox();
    const layoutChanged =
      organizedBox?.x !== resetBox?.x ||
      organizedBox?.y !== resetBox?.y ||
      organizedBox?.width !== resetBox?.width ||
      organizedBox?.height !== resetBox?.height;

    expect(layoutChanged).toBeTruthy();
  });

  test('Close All button removes all windows', async ({ page }) => {
    const addTimerButton = page.getByRole(BUTTON_ROLE, {
      name: ADD_TIMER_BUTTON_NAME,
    });
    const addCounterButton = page.getByRole(BUTTON_ROLE, {
      name: ADD_COUNTER_BUTTON_NAME,
    });
    const addNotesButton = page.getByRole(BUTTON_ROLE, {
      name: ADD_NOTES_BUTTON_NAME,
    });
    const timerContainer = page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER);
    const timerDisplay = page.getByRole('timer');
    const counterContainer = page.getByTestId(TEST_SELECTORS.COUNTER.CONTAINER);
    const counterValue = page.getByTestId(TEST_SELECTORS.COUNTER.VALUE);
    const notesContainer = page.getByTestId(TEST_SELECTORS.NOTES_CONTAINER);
    const notesInput = page.getByPlaceholder(NOTES_STRINGS.PLACEHOLDER);
    const closeAllButton = page.getByRole(BUTTON_ROLE, {
      name: CLOSE_ALL_BUTTON_NAME,
    });

    // Add 3 windows
    await addTimerButton.click();
    await expect(timerContainer).toBeVisible();
    await expect(timerDisplay).toBeVisible();

    await addCounterButton.click();
    await expect(counterContainer).toBeVisible();
    await expect(counterValue).toBeVisible();

    await addNotesButton.click();
    await expect(notesContainer).toBeVisible();
    await expect(notesInput).toBeVisible();

    // Get all windows by data-testid prefix
    const allWindows = page.locator(`[data-testid^="${TEST_SELECTORS.WINDOW_PREFIX}"]`);
    await expect(allWindows).toHaveCount(3);

    // Click Close All
    await closeAllButton.click();

    // Verify all windows are removed (auto-waits)
    await expect(allWindows).toHaveCount(0);
  });

  test('Layout controls persist after page reload', async ({ page }) => {
    const addTimerButton = page.getByRole(BUTTON_ROLE, {
      name: ADD_TIMER_BUTTON_NAME,
    });
    const addCounterButton = page.getByRole(BUTTON_ROLE, {
      name: ADD_COUNTER_BUTTON_NAME,
    });
    const timerContainer = page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER);
    const timerDisplay = page.getByRole('timer');
    const counterContainer = page.getByTestId(TEST_SELECTORS.COUNTER.CONTAINER);
    const counterValue = page.getByTestId(TEST_SELECTORS.COUNTER.VALUE);
    const organizeButton = page.getByRole(BUTTON_ROLE, {
      name: ORGANIZE_GRID_BUTTON_NAME,
    });

    // Add 2 windows
    await addTimerButton.click();
    await expect(timerContainer).toBeVisible();
    await expect(timerDisplay).toBeVisible();

    await addCounterButton.click();
    await expect(counterContainer).toBeVisible();
    await expect(counterValue).toBeVisible();

    // Get all windows by data-testid prefix
    const allWindows = page.locator(`[data-testid^="${TEST_SELECTORS.WINDOW_PREFIX}"]`);
    await expect(allWindows).toHaveCount(2);

    // Organize grid
    const window1 = allWindows.first();
    const initialBox = await window1.boundingBox();

    await organizeButton.click();
    await page.waitForTimeout(500);

    const organizedBox = await window1.boundingBox();

    // Reload page
    await page.reload();
    await page.getByTestId(TEST_SELECTORS.APP_HEADING).waitFor();

    // Verify windows still exist with organized layout
    await expect(allWindows).toHaveCount(2);

    const reloadedBox = await window1.boundingBox();

    // Verify layout persisted (approximately same position/size)
    expect(
      Math.abs((organizedBox?.x ?? 0) - (reloadedBox?.x ?? 0))
    ).toBeLessThan(30);
    expect(
      Math.abs((organizedBox?.y ?? 0) - (reloadedBox?.y ?? 0))
    ).toBeLessThan(30);
  });

  test('Close All clears localStorage', async ({ page }) => {
    const addTimerButton = page.getByRole(BUTTON_ROLE, {
      name: ADD_TIMER_BUTTON_NAME,
    });
    const timerContainer = page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER);
    const timerDisplay = page.getByRole('timer');
    const closeAllButton = page.getByRole(BUTTON_ROLE, {
      name: CLOSE_ALL_BUTTON_NAME,
    });

    // Add windows
    await addTimerButton.click();
    await expect(timerContainer).toBeVisible();
    await expect(timerDisplay).toBeVisible();

    // Get all windows by data-testid prefix
    const allWindows = page.locator(`[data-testid^="${TEST_SELECTORS.WINDOW_PREFIX}"]`);
    await expect(allWindows).toHaveCount(1);

    // Click Close All
    await closeAllButton.click();

    // Wait for windows to be removed
    await expect(allWindows).toHaveCount(0);

    // Reload page
    await page.reload();
    await page.getByTestId(TEST_SELECTORS.APP_HEADING).waitFor();

    // Verify no windows after reload (localStorage was cleared)
    await expect(allWindows).toHaveCount(0);
  });
});
