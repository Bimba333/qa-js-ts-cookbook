import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: [
    "chapter-245/**/*.integration.ts",
    "chapter-246/**/*.integration.ts",
    "chapter-247/**/*.integration.ts",
    "chapter-248/**/*.integration.ts",
    "chapter-249/**/*.integration.ts",
  ],
  reporter: "line",
  outputDir: "../../test-results/integration",
  retries: 0,
  workers: 2,
});
