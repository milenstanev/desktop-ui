import { test, expect } from '@playwright/test';

test.describe('Micro-frontends', () => {
  test('loads analytics remote feature in a desktop window', async ({
    page,
  }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Architecture/i }).click();
    await page.getByRole('button', { name: /Load Analytics Feature/i }).click();

    await expect(page.getByTestId('analytics-remote-feature')).toBeVisible();
    await expect(
      page.getByText('Loaded from analytics remote via Module Federation')
    ).toBeVisible();
  });
});
