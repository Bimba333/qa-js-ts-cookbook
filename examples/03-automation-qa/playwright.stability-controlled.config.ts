import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  globalSetup: "./support/stability/prepare-stability-output.ts",
  testMatch: ["controlled-instability/**/*.controlled.ts"],
  reporter: [
    ["line"],
    ["json", { outputFile: "../../test-results/stability/controlled-results.json" }],
  ],
  outputDir: "../../test-results/stability/controlled",
  retries: 1,
  workers: 1,
  projects: [{ name: "stability-controlled" }],
});
