import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  globalSetup: "./support/diagnostics/prepare-diagnostics-output.ts",
  testMatch: [
    "chapter-225/**/*.diagnostics.ts",
    "chapter-226/**/*.diagnostics.ts",
    "chapter-227/**/*.diagnostics.ts",
    "chapter-228/**/*.diagnostics.ts",
    "chapter-229/**/*.diagnostics.ts",
    "chapter-230/**/*.diagnostics.ts",
    "chapter-231/**/*.diagnostics.ts",
  ],
  reporter: [
    ["line"],
    ["allure-playwright", { resultsDir: "test-results/diagnostics/allure-results" }],
  ],
  outputDir: "../../test-results/diagnostics/playwright",
  retries: 0,
  workers: 1,
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
});
