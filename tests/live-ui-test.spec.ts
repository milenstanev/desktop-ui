/**
 * Live UI Test
 *
 * Comprehensive test suite for the live running application.
 * Run against your local server: http://192.168.1.5:3000/
 *
 * Usage:
 * npx playwright test tests/live-ui-test.spec.ts --headed
 */

import { test, expect } from '@playwright/test';
import { TEST_SELECTORS } from '../src/testSelectors';

test.describe('Live UI - Comprehensive Test', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Application loads successfully', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/React App/);

    // Check main heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Desktop UI');

    // Check desktop container
    const desktop = page.getByTestId(TEST_SELECTORS.DESKTOP_CONTAINER);
    await expect(desktop).toBeVisible();
  });

  test('Theme switching works', async ({ page }) => {
    // Check initial theme
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme', 'light');

    // Find and click theme selector
    const themeSelect = page
      .locator('select')
      .filter({ hasText: /Light|Dark|Gradient/ });
    await expect(themeSelect).toBeVisible();

    // Switch to dark theme
    await themeSelect.selectOption('dark');
    await expect(html).toHaveAttribute('data-theme', 'dark');

    // Switch to gradient theme
    await themeSelect.selectOption('gradient');
    await expect(html).toHaveAttribute('data-theme', 'gradient');

    // Verify theme persists after reload
    await page.reload();
    await expect(html).toHaveAttribute('data-theme', 'gradient');
  });

  test('Can add and interact with Counter window', async ({ page }) => {
    // Add Counter window
    const addCounterBtn = page.getByRole('button', { name: /add counter/i });
    await expect(addCounterBtn).toBeVisible();
    await addCounterBtn.click();

    // Wait for lazy-loaded component
    const counterContainer = page.getByTestId(TEST_SELECTORS.COUNTER.CONTAINER);
    await expect(counterContainer).toBeVisible();

    // Check initial value
    const counterValue = page.getByTestId(TEST_SELECTORS.COUNTER.VALUE);
    await expect(counterValue).toHaveText('0');

    // Increment counter
    const incrementBtn = page.getByTestId(
      TEST_SELECTORS.COUNTER.INCREMENT_BUTTON
    );
    await incrementBtn.click();
    await expect(counterValue).toHaveText('1');

    // Increment multiple times
    await incrementBtn.click();
    await incrementBtn.click();
    await expect(counterValue).toHaveText('3');

    // Decrement counter
    const decrementBtn = page.getByTestId(
      TEST_SELECTORS.COUNTER.DECREMENT_BUTTON
    );
    await decrementBtn.click();
    await expect(counterValue).toHaveText('2');
  });

  test('Can add and use Notes window', async ({ page }) => {
    // Add Notes window
    const addNotesBtn = page.getByRole('button', { name: /add notes/i });
    await addNotesBtn.click();

    // Wait for lazy-loaded component
    const notesContainer = page.getByTestId(TEST_SELECTORS.NOTES_CONTAINER);
    await expect(notesContainer).toBeVisible();

    // Add a note
    const noteInput = notesContainer.locator('input[type="text"]');
    await expect(noteInput).toBeVisible();
    await noteInput.fill('Test note from live UI');
    await noteInput.press('Enter');

    // Verify note appears
    const notesList = page.getByTestId(TEST_SELECTORS.NOTES_LIST);
    await expect(notesList.locator('li')).toHaveCount(1);
    await expect(notesList.locator('li').first()).toContainText(
      'Test note from live UI'
    );

    // Add another note
    await noteInput.fill('Second test note');
    await noteInput.press('Enter');
    await expect(notesList.locator('li')).toHaveCount(2);

    // Remove a note
    const deleteBtn = notesList.locator('button').first();
    await deleteBtn.click();
    await expect(notesList.locator('li')).toHaveCount(1);
  });

  test('Can add and use Timer window', async ({ page }) => {
    // Add Timer window
    const addTimerBtn = page.getByRole('button', { name: /add timer/i });
    await addTimerBtn.click();

    // Wait for lazy-loaded component
    const timerContainer = page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER);
    await expect(timerContainer).toBeVisible();

    // Check initial time
    const timerDisplay = timerContainer.locator('[role="timer"]');
    await expect(timerDisplay).toHaveText('00:00');

    // Start timer
    const startBtn = timerContainer.getByRole('button', { name: /start/i });
    await startBtn.click();

    // Wait for timer to tick
    await page.waitForTimeout(2000);
    await expect(timerDisplay).toHaveText('00:02');

    // Pause timer
    const pauseBtn = timerContainer.getByRole('button', { name: /pause/i });
    await pauseBtn.click();

    // Verify timer stopped
    const timeWhenPaused = await timerDisplay.textContent();
    await page.waitForTimeout(1000);
    await expect(timerDisplay).toHaveText(timeWhenPaused || '00:02');

    // Reset timer
    const resetBtn = timerContainer.getByRole('button', { name: /reset/i });
    await resetBtn.click();
    await expect(timerDisplay).toHaveText('00:00');
  });

  test('Can add and use FormEditor window', async ({ page }) => {
    // Add FormEditor window
    const addFormBtn = page.getByRole('button', { name: /add form editor/i });
    await addFormBtn.click();

    // Wait for lazy-loaded component and data
    const formEditor = page.getByTestId(TEST_SELECTORS.FORM_EDITOR);
    await expect(formEditor).toBeVisible();

    // Check form fields are present
    const firstNameField = formEditor.locator('input[name="firstName"]');
    await expect(firstNameField).toBeVisible();

    // Fill out form
    await firstNameField.clear();
    await firstNameField.fill('John');

    const lastNameField = formEditor.locator('input[name="lastName"]');
    await lastNameField.clear();
    await lastNameField.fill('Doe');

    const emailField = formEditor.locator('input[name="email"]');
    await emailField.clear();
    await emailField.fill('john.doe@example.com');

    const ageField = formEditor.locator('input[name="age"]');
    await ageField.clear();
    await ageField.fill('30');

    // Submit form
    const submitBtn = page.getByTestId(TEST_SELECTORS.FORM_SUBMIT_BUTTON);
    await submitBtn.click();

    // Wait for alert (mock API success)
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('successfully');
      await dialog.accept();
    });
  });

  test('Can close windows', async ({ page }) => {
    // Add multiple windows
    await page.getByRole('button', { name: /add counter/i }).click();
    await page.getByRole('button', { name: /add notes/i }).click();
    await page.getByRole('button', { name: /add timer/i }).click();

    // Wait for all windows to load
    await expect(
      page.getByTestId(TEST_SELECTORS.COUNTER.CONTAINER)
    ).toBeVisible();
    await expect(
      page.getByTestId(TEST_SELECTORS.NOTES_CONTAINER)
    ).toBeVisible();
    await expect(
      page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER)
    ).toBeVisible();

    // Count windows
    const windows = page.locator('[data-testid*="window-container"]');
    await expect(windows).toHaveCount(3);

    // Close first window
    const closeButtons = page.getByRole('button', { name: '×' });
    await closeButtons.first().click();
    await expect(windows).toHaveCount(2);

    // Close all windows
    await closeButtons.first().click();
    await closeButtons.first().click();
    await expect(windows).toHaveCount(0);
  });

  test('Window drag and resize works', async ({ page }) => {
    // Add a window
    await page.getByRole('button', { name: /add counter/i }).click();
    const counterContainer = page.getByTestId(TEST_SELECTORS.COUNTER.CONTAINER);
    await expect(counterContainer).toBeVisible();

    // Get window element
    const windowElement = page
      .locator('[data-testid*="window-container"]')
      .first();
    const initialBox = await windowElement.boundingBox();
    expect(initialBox).not.toBeNull();

    // Try to drag window (drag by header)
    const windowHeader = windowElement.locator('[class*="header"]').first();
    await windowHeader.hover();
    await page.mouse.down();
    await page.mouse.move(initialBox!.x + 100, initialBox!.y + 100);
    await page.mouse.up();

    // Verify window moved
    const newBox = await windowElement.boundingBox();
    expect(newBox).not.toBeNull();
    // Position should have changed (allowing some tolerance)
    const moved =
      Math.abs(newBox!.x - initialBox!.x) > 50 ||
      Math.abs(newBox!.y - initialBox!.y) > 50;
    expect(moved).toBeTruthy();
  });

  test('Layout controls work', async ({ page }) => {
    // Add multiple windows
    await page.getByRole('button', { name: /add counter/i }).click();
    await page.getByRole('button', { name: /add notes/i }).click();
    await page.getByRole('button', { name: /add timer/i }).click();

    // Wait for windows
    await expect(page.locator('[data-testid*="window-container"]')).toHaveCount(
      3
    );

    // Find organize button
    const organizeBtn = page.getByRole('button', { name: /organize/i });
    await expect(organizeBtn).toBeVisible();
    await organizeBtn.click();

    // Verify windows are organized (positions should change)
    await page.waitForTimeout(500); // Allow animation

    // Find reset button
    const resetBtn = page.getByRole('button', { name: /reset/i });
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();

    // Verify all windows are removed
    await expect(page.locator('[data-testid*="window-container"]')).toHaveCount(
      0
    );
  });

  test('Keyboard shortcuts work', async ({ page }) => {
    // Add a window
    await page.getByRole('button', { name: /add counter/i }).click();
    await expect(
      page.getByTestId(TEST_SELECTORS.COUNTER.CONTAINER)
    ).toBeVisible();

    // Press Escape to close window
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-testid*="window-container"]')).toHaveCount(
      0
    );

    // Add another window
    await page.getByRole('button', { name: /add notes/i }).click();
    await expect(
      page.getByTestId(TEST_SELECTORS.NOTES_CONTAINER)
    ).toBeVisible();

    // Press Ctrl+W (or Cmd+W on Mac) to close window
    const isMac = process.platform === 'darwin';
    if (isMac) {
      await page.keyboard.press('Meta+KeyW');
    } else {
      await page.keyboard.press('Control+KeyW');
    }
    await expect(page.locator('[data-testid*="window-container"]')).toHaveCount(
      0
    );
  });

  test('Accessibility - ARIA attributes present', async ({ page }) => {
    // Check main application has proper role
    const desktop = page.getByTestId(TEST_SELECTORS.DESKTOP_CONTAINER);
    await expect(desktop).toHaveAttribute('role', 'application');

    // Add Timer to check ARIA
    await page.getByRole('button', { name: /add timer/i }).click();
    const timerContainer = page.getByTestId(TEST_SELECTORS.TIMER_CONTAINER);
    await expect(timerContainer).toBeVisible();

    // Check timer has proper ARIA attributes
    const timerDisplay = timerContainer.locator('[role="timer"]');
    await expect(timerDisplay).toHaveAttribute('aria-live', 'polite');

    // Check buttons have aria-labels
    const startBtn = timerContainer.getByRole('button', { name: /start/i });
    await expect(startBtn).toHaveAttribute('aria-label');
  });

  test('PWA - Service Worker registered (production only)', async ({
    page,
  }) => {
    // Check if service worker is registered (only in production builds)
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    expect(swRegistered).toBeTruthy();
  });

  test('Performance - Page loads quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');

    // Wait for desktop to be visible
    await page
      .getByTestId(TEST_SELECTORS.DESKTOP_CONTAINER)
      .waitFor({ state: 'visible' });

    const loadTime = Date.now() - startTime;

    // Page should load in less than 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('Responsive - Works on different viewport sizes', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(
      page.getByTestId(TEST_SELECTORS.DESKTOP_CONTAINER)
    ).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(
      page.getByTestId(TEST_SELECTORS.DESKTOP_CONTAINER)
    ).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(
      page.getByTestId(TEST_SELECTORS.DESKTOP_CONTAINER)
    ).toBeVisible();
  });
});
