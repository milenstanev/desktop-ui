import { test, expect } from '@playwright/test';

test('should display the correct title', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title).toBe('React App');

  const htmlTitle = page.locator('H1');
  const htmlTitleText = await htmlTitle.innerText();
  expect(htmlTitleText).toBe('Desktop UI');
});
