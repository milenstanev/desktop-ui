import { test, expect } from '@playwright/test';

test.describe('Timer feature', () => {
  test('opens Timer window and shows timer UI', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /add timer/i }).click();
    await expect(page.getByTestId('timer-feature')).toBeVisible();
    await expect(page.getByRole('timer')).toHaveText(/^\d{2}:\d{2}$/);
    await expect(page.getByRole('button', { name: /start timer/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /pause timer/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /reset timer/i })).toBeVisible();
  });
});
