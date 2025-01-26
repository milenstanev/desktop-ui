import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  retries: 1,
  reporter: 'html',
  use: {
    headless: false,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
});
