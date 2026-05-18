import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for testing live/running application
 * Use this when testing against an already running app instance.
 */
const LIVE_BASE_URL =
  process.env.PLAYWRIGHT_LIVE_BASE_URL ?? 'http://192.168.1.5:3000';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/live-*.spec.ts', // Match live-ui-test.spec.ts and live-diagnostic.spec.ts

  fullyParallel: false, // Run tests sequentially for stability
  forbidOnly: !!process.env.CI,
  retries: 0, // No retries for stability testing
  workers: 1, // Single worker for consistent results
  timeout: 30 * 1000,

  expect: {
    timeout: 10000, // Longer timeout for live testing
  },

  reporter: 'list',

  use: {
    baseURL: LIVE_BASE_URL,
    headless: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // No webServer - we expect the app to already be running
});
