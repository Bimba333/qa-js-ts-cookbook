import { test as base } from "@playwright/test";

import {
  validateRuntimeConfig,
  type RawEnvironment,
} from "../config/index.js";
import {
  createFoundation,
  type FoundationContext,
} from "../composition/index.js";

type FoundationOptions = {
  runtimeSource: RawEnvironment;
};

type FoundationFixtures = {
  foundation: FoundationContext;
};

const SAFE_SMOKE_SOURCE: RawEnvironment = Object.freeze({
  QA_PROFILE: "local",
  QA_UI_BASE_URL: "https://ui.example.invalid",
  QA_REST_BASE_URL: "https://rest.example.invalid",
  QA_GRPC_TARGET: "grpc.example.invalid:443",
  QA_POSTGRES_CONNECTION_REF: "secret://local/postgres",
  QA_CREDENTIALS_REF: "secret://local/qa-credentials",
  QA_OPERATION_TIMEOUT_MS: "5000",
  QA_ARTIFACT_DIR: "test-results/final-project",
  CI: "false",
});

export const test = base.extend<FoundationFixtures & FoundationOptions>({
  runtimeSource: [SAFE_SMOKE_SOURCE, { option: true }],

  foundation: async ({ runtimeSource }, use) => {
    const config = validateRuntimeConfig(runtimeSource);
    const runtime = createFoundation(config);
    let failure: { error: unknown } | undefined;

    try {
      await use(runtime.context);
    } catch (error) {
      failure = { error };
    }

    if (failure) {
      await runtime.close(failure.error);
      throw failure.error;
    }

    await runtime.close();
  },
});

export { expect } from "@playwright/test";
