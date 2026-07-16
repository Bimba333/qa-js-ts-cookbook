import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: ["controlled-failures/**/*.failure.ts"],
  reporter: "line",
  outputDir: "../../test-results/diagnostics/controlled-failures",
  retries: 0,
  workers: 1,
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
});
