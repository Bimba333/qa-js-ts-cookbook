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
      // Слой REST быстрее интерфейса и не нуждается в браузере, поэтому
      // границы времени у него свои и более жёсткие.
      name: "api",
      testDir: "./tests/api",
      timeout: 15_000,
      expect: { timeout: 3_000 },
    },
    {
      // Унарные вызовы быстрые, но канал нужно успеть открыть: срок теста
      // выше, чем у REST, а крайний срок вызова задаётся в слое.
      name: "grpc",
      testDir: "./tests/grpc",
      timeout: 20_000,
      expect: { timeout: 3_000 },
    },
    {
      // База отвечает быстро, но открытие пула требует времени: срок теста
      // учитывает подключение, а не только сам запрос.
      name: "database",
      testDir: "./tests/database",
      timeout: 20_000,
      expect: { timeout: 3_000 },
    },
    {
      // Межслойный сценарий собирает три транспорта сразу, поэтому времени
      // на подготовку нужно больше, чем любому отдельному слою.
      name: "cross-layer",
      testDir: "./tests/cross-layer",
      timeout: 30_000,
      expect: { timeout: 5_000 },
    },
    {
      // Диагностика проверяется без стенда: предмет проверки — форма
      // доказательств, а не поведение системы.
      name: "diagnostics",
      testDir: "./tests/diagnostics",
      timeout: 10_000,
    },
    {
      // Аудит не обращается ни к стенду, ни к браузеру: он сводит
      // спецификацию с наблюдениями предыдущих прогонов.
      name: "audit",
      testDir: "./tests/audit",
      timeout: 10_000,
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
