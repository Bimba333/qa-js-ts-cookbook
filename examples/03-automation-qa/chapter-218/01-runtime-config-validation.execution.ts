import { expect, test } from "@playwright/test";
import { loadRuntimeConfig } from "../support/execution/runtime-config.js";

test("останавливает запуск при некорректной конфигурации", async () => {
  const localConfig = loadRuntimeConfig({
    QA_ENV: "local",
    QA_API_BASE_URL: "https://local.qa.test",
    QA_API_TOKEN: "test-token",
  });
  expect(localConfig.environment).toBe("local");
  expect(localConfig.apiBaseUrl).toBe("https://local.qa.test/");
  expect(typeof localConfig.apiBaseUrl).toBe("string");
  expect(Object.isFrozen(localConfig)).toBe(true);

  expect(() => loadRuntimeConfig({
    QA_API_BASE_URL: "https://local.qa.test",
    QA_API_TOKEN: "test-token",
  })).toThrow("Обязательная переменная QA_ENV не задана");

  expect(() => loadRuntimeConfig({
    QA_ENV: "production",
    QA_API_BASE_URL: "https://invalid.qa.test",
    QA_API_TOKEN: "test-token",
  })).toThrow("QA_ENV должен иметь значение local или preview");

  expect(() => loadRuntimeConfig({
    QA_ENV: "local",
    QA_API_BASE_URL: "https://local.qa.test",
  })).toThrow("Обязательная переменная QA_API_TOKEN не задана");

  expect(() => loadRuntimeConfig({
    QA_ENV: "local",
    QA_API_BASE_URL: "not-a-url",
    QA_API_TOKEN: "test-token",
  })).toThrow(TypeError);

  expect(() => loadRuntimeConfig({
    QA_ENV: "preview",
    QA_API_BASE_URL: "ftp://preview.qa.test",
    QA_API_TOKEN: "test-token",
  })).toThrow("QA_API_BASE_URL должен использовать http или https");

  expect(() => loadRuntimeConfig({
    QA_ENV: "preview",
    QA_API_BASE_URL: "https://preview.qa.test",
    QA_API_TOKEN: "   ",
  })).toThrow("Обязательная переменная QA_API_TOKEN не задана");

  expect(() => loadRuntimeConfig({
    QA_ENV: "preview",
    QA_API_BASE_URL: "https://preview.qa.test",
    QA_API_TOKEN: "test-token",
    QA_REQUEST_TIMEOUT_MS: "0",
  })).toThrow("QA_REQUEST_TIMEOUT_MS должен быть положительным целым числом");
});
