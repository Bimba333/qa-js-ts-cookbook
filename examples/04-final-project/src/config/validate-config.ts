import { isAbsolute } from "node:path";

import { ConfigurationError } from "./configuration-error.js";
import {
  executionProfiles,
  type ExecutionProfile,
  type RawEnvironment,
  type RuntimeConfig,
} from "./types.js";

const PROFILE_KEY = "QA_PROFILE";
const UI_URL_KEY = "QA_UI_BASE_URL";
const REST_URL_KEY = "QA_REST_BASE_URL";
const GRPC_TARGET_KEY = "QA_GRPC_TARGET";
const POSTGRES_REF_KEY = "QA_POSTGRES_CONNECTION_REF";
const CREDENTIALS_REF_KEY = "QA_CREDENTIALS_REF";
const TIMEOUT_KEY = "QA_OPERATION_TIMEOUT_MS";
const ARTIFACT_DIR_KEY = "QA_ARTIFACT_DIR";
const CI_KEY = "CI";

function requireValue(source: RawEnvironment, key: string): string {
  const value = source[key]?.trim();

  if (!value) {
    throw new ConfigurationError(
      "missing",
      key,
      "обязательное значение не задано",
    );
  }

  return value;
}

function parseProfile(value: string): ExecutionProfile {
  if (value === "local" || value === "ci") {
    return value;
  }

  throw new ConfigurationError(
    "unsupported",
    PROFILE_KEY,
    `поддерживаются только ${executionProfiles.join(" и ")}`,
  );
}

function parseHttpUrl(value: string, key: string): string {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    // URL errors retain the raw input, so they are not attached as a cause.
    throw new ConfigurationError(
      "invalid_format",
      key,
      "ожидался корректный URL",
    );
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ConfigurationError(
      "invalid_format",
      key,
      "разрешены только протоколы http и https",
    );
  }

  if (url.username || url.password) {
    throw new ConfigurationError(
      "invalid_format",
      key,
      "учётные данные нельзя включать в URL",
    );
  }

  if (url.search || url.hash) {
    throw new ConfigurationError(
      "invalid_format",
      key,
      "base URL не должен содержать query или fragment",
    );
  }

  return url.href;
}

function parseGrpcTarget(value: string): string {
  if (value.includes("://") || value.includes("/") || value.includes("@")) {
    throw new ConfigurationError(
      "invalid_format",
      GRPC_TARGET_KEY,
      "ожидался target в формате host:port без схемы и учётных данных",
    );
  }

  const separator = value.lastIndexOf(":");
  const host = value.slice(0, separator);
  const portText = value.slice(separator + 1);
  const port = Number(portText);
  const hostLabels = host.split(".");

  if (
    !host
    || hostLabels.some(
      (label) => !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(label),
    )
  ) {
    throw new ConfigurationError(
      "invalid_format",
      GRPC_TARGET_KEY,
      "host имеет некорректный формат",
    );
  }

  if (
    !/^\d+$/.test(portText)
    || !Number.isSafeInteger(port)
    || port < 1
    || port > 65_535
  ) {
    throw new ConfigurationError(
      "invalid_range",
      GRPC_TARGET_KEY,
      "port должен быть десятичным числом от 1 до 65535",
    );
  }

  return `${host.toLowerCase()}:${port}`;
}

function parseSecretReference(value: string, key: string): string {
  if (
    !/^secret:\/\/[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+(?:\/[a-zA-Z0-9._-]+)*$/.test(
      value,
    )
  ) {
    throw new ConfigurationError(
      "invalid_format",
      key,
      "ожидалась ссылка вида secret://source/key без пробелов",
    );
  }

  return value;
}

function parsePositiveInteger(
  value: string,
  key: string,
  minimum: number,
  maximum: number,
): number {
  const parsed = Number(value);

  if (
    !/^\d+$/.test(value)
    || !Number.isSafeInteger(parsed)
    || parsed < minimum
    || parsed > maximum
  ) {
    throw new ConfigurationError(
      "invalid_range",
      key,
      `ожидалось целое число от ${minimum} до ${maximum}`,
    );
  }

  return parsed;
}

function parseBoolean(value: string, key: string): boolean {
  if (value === "true") return true;
  if (value === "false") return false;

  throw new ConfigurationError(
    "invalid_format",
    key,
    "поддерживаются только true и false",
  );
}

function parseArtifactDirectory(value: string): string {
  const normalized = value.replaceAll("\\", "/");
  const isWindowsAbsolute = /^[a-zA-Z]:\//.test(normalized);
  const isUncPath = normalized.startsWith("//");

  if (
    isAbsolute(normalized)
    || isWindowsAbsolute
    || isUncPath
    || normalized.split("/").includes("..")
    || normalized === "."
  ) {
    throw new ConfigurationError(
      "invalid_format",
      ARTIFACT_DIR_KEY,
      "ожидался безопасный относительный путь внутри проекта",
    );
  }

  return normalized;
}

export function validateRuntimeConfig(source: RawEnvironment): RuntimeConfig {
  const profile = parseProfile(requireValue(source, PROFILE_KEY));
  const isCi = parseBoolean(source[CI_KEY]?.trim() || "false", CI_KEY);

  if ((profile === "ci") !== isCi) {
    throw new ConfigurationError(
      "inconsistent",
      CI_KEY,
      "значение должно соответствовать выбранному QA_PROFILE",
    );
  }

  const defaultTimeout = profile === "ci" ? "10000" : "5000";
  const timeoutValue = source[TIMEOUT_KEY]?.trim() || defaultTimeout;
  const artifactDirectory = source[ARTIFACT_DIR_KEY]?.trim()
    || "test-results/final-project";
  const ciRunId = source.GITHUB_RUN_ID?.trim();

  return Object.freeze({
    profile,
    uiBaseUrl: parseHttpUrl(requireValue(source, UI_URL_KEY), UI_URL_KEY),
    restBaseUrl: parseHttpUrl(requireValue(source, REST_URL_KEY), REST_URL_KEY),
    grpcTarget: parseGrpcTarget(requireValue(source, GRPC_TARGET_KEY)),
    postgresConnectionReference: parseSecretReference(
      requireValue(source, POSTGRES_REF_KEY),
      POSTGRES_REF_KEY,
    ),
    credentialReference: parseSecretReference(
      requireValue(source, CREDENTIALS_REF_KEY),
      CREDENTIALS_REF_KEY,
    ),
    operationTimeoutMs: parsePositiveInteger(
      timeoutValue,
      TIMEOUT_KEY,
      100,
      120_000,
    ),
    artifactDirectory: parseArtifactDirectory(artifactDirectory),
    isCi,
    ...(ciRunId ? { ciRunId } : {}),
  });
}
