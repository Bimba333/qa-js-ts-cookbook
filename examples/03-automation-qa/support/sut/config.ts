/**
 * Адреса учебного стенда.
 *
 * Значения по умолчанию совпадают с тем, что публикует `npm run sut:up`,
 * поэтому примеры запускаются без настройки окружения. Переопределение через
 * переменные оставлено для CI, где порты могут отличаться.
 */
export type SutConfig = Readonly<{
  baseURL: string;
  apiBaseURL: string;
  grpcTarget: string;
  database: Readonly<{
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  }>;
}>;

const DEFAULTS = Object.freeze({
  baseURL: "http://127.0.0.1:4310",
  grpcTarget: "127.0.0.1:4311",
  databasePort: 55_432,
});

function readString(name: string, fallback: string): string {
  const value = process.env[name];

  return value === undefined || value.trim().length === 0
    ? fallback
    : value.trim();
}

function readPort(name: string, fallback: number): number {
  const raw = readString(name, String(fallback));
  const port = Number(raw);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error(`${name} должен быть портом от 1 до 65535`);
  }

  return port;
}

export function sutConfig(): SutConfig {
  const baseURL = readString("SUT_BASE_URL", DEFAULTS.baseURL);

  return Object.freeze({
    baseURL,
    apiBaseURL: `${baseURL}/api/v1`,
    grpcTarget: readString("SUT_GRPC_TARGET", DEFAULTS.grpcTarget),
    database: Object.freeze({
      host: readString("SUT_DB_HOST", "127.0.0.1"),
      port: readPort("SUT_DB_PORT", DEFAULTS.databasePort),
      database: "educational_work_items",
      // Тесты подключаются только read-only ролью: проверять состояние можно,
      // изменять его в обход публичных границ — нет.
      user: "sut_reader",
      password: readString("SUT_DB_READER_PASSWORD", "educational_reader_only"),
    }),
  });
}

/** Учебные учётные записи стенда. */
export const SUT_USERS = Object.freeze({
  tester: Object.freeze({
    login: "educational_tester",
    password: "educational-tester-password",
  }),
  secondTester: Object.freeze({
    login: "educational_tester_two",
    password: "educational-tester-two-password",
  }),
  viewer: Object.freeze({
    login: "educational_viewer",
    password: "educational-viewer-password",
  }),
  disabled: Object.freeze({
    login: "educational_disabled",
    password: "educational-disabled-password",
  }),
});
