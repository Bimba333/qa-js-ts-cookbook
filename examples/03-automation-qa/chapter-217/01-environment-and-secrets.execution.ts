import { expect, test } from "@playwright/test";
import { loadRuntimeConfig, redactConfig } from "../support/execution/runtime-config.js";

test("читает окружение и скрывает secret в диагностике", async () => {
  const config = loadRuntimeConfig({
    QA_ENV: "preview",
    QA_API_BASE_URL: "https://preview.qa.test/api/",
    QA_API_TOKEN: "test-only-token",
  });

  expect(config.environment).toBe("preview");
  expect(config.apiToken).toBe("test-only-token");
  expect(redactConfig(config)).toEqual({
    environment: "preview",
    apiBaseUrl: "https://preview.qa.test/api/",
    apiToken: "[REDACTED]",
    requestTimeoutMs: 3000,
  });
});
