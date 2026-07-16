import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: [
    "chapter-216/**/*.execution.ts",
    "chapter-217/**/*.execution.ts",
    "chapter-218/**/*.execution.ts",
    "chapter-219/**/*.execution.ts",
    "chapter-220/**/*.execution.ts",
    "chapter-221/**/*.execution.ts",
    "chapter-222/**/*.execution.ts",
    "chapter-223/**/*.execution.ts",
    "chapter-224/**/*.execution.ts",
  ],
  reporter: "line",
  outputDir: "../../test-results/execution",
  projects: [
    {
      name: "local-chromium",
      metadata: { environment: "local" },
      use: {
        baseURL: "https://local.qa.test",
        browserName: "chromium",
      },
    },
    {
      name: "preview-chromium",
      metadata: { environment: "preview" },
      use: {
        baseURL: "https://preview.qa.test",
        browserName: "chromium",
      },
    },
  ],
});
