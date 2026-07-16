import { expect, test } from "../support/integration/fixtures.js";

test.use({
  runtimeSource: {
    QA_ENV: "preview",
    QA_API_BASE_URL: "https://preview.integration.qa.test",
    QA_API_TOKEN: "test-only-token",
    QA_REQUEST_TIMEOUT_MS: "1500",
  },
});

test("строит test-scoped context из проверенной конфигурации", async ({ framework }) => {
  expect(framework.config).toEqual({
    environment: "preview",
    apiBaseUrl: "https://preview.integration.qa.test/",
    apiToken: "test-only-token",
    requestTimeoutMs: 1500,
  });
  expect(Object.isFrozen(framework.config)).toBe(true);
  expect(Object.isFrozen(framework)).toBe(true);
});
