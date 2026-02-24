import { test, expect } from '@playwright/test';

test.describe('Notes feature', () => {
  test('opens Notes window and shows notes UI', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /add notes/i }).click();
    await expect(page.getByTestId('notes-feature')).toBeVisible();
    await expect(page.getByPlaceholder('New note...')).toBeVisible();
    await expect(page.getByRole('button', { name: /add note/i })).toBeVisible();
  });

  test('can add a note in the Notes window', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /add notes/i }).click();
    await page.getByPlaceholder('New note...').fill('E2E test note');
    await page.getByRole('button', { name: /add note/i }).click();
    await expect(page.getByText('E2E test note')).toBeVisible();
  });
});
