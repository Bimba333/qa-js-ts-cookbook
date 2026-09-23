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
    {
      // Слой интерфейса работает против поднятого стенда, поэтому у него
      // свой каталог, свои границы времени и включённые доказательства.
      name: "ui",
      testDir: "./tests/ui",
      timeout: 30_000,
      expect: { timeout: 5_000 },
      use: {
        screenshot: "only-on-failure",
        video: "off",
      },
    },
  ],
});
