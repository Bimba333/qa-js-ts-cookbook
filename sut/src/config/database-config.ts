import type { PoolConfig } from "pg";

export type DatabaseRole = "migration" | "application" | "reader";

export type EnvironmentSource = Readonly<Record<string, string | undefined>>;

export type DatabaseConfig = Readonly<{
  mode: "educational";
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  connectionTimeoutMs: number;
  statementTimeoutMs: number;
}>;

const DEFAULTS = Object.freeze({
  host: "127.0.0.1",
  port: 55_432,
  database: "educational_work_items",
  connectionTimeoutMs: 3_000,
  statementTimeoutMs: 5_000,
});

const ROLE_DEFAULTS: Readonly<
  Record<DatabaseRole, Readonly<{ user: string; password: string }>>
> = Object.freeze({
  migration: Object.freeze({
    user: "sut_migrator",
    password: "educational_migrator_only",
  }),
  application: Object.freeze({
    user: "sut_app",
    password: "educational_app_only",
  }),
  reader: Object.freeze({
    user: "sut_reader",
    password: "educational_reader_only",
  }),
});

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1", "postgres"]);

export class SUTConfigurationError extends Error {
  readonly code:
    | "invalid_integer"
    | "invalid_local_target"
    | "invalid_role"
    | "missing"
    | "unsupported_mode";
  readonly key: string;

  constructor(
    code: SUTConfigurationError["code"],
    key: string,
    message: string,
  ) {
    super(message);
    this.name = "SUTConfigurationError";
    this.code = code;
    this.key = key;
  }
}

function readRequired(
  source: EnvironmentSource,
  key: string,
  fallback: string,
): string {
  const value = source[key] ?? fallback;
  const normalized = value.trim();

  if (normalized.length === 0) {
    throw new SUTConfigurationError(
      "missing",
      key,
      `Обязательное значение ${key} отсутствует`,
    );
  }

  return normalized;
}

function readInteger(
  source: EnvironmentSource,
  key: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  const raw = source[key] ?? String(fallback);

  if (!/^\d+$/.test(raw)) {
    throw new SUTConfigurationError(
      "invalid_integer",
      key,
      `Значение ${key} должно быть целым числом в разрешённом диапазоне`,
    );
  }

  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < minimum || value > maximum) {
    throw new SUTConfigurationError(
      "invalid_integer",
      key,
      `Значение ${key} должно быть целым числом в разрешённом диапазоне`,
    );
  }

  return value;
}

export function loadDatabaseConfig(
  role: DatabaseRole,
  source: EnvironmentSource = process.env,
): DatabaseConfig {
  if (!Object.hasOwn(ROLE_DEFAULTS, role)) {
    throw new SUTConfigurationError(
      "invalid_role",
      "databaseRole",
      "Неизвестная database role",
    );
  }

  const mode = readRequired(source, "SUT_MODE", "educational");
  if (mode !== "educational") {
    throw new SUTConfigurationError(
      "unsupported_mode",
      "SUT_MODE",
      "SUT поддерживает только изолированный educational mode",
    );
  }

  const host = readRequired(source, "SUT_DB_HOST", DEFAULTS.host).toLowerCase();
  if (!LOCAL_HOSTS.has(host)) {
    throw new SUTConfigurationError(
      "invalid_local_target",
      "SUT_DB_HOST",
      "Внешний PostgreSQL target запрещён для educational SUT",
    );
  }

  const database = readRequired(
    source,
    "SUT_DB_NAME",
    DEFAULTS.database,
  );
  if (database !== DEFAULTS.database) {
    throw new SUTConfigurationError(
      "invalid_local_target",
      "SUT_DB_NAME",
      "Разрешена только локальная educational database",
    );
  }

  const roleDefaults = ROLE_DEFAULTS[role];
  const rolePrefix = `SUT_DB_${role.toUpperCase()}`;
  const userKey = `${rolePrefix}_USER`;
  const user = readRequired(source, userKey, roleDefaults.user);

  if (user !== roleDefaults.user) {
    throw new SUTConfigurationError(
      "invalid_role",
      userKey,
      "Database role не соответствует разрешённой Phase 1 роли",
    );
  }

  return Object.freeze({
    mode: "educational",
    host,
    port: readInteger(
      source,
      "SUT_DB_PORT",
      DEFAULTS.port,
      1,
      65_535,
    ),
    database,
    user,
    password: readRequired(
      source,
      `${rolePrefix}_PASSWORD`,
      roleDefaults.password,
    ),
    connectionTimeoutMs: readInteger(
      source,
      "SUT_DB_CONNECTION_TIMEOUT_MS",
      DEFAULTS.connectionTimeoutMs,
      100,
      30_000,
    ),
    statementTimeoutMs: readInteger(
      source,
      "SUT_DB_STATEMENT_TIMEOUT_MS",
      DEFAULTS.statementTimeoutMs,
      100,
      60_000,
    ),
  });
}

export function toPoolConfig(config: DatabaseConfig): PoolConfig {
  return {
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    password: config.password,
    connectionTimeoutMillis: config.connectionTimeoutMs,
    statement_timeout: config.statementTimeoutMs,
    application_name: `educational-sut-phase1-${config.user}`,
    max: 4,
  };
}
