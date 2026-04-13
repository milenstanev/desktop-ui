import { test, expect } from '@playwright/test';

test.describe('Micro-frontends', () => {
  test('loads analytics remote feature in a desktop window', async ({
    page,
  }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Architecture/i }).click();
    await page.getByRole('button', { name: /Load Analytics Feature/i }).click();

    const feature = page.getByTestId('analytics-remote-feature');
    const remoteError = page.locator('p').filter({
      hasText: /Remote "analytics" container not found|Failed to load script/i,
    });

    await expect
      .poll(
        async () => {
          if (await feature.isVisible()) return 'loaded';
          if (await remoteError.isVisible()) return 'error';
          return 'pending';
        },
        { timeout: 15000 }
      )
      .toBe('loaded');

    await expect(remoteError).toHaveCount(0);
    await expect(feature).toBeVisible();
    await expect(
      page.getByText('Loaded from analytics remote via Module Federation')
    ).toBeVisible();
  });
});
