import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";

const authenticationStatePath = fileURLToPath(
  new URL("../../test-results/ui-layer-auth/qa-user.json", import.meta.url),
);

export default defineConfig({
  testDir: ".",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 10_000,
  expect: {
    timeout: 2_000,
  },
  reporter: "line",
  outputDir: "../../test-results/ui-layer",
  use: {
    headless: true,
  },
  projects: [
    {
      name: "authentication-setup",
      testMatch: "chapter-178/auth.setup.ts",
    },
    {
      name: "authenticated-chromium",
      dependencies: ["authentication-setup"],
      testMatch: "chapter-178/**/*.ui.ts",
      use: {
        ...devices["Desktop Chrome"],
        browserName: "chromium",
        storageState: authenticationStatePath,
      },
    },
    {
      name: "chromium",
      testMatch: [
        "chapter-176/**/*.ui.ts",
        "chapter-177/**/*.ui.ts",
        "chapter-179/**/*.ui.ts",
        "chapter-180/**/*.ui.ts",
        "chapter-181/**/*.ui.ts",
        "chapter-182/**/*.ui.ts",
        "chapter-183/**/*.ui.ts",
        "chapter-184/**/*.ui.ts",
        "chapter-185/**/*.ui.ts",
      ],
      use: {
        ...devices["Desktop Chrome"],
        browserName: "chromium",
      },
    },
  ],
});
