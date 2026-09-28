/**
 * Каноническая модель: одна форма, к которой приводятся представления слоёв.
 *
 * Она существует ради сравнения между слоями и ничем больше не является:
 * это не транспортная модель и не модель приложения.
 */
export type CanonicalWorkItem = Readonly<{
  id: string;
  title: string;
  status: string;
  priority: string;
  version: number;
  /** Момент создания всегда в ISO 8601: слои отдают его по-разному. */
  createdAt: string;
}>;

export class NormalizationError extends Error {
  constructor(source: string, field: string, received: unknown) {
    super(
      `Слой ${source}: поле ${field} не удалось привести к канонической форме. ` +
        `Получено: ${JSON.stringify(received)}`,
    );
    this.name = "NormalizationError";
  }
}

function requireString(source: string, field: string, value: unknown): string {
  if (typeof value !== "string" || value === "") {
    throw new NormalizationError(source, field, value);
  }

  return value;
}

function requireNumber(source: string, field: string, value: unknown): number {
  const numeric = typeof value === "string" ? Number(value) : value;

  if (typeof numeric !== "number" || !Number.isFinite(numeric)) {
    throw new NormalizationError(source, field, value);
  }

  return numeric;
}

/**
 * Время приводится к строке ISO.
 *
 * REST и gRPC отдают строку, драйвер PostgreSQL — объект `Date`. Сравнивать
 * их напрямую нельзя: `'2026-09-27T20:06:33.317Z'` не равно `Date`, и
 * сообщение об ошибке этого не объяснит.
 */
function requireInstant(source: string, field: string, value: unknown): string {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new NormalizationError(source, field, value);
    }

    return value.toISOString();
  }

  if (typeof value === "string") {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
      throw new NormalizationError(source, field, value);
    }

    return parsed.toISOString();
  }

  throw new NormalizationError(source, field, value);
}

type RestShape = Readonly<{
  id: string;
  title: string;
  status: string;
  priority: string;
  version: number;
}>;

export function fromRest(
  item: RestShape,
  createdAt: unknown,
): CanonicalWorkItem {
  return Object.freeze({
    id: requireString("REST", "id", item.id),
    title: requireString("REST", "title", item.title),
    status: requireString("REST", "status", item.status),
    priority: requireString("REST", "priority", item.priority),
    version: requireNumber("REST", "version", item.version),
    createdAt: requireInstant("REST", "createdAt", createdAt),
  });
}

export function fromGrpc(raw: unknown): CanonicalWorkItem {
  const item = (raw ?? {}) as Record<string, unknown>;

  return Object.freeze({
    id: requireString("gRPC", "id", item["id"]),
    title: requireString("gRPC", "title", item["title"]),
    status: requireString("gRPC", "status", item["status"]),
    priority: requireString("gRPC", "priority", item["priority"]),
    version: requireNumber("gRPC", "version", item["version"]),
    createdAt: requireInstant("gRPC", "createdAt", item["createdAt"]),
  });
}

export function fromRow(raw: unknown): CanonicalWorkItem {
  const row = (raw ?? {}) as Record<string, unknown>;

  return Object.freeze({
    id: requireString("база", "id", row["id"]),
    title: requireString("база", "title", row["title"]),
    status: requireString("база", "status", row["status"]),
    priority: requireString("база", "priority", row["priority"]),
    version: requireNumber("база", "version", row["version"]),
    createdAt: requireInstant("база", "created_at", row["created_at"]),
  });
}
