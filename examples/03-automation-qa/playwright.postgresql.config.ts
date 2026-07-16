import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: [
    "chapter-207/**/*.postgresql.ts",
    "chapter-208/**/*.postgresql.ts",
    "chapter-209/**/*.postgresql.ts",
    "chapter-210/**/*.postgresql.ts",
    "chapter-211/**/*.postgresql.ts",
    "chapter-212/**/*.postgresql.ts",
    "chapter-213/**/*.postgresql.ts",
    "chapter-214/**/*.postgresql.ts",
    "chapter-215/**/*.postgresql.ts",
  ],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 10_000,
  expect: { timeout: 2_000 },
  reporter: "line",
  outputDir: "../../test-results/postgresql",
});

