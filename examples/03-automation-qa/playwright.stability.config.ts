import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: [
    "chapter-232/**/*.stability.ts",
    "chapter-233/**/*.stability.ts",
    "chapter-234/**/*.stability.ts",
    "chapter-235/**/*.stability.ts",
    "chapter-236/**/*.stability.ts",
    "chapter-237/**/*.stability.ts",
    "chapter-238/**/*.stability.ts",
  ],
  reporter: "line",
  outputDir: "../../test-results/stability/passing",
  retries: 0,
  workers: 2,
  fullyParallel: true,
  projects: [{ name: "stability-local" }],
});
