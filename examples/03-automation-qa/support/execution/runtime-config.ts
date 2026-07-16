export type EnvironmentName = "local" | "preview";

export interface RuntimeConfig {
  readonly environment: EnvironmentName;
  readonly apiBaseUrl: string;
  readonly apiToken: string;
  readonly requestTimeoutMs: number;
}

type EnvironmentSource = Readonly<Record<string, string | undefined>>;

function requireValue(source: EnvironmentSource, name: string): string {
  const value = source[name]?.trim();
  if (!value) {
    throw new Error(`Обязательная переменная ${name} не задана`);
  }
  return value;
}

function parseEnvironment(value: string): EnvironmentName {
  if (value === "local" || value === "preview") {
    return value;
  }
  throw new Error(`QA_ENV должен иметь значение local или preview, получено: ${value}`);
}

function parsePositiveInteger(value: string, name: string): number {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${name} должен быть положительным целым числом`);
  }
  return parsed;
}

export function loadRuntimeConfig(source: EnvironmentSource): RuntimeConfig {
  const environment = parseEnvironment(requireValue(source, "QA_ENV"));
  const parsedApiBaseUrl = new URL(requireValue(source, "QA_API_BASE_URL"));
  const apiToken = requireValue(source, "QA_API_TOKEN");
  const requestTimeoutMs = parsePositiveInteger(
    source.QA_REQUEST_TIMEOUT_MS?.trim() || "3000",
    "QA_REQUEST_TIMEOUT_MS",
  );

  if (parsedApiBaseUrl.protocol !== "http:" && parsedApiBaseUrl.protocol !== "https:") {
    throw new Error("QA_API_BASE_URL должен использовать http или https");
  }

  return Object.freeze({
    environment,
    apiBaseUrl: parsedApiBaseUrl.href,
    apiToken,
    requestTimeoutMs,
  });
}

export function redactConfig(config: RuntimeConfig): Readonly<Record<string, string | number>> {
  return Object.freeze({
    environment: config.environment,
    apiBaseUrl: config.apiBaseUrl,
    apiToken: "[REDACTED]",
    requestTimeoutMs: config.requestTimeoutMs,
  });
}
