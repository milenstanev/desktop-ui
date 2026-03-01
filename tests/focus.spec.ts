import { test, expect } from '@playwright/test';

test.describe('Window focus and keyboard shortcuts', () => {
  test('new window is automatically focused', async ({ page }) => {
    await page.goto('/');
    
    // Add a Timer window
    await page.getByRole('button', { name: /add timer/i }).click();
    await page.waitForTimeout(500); // Wait for lazy load
    
    // Window should exist and have focused class
    const window1 = page.locator('[role="application"]').first();
    await expect(window1).toBeVisible();
    
    const classes = await window1.getAttribute('class');
    expect(classes).toContain('focused');
  });

  test('Escape key closes focused window', async ({ page }) => {
    await page.goto('/');
    
    // Add a Timer window
    await page.getByRole('button', { name: /add timer/i }).click();
    await page.waitForTimeout(500); // Wait for lazy load
    
    // Verify window exists
    await expect(page.locator('[role="application"]')).toHaveCount(1);
    
    // Press Escape
    await page.keyboard.press('Escape');
    
    // Window should be closed
    await expect(page.locator('[role="application"]')).toHaveCount(0);
  });

  test('Ctrl+W closes focused window', async ({ page }) => {
    await page.goto('/');
    
    // Add a Timer window
    await page.getByRole('button', { name: /add timer/i }).click();
    await page.waitForTimeout(500); // Wait for lazy load
    
    // Verify window exists
    await expect(page.locator('[role="application"]')).toHaveCount(1);
    
    // Press Ctrl+W (works on all platforms in CI)
    await page.keyboard.press('Control+KeyW');
    
    // Window should be closed
    await expect(page.locator('[role="application"]')).toHaveCount(0);
  });
});
