import type { RawEnvironment, RuntimeConfig } from "./types.js";
import { validateRuntimeConfig } from "./validate-config.js";

const CONFIGURATION_KEYS = [
  "QA_PROFILE",
  "QA_UI_BASE_URL",
  "QA_REST_BASE_URL",
  "QA_GRPC_TARGET",
  "QA_POSTGRES_CONNECTION_REF",
  "QA_CREDENTIALS_REF",
  "QA_OPERATION_TIMEOUT_MS",
  "QA_ARTIFACT_DIR",
  "CI",
  "GITHUB_RUN_ID",
] as const;

export function readEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): RawEnvironment {
  return Object.freeze(Object.fromEntries(
    CONFIGURATION_KEYS.map((key) => [key, source[key]]),
  ));
}

export function loadRuntimeConfig(
  source: NodeJS.ProcessEnv = process.env,
): RuntimeConfig {
  return validateRuntimeConfig(readEnvironment(source));
}
