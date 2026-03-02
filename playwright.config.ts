import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testMatch: [
    'tests/**/*.spec.ts', // Core/integration tests at root
    'src/**/__tests__/e2e/**/*.spec.ts', // Feature-specific E2E tests
  ],
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  retries: process.env.CI ? 2 : 1,
  reporter: 'html',
  fullyParallel: false,
  workers: process.env.CI ? 2 : 1,
  use: {
    headless: !!process.env.CI,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: {
    command: 'npx serve -s build -l 3000',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
