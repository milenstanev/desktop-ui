import { test, expect } from '@playwright/test';
import { APP_STRINGS } from '~/constants';
import { TEST_SELECTORS } from '~/testSelectors';

test.describe('Basic app functionality', () => {
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

  test('should display the correct title', async ({ page }) => {
    const title = await page.title();
    expect(title).toBe(TEST_SELECTORS.PAGE_TITLE);

    const htmlTitle = page.locator(TEST_SELECTORS.HEADING_SELECTOR);
    const htmlTitleText = await htmlTitle.innerText();
    expect(htmlTitleText).toBe(APP_STRINGS.HEADING_TITLE);
  });
});
