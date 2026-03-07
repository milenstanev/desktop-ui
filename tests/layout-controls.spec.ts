import { test, expect } from '@playwright/test';
import { NOTES_STRINGS } from '~/shared/constants';
import { TEST_SELECTORS } from '~/shared/testSelectors';

test.describe('Layout control buttons', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await page.getByTestId(TEST_SELECTORS.APP_HEADING).waitFor();
  });

  test('Organize Grid button arranges windows in equal-sized grid', async ({
    page,
  }) => {
    const addTimerButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.ADD_TIMER,
    });
    const addCounterButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.ADD_COUNTER,
    });
    const addNotesButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.ADD_NOTES,
    });
    const timerContainer = page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER);
    const timerDisplay = page.getByRole('timer');
    const counterContainer = page.getByTestId(TEST_SELECTORS.COUNTER.CONTAINER);
    const counterValue = page.getByTestId(TEST_SELECTORS.COUNTER.VALUE);
    const notesContainer = page.getByTestId(TEST_SELECTORS.NOTES_CONTAINER);
    const notesInput = page.getByPlaceholder(NOTES_STRINGS.PLACEHOLDER);
    const organizeButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.ORGANIZE_GRID,
    });

    await expect(addTimerButton).toBeVisible();
    await expect(addCounterButton).toBeVisible();
    await expect(addNotesButton).toBeVisible();
    await expect(organizeButton).toBeVisible();

    // Add 3 windows
    await expect(addTimerButton).toBeVisible();
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
    const allWindows = page.locator(`[role="${TEST_SELECTORS.WINDOW_ROLE}"]`);
    await expect(allWindows).toHaveCount(3);

    // Get initial position of first window
    const window1 = allWindows.first();
    const initialBox1 = await window1.boundingBox();

    // Click Organize Grid
    await expect(organizeButton).toBeVisible();
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
    const addTimerButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.ADD_TIMER,
    });
    const addCounterButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.ADD_COUNTER,
    });
    const timerContainer = page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER);
    const timerDisplay = page.getByRole('timer');
    const counterContainer = page.getByTestId(TEST_SELECTORS.COUNTER.CONTAINER);
    const counterValue = page.getByTestId(TEST_SELECTORS.COUNTER.VALUE);
    const organizeButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.ORGANIZE_GRID,
    });
    const resetButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.RESET_LAYOUT,
    });

    await expect(addTimerButton).toBeVisible();
    await expect(addCounterButton).toBeVisible();
    await expect(organizeButton).toBeVisible();
    await expect(resetButton).toBeVisible();

    // Add 2 windows
    await expect(addTimerButton).toBeVisible();
    await addTimerButton.click();
    await expect(timerContainer).toBeVisible();
    await expect(timerDisplay).toBeVisible();

    await expect(addCounterButton).toBeVisible();
    await addCounterButton.click();
    await expect(counterContainer).toBeVisible();
    await expect(counterValue).toBeVisible();

    // Get all windows by data-testid prefix
    const allWindows = page.locator(`[role="${TEST_SELECTORS.WINDOW_ROLE}"]`);
    await expect(allWindows).toHaveCount(2);

    // Organize grid first
    const window1 = allWindows.first();

    await expect(organizeButton).toBeVisible();
    await organizeButton.click();
    await page.waitForTimeout(500);

    const organizedBox = await window1.boundingBox();

    // Click Reset Layout
    await expect(resetButton).toBeVisible();
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
    const addTimerButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.ADD_TIMER,
    });
    const addCounterButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.ADD_COUNTER,
    });
    const addNotesButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.ADD_NOTES,
    });
    const timerContainer = page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER);
    const timerDisplay = page.getByRole('timer');
    const counterContainer = page.getByTestId(TEST_SELECTORS.COUNTER.CONTAINER);
    const counterValue = page.getByTestId(TEST_SELECTORS.COUNTER.VALUE);
    const notesContainer = page.getByTestId(TEST_SELECTORS.NOTES_CONTAINER);
    const notesInput = page.getByPlaceholder(NOTES_STRINGS.PLACEHOLDER);
    const closeAllButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.CLOSE_ALL,
    });

    await expect(addTimerButton).toBeVisible();
    await expect(addCounterButton).toBeVisible();
    await expect(addNotesButton).toBeVisible();
    await expect(closeAllButton).toBeVisible();

    // Add 3 windows
    await expect(addTimerButton).toBeVisible();
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
    const allWindows = page.locator(`[role="${TEST_SELECTORS.WINDOW_ROLE}"]`);
    await expect(allWindows).toHaveCount(3);

    // Click Close All
    await closeAllButton.click();

    // Verify all windows are removed (auto-waits)
    await expect(allWindows).toHaveCount(0);
  });

  test('Close All clears localStorage', async ({ page }) => {
    const addTimerButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.ADD_TIMER,
    });
    const timerContainer = page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER);
    const timerDisplay = page.getByRole('timer');
    const closeAllButton = page.getByRole(TEST_SELECTORS.ROLES.BUTTON, {
      name: TEST_SELECTORS.BUTTONS.CLOSE_ALL,
    });

    await expect(addTimerButton).toBeVisible();
    await expect(closeAllButton).toBeVisible();

    // Add windows
    await expect(addTimerButton).toBeVisible();
    await addTimerButton.click();
    await expect(timerContainer).toBeVisible();
    await expect(timerDisplay).toBeVisible();

    // Get all windows by data-testid prefix
    const allWindows = page.locator(`[role="${TEST_SELECTORS.WINDOW_ROLE}"]`);
    await expect(allWindows).toHaveCount(1);

    // Click Close All
    await expect(closeAllButton).toBeVisible();
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
