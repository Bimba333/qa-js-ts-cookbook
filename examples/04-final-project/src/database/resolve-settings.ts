import type { DatabaseSettings } from "./types.js";

/**
 * Конфигурация проекта хранит **ссылку** на секрет, а не сам секрет.
 *
 * Разрешение ссылки в настоящие настройки — отдельная граница: в локальном
 * профиле она читает окружение, в промышленном её место занял бы менеджер
 * секретов. Слой доступа к базе об этом различии не знает.
 */
export class SecretResolutionError extends Error {
  constructor(reference: string, reason: string) {
    super(`Не удалось разрешить ссылку на секрет ${reference}: ${reason}`);
    this.name = "SecretResolutionError";
  }
}

const LOCAL_REFERENCE = "secret://local/postgres";

export function resolveDatabaseSettings(
  reference: string,
  env: Readonly<Record<string, string | undefined>> = process.env,
): DatabaseSettings {
  if (reference !== LOCAL_REFERENCE) {
    throw new SecretResolutionError(
      reference,
      "в учебном проекте поддерживается только локальная ссылка",
    );
  }

  const port = Number(env["QA_DB_PORT"] ?? "55432");

  if (!Number.isInteger(port) || port <= 0) {
    throw new SecretResolutionError(reference, "QA_DB_PORT должен быть целым числом больше нуля");
  }

  return Object.freeze({
    host: env["QA_DB_HOST"] ?? "127.0.0.1",
    port,
    database: env["QA_DB_NAME"] ?? "educational_work_items",
    // Роль только для чтения: ошибка в тесте физически не сможет изменить
    // состояние стенда в обход публичных границ.
    user: env["QA_DB_USER"] ?? "sut_reader",
    password: env["QA_DB_PASSWORD"] ?? "educational_reader_only",
  });
}
