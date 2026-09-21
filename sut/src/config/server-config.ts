import { SUTConfigurationError, type EnvironmentSource } from "./database-config.js";

export type ServerConfig = Readonly<{
  httpHost: string;
  httpPort: number;
  grpcHost: string;
  grpcPort: number;
}>;

const DEFAULTS = Object.freeze({
  httpHost: "127.0.0.1",
  httpPort: 4_310,
  grpcHost: "127.0.0.1",
  grpcPort: 4_311,
});

/**
 * Разрешены только локальные bind-адреса и `0.0.0.0` внутри контейнера.
 * Внешний bind для учебного SUT запрещён.
 */
const ALLOWED_HOSTS = new Set(["127.0.0.1", "localhost", "::1", "0.0.0.0"]);

function readHost(
  source: EnvironmentSource,
  key: string,
  fallback: string,
): string {
  const host = (source[key] ?? fallback).trim().toLowerCase();

  if (!ALLOWED_HOSTS.has(host)) {
    throw new SUTConfigurationError(
      "invalid_local_target",
      key,
      "Учебный SUT может слушать только локальные адреса",
    );
  }

  return host;
}

function readPort(
  source: EnvironmentSource,
  key: string,
  fallback: number,
): number {
  const raw = (source[key] ?? String(fallback)).trim();

  if (!/^\d+$/.test(raw)) {
    throw new SUTConfigurationError(
      "invalid_integer",
      key,
      `Значение ${key} должно быть целым числом`,
    );
  }

  const port = Number(raw);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65_535) {
    throw new SUTConfigurationError(
      "invalid_integer",
      key,
      `Значение ${key} должно быть портом от 1 до 65535`,
    );
  }

  return port;
}

export function loadServerConfig(
  source: EnvironmentSource = process.env,
): ServerConfig {
  const config = Object.freeze({
    httpHost: readHost(source, "SUT_HTTP_HOST", DEFAULTS.httpHost),
    httpPort: readPort(source, "SUT_HTTP_PORT", DEFAULTS.httpPort),
    grpcHost: readHost(source, "SUT_GRPC_HOST", DEFAULTS.grpcHost),
    grpcPort: readPort(source, "SUT_GRPC_PORT", DEFAULTS.grpcPort),
  });

  if (config.httpPort === config.grpcPort) {
    throw new SUTConfigurationError(
      "invalid_integer",
      "SUT_GRPC_PORT",
      "HTTP и gRPC не могут использовать один порт",
    );
  }

  return config;
}
