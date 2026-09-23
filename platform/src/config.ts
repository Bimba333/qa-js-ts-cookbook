/** Настройки сервиса прогресса. Значения по умолчанию рассчитаны на локальный запуск. */
export type PlatformConfig = Readonly<{
  httpHost: string;
  httpPort: number;
  databaseUrl: string;
  sessionDays: number;
  allowedOrigins: readonly string[];
}>;

function readNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;

  const value = Number(raw);

  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${name} должен быть целым числом больше нуля`);
  }

  return value;
}

export function loadConfig(): PlatformConfig {
  const databaseUrl = process.env.PLATFORM_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("PLATFORM_DATABASE_URL не задан");
  }

  const origins = (process.env.PLATFORM_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  return Object.freeze({
    httpHost: process.env.PLATFORM_HTTP_HOST ?? "127.0.0.1",
    httpPort: readNumber("PLATFORM_HTTP_PORT", 4320),
    databaseUrl,
    sessionDays: readNumber("PLATFORM_SESSION_DAYS", 30),
    // Книга — статический сайт на другом адресе, поэтому браузеру нужен CORS.
    allowedOrigins: Object.freeze(origins.length > 0 ? origins : ["*"]),
  });
}
