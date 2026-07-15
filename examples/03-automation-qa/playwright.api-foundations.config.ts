import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: [
    "chapter-186/**/*.api.ts",
    "chapter-187/**/*.api.ts",
    "chapter-188/**/*.api.ts",
    "chapter-189/**/*.api.ts",
    "chapter-190/**/*.api.ts",
    "chapter-191/**/*.api.ts",
    "chapter-192/**/*.api.ts",
    "chapter-193/**/*.api.ts",
    "chapter-194/**/*.api.ts",
    "chapter-195/**/*.api.ts",
    "chapter-196/**/*.api.ts",
  ],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 10_000,
  expect: { timeout: 2_000 },
  reporter: "line",
  outputDir: "../../test-results/api-foundations",
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium", headless: true },
    },
  ],
});
