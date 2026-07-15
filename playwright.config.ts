import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/playwright-bootstrap',
  workers: 1,
  retries: 0,
  timeout: 10_000,
  expect: {
    timeout: 5_000,
  },
  reporter: 'line',
  use: {
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
