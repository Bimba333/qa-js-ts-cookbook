import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "chapter-*/**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 10_000,
  expect: {
    timeout: 2_000,
  },
  reporter: "line",
  outputDir: "../../test-results/educational-playwright",
  use: {
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], browserName: "chromium" },
    },
  ],
});
