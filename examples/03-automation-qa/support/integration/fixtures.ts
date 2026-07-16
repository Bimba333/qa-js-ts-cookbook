import { test as base } from "@playwright/test";
import { loadRuntimeConfig } from "../execution/runtime-config.js";
import { createExecutionIdentity } from "../stability/execution-identity.js";
import { createFramework, type ComposedFramework } from "./composition-root.js";

type IntegrationOptions = {
  runtimeSource: Readonly<Record<string, string | undefined>>;
};

type IntegrationFixtures = {
  framework: ComposedFramework;
};

export const test = base.extend<IntegrationFixtures & IntegrationOptions>({
  runtimeSource: [{
    QA_ENV: "local",
    QA_API_BASE_URL: "https://integration.qa.test",
    QA_API_TOKEN: "test-only-token",
    QA_REQUEST_TIMEOUT_MS: "1000",
  }, { option: true }],

  framework: async ({ runtimeSource }, use, testInfo) => {
    const config = loadRuntimeConfig(runtimeSource);
    const framework = createFramework(config, createExecutionIdentity(testInfo));
    let hasPrimaryError = false;
    let primaryError: unknown;

    try {
      await use(framework);
    } catch (error) {
      hasPrimaryError = true;
      primaryError = error;
    }

    try {
      await framework.close();
    } catch (cleanupError) {
      if (hasPrimaryError) {
        throw new AggregateError(
          [primaryError, cleanupError],
          "Тест и teardown завершились ошибкой",
        );
      }
      throw cleanupError;
    }

    if (hasPrimaryError) throw primaryError;
  },
});

export { expect } from "@playwright/test";
