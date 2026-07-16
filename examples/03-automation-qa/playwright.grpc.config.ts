import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: [
    "chapter-197/**/*.grpc.ts",
    "chapter-198/**/*.grpc.ts",
    "chapter-199/**/*.grpc.ts",
    "chapter-200/**/*.grpc.ts",
    "chapter-201/**/*.grpc.ts",
    "chapter-202/**/*.grpc.ts",
    "chapter-203/**/*.grpc.ts",
    "chapter-204/**/*.grpc.ts",
    "chapter-205/**/*.grpc.ts",
    "chapter-206/**/*.grpc.ts",
  ],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 10_000,
  expect: { timeout: 2_000 },
  reporter: "line",
  outputDir: "../../test-results/grpc",
});
