import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/smoke",
  testMatch: "**/*.spec.ts",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 5_000,
  expect: {
    timeout: 1_000,
  },
  reporter: "line",
  outputDir: "../../test-results/final-project",
  projects: [
    {
      name: "foundation",
    },
  ],
});
