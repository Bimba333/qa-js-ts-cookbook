import { expect, test } from "@playwright/test";

import {
  ConfigurationError,
  readEnvironment,
  validateRuntimeConfig,
  type RawEnvironment,
} from "../../src/config/index.js";

const VALID_SOURCE: RawEnvironment = Object.freeze({
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

function captureConfigurationError(source: RawEnvironment): ConfigurationError {
  try {
    validateRuntimeConfig(source);
  } catch (error) {
    if (error instanceof ConfigurationError) return error;
    throw error;
  }

  throw new Error("Ожидалась ConfigurationError");
}

test("создаёт нормализованную неизменяемую конфигурацию", () => {
  const config = validateRuntimeConfig({
    ...VALID_SOURCE,
    QA_UI_BASE_URL: " https://ui.example.invalid ",
    QA_GRPC_TARGET: "GRPC.EXAMPLE.INVALID:443",
  });

  expect(config.uiBaseUrl).toBe("https://ui.example.invalid/");
  expect(config.grpcTarget).toBe("grpc.example.invalid:443");
  expect(config.operationTimeoutMs).toBe(5_000);
  expect(Object.isFrozen(config)).toBe(true);
  expect(Reflect.set(config, "profile", "ci")).toBe(false);
});

test("создаёт согласованную CI-конфигурацию", () => {
  const config = validateRuntimeConfig({
    ...VALID_SOURCE,
    QA_PROFILE: "ci",
    QA_OPERATION_TIMEOUT_MS: undefined,
    CI: "true",
    GITHUB_RUN_ID: " 42 ",
  });

  expect(config.profile).toBe("ci");
  expect(config.isCi).toBe(true);
  expect(config.operationTimeoutMs).toBe(10_000);
  expect(config.ciRunId).toBe("42");
});

test("отклоняет отсутствующие обязательные ключи", () => {
  const missingUrl = captureConfigurationError({
    ...VALID_SOURCE,
    QA_UI_BASE_URL: undefined,
  });
  const missingProfile = captureConfigurationError({
    ...VALID_SOURCE,
    QA_PROFILE: undefined,
  });

  expect(missingUrl.key).toBe("QA_UI_BASE_URL");
  expect(missingUrl.code).toBe("missing");
  expect(missingProfile.key).toBe("QA_PROFILE");
  expect(missingProfile.code).toBe("missing");
});

test("отклоняет неподдерживаемый профиль", () => {
  const error = captureConfigurationError({
    ...VALID_SOURCE,
    QA_PROFILE: "production",
  });

  expect(error.key).toBe("QA_PROFILE");
  expect(error.code).toBe("unsupported");
});

test("отклоняет конфликт профиля и CI", () => {
  const inconsistent = captureConfigurationError({
    ...VALID_SOURCE,
    QA_PROFILE: "ci",
    CI: "false",
  });
  const invalidBoolean = captureConfigurationError({
    ...VALID_SOURCE,
    CI: "TRUE",
  });

  expect(inconsistent.key).toBe("CI");
  expect(inconsistent.code).toBe("inconsistent");
  expect(invalidBoolean.key).toBe("CI");
  expect(invalidBoolean.code).toBe("invalid_format");
});

test("проверяет правила base URL без раскрытия необработанного ввода", () => {
  const sensitiveValue = "private-marker-not-a-url";
  const invalidValues = [
    sensitiveValue,
    "ftp://ui.example.invalid",
    "https://user:password@ui.example.invalid",
    "https://ui.example.invalid?mode=test",
    "https://ui.example.invalid#section",
  ];

  for (const value of invalidValues) {
    const error = captureConfigurationError({
      ...VALID_SOURCE,
      QA_UI_BASE_URL: value,
    });

    expect(error.key).toBe("QA_UI_BASE_URL");
    expect(error.code).toBe("invalid_format");
    expect(error.message).not.toContain(value);
  }

  const sensitiveError = captureConfigurationError({
    ...VALID_SOURCE,
    QA_UI_BASE_URL: sensitiveValue,
  });
  expect(sensitiveError.cause).toBeUndefined();
});

test("отклоняет некорректный gRPC target", () => {
  const invalidValues = [
    "https://grpc.example.invalid",
    "-grpc.example.invalid:443",
    "grpc.example.invalid:1e3",
    "[::1]:443",
    "grpc.example.invalid:65536",
  ];

  for (const value of invalidValues) {
    const error = captureConfigurationError({
      ...VALID_SOURCE,
      QA_GRPC_TARGET: value,
    });

    expect(error.key).toBe("QA_GRPC_TARGET");
  }
});

test("отклоняет некорректный timeout", () => {
  const invalidValues = ["0", "1.5", "1e3", "NaN", "Infinity", "120001"];

  for (const value of invalidValues) {
    const error = captureConfigurationError({
      ...VALID_SOURCE,
      QA_OPERATION_TIMEOUT_MS: value,
    });

    expect(error.key).toBe("QA_OPERATION_TIMEOUT_MS");
    expect(error.code).toBe("invalid_range");
  }
});

test("принимает только полную ссылку на секрет без раскрытия ввода", () => {
  const invalidValues = [
    "secret:///qa-credentials",
    "secret://local",
    "secret://local/",
    "secret://local/qa-credentials?version=1",
    "secret://local/qa-credentials#current",
    "https://secrets.example.invalid/qa-credentials",
  ];

  for (const value of invalidValues) {
    const error = captureConfigurationError({
      ...VALID_SOURCE,
      QA_CREDENTIALS_REF: value,
    });

    expect(error.key).toBe("QA_CREDENTIALS_REF");
    expect(error.code).toBe("invalid_format");
    expect(error.message).not.toContain(value);
  }
});

test("сохраняет явно переданную безопасную внутреннюю причину", () => {
  const cause = new Error("safe internal cause");
  const error = new ConfigurationError(
    "invalid_format",
    "QA_INTERNAL_VALUE",
    "внутренний parser завершился ошибкой",
    cause,
  );

  expect(error.cause).toBe(cause);
  expect(error.code).toBe("invalid_format");
  expect(error.key).toBe("QA_INTERNAL_VALUE");
});

test("отклоняет небезопасный путь артефактов на разных платформах", () => {
  const invalidValues = [
    "/tmp/results",
    "../results",
    "results/../private",
    "C:\\private\\results",
    "\\\\server\\share",
  ];

  for (const value of invalidValues) {
    const error = captureConfigurationError({
      ...VALID_SOURCE,
      QA_ARTIFACT_DIR: value,
    });

    expect(error.key).toBe("QA_ARTIFACT_DIR");
    expect(error.code).toBe("invalid_format");
  }
});

test("граница необработанного ввода копирует только разрешённые ключи", () => {
  const source = readEnvironment({
    ...VALID_SOURCE,
    UNRELATED_VALUE: "not-copied",
  });

  expect(source.UNRELATED_VALUE).toBeUndefined();
  expect(source.QA_PROFILE).toBe("local");
  expect(Object.isFrozen(source)).toBe(true);
});
