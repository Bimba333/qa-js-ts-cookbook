import {
  workItemPriorities,
  workItemStatuses,
  type ApiFailure,
  type SearchResult,
  type WorkItem,
} from "./types.js";

/**
 * Проверка формы ответа во время выполнения.
 *
 * Аннотация типа на `response.json()` — обещание, а не доказательство: тело
 * приходит из сети. Проверка нужна ровно здесь, на границе слоя, чтобы
 * дальше по коду тип соответствовал действительности.
 */
export class ContractError extends Error {
  constructor(what: string, received: unknown) {
    super(`Ответ не соответствует контракту: ${what}. Получено: ${describe(received)}`);
    this.name = "ContractError";
  }
}

function describe(value: unknown): string {
  if (value === null) return "null";
  if (typeof value !== "object") return `${typeof value} ${String(value)}`;

  return `object с ключами [${Object.keys(value).join(", ")}]`;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null) {
    throw new ContractError("ожидался объект", value);
  }

  return value as Record<string, unknown>;
}

export function assertWorkItem(value: unknown): WorkItem {
  const item = asRecord(value);

  if (typeof item["id"] !== "string" || item["id"] === "") {
    throw new ContractError("поле id должно быть непустой строкой", value);
  }

  if (typeof item["title"] !== "string") {
    throw new ContractError("поле title должно быть строкой", value);
  }

  const description = item["description"];

  if (description !== null && typeof description !== "string") {
    throw new ContractError("поле description должно быть строкой или null", value);
  }

  const status = item["status"];

  if (!workItemStatuses.includes(status as WorkItem["status"])) {
    throw new ContractError(
      `поле status должно быть одним из [${workItemStatuses.join(", ")}]`,
      value,
    );
  }

  const priority = item["priority"];

  if (!workItemPriorities.includes(priority as WorkItem["priority"])) {
    throw new ContractError(
      `поле priority должно быть одним из [${workItemPriorities.join(", ")}]`,
      value,
    );
  }

  if (typeof item["version"] !== "number" || !Number.isInteger(item["version"])) {
    throw new ContractError("поле version должно быть целым числом", value);
  }

  if (typeof item["createdAt"] !== "string") {
    throw new ContractError("поле createdAt должно быть строкой", value);
  }

  return Object.freeze({
    id: item["id"],
    title: item["title"],
    description: description ?? null,
    status: status as WorkItem["status"],
    priority: priority as WorkItem["priority"],
    version: item["version"],
    createdAt: item["createdAt"],
  });
}

export function assertSearchResult(value: unknown): SearchResult {
  const result = asRecord(value);
  const items = result["items"];

  if (!Array.isArray(items)) {
    throw new ContractError("поле items должно быть массивом", value);
  }

  if (typeof result["total"] !== "number") {
    throw new ContractError("поле total должно быть числом", value);
  }

  return Object.freeze({
    items: Object.freeze(items.map(assertWorkItem)),
    total: result["total"],
  });
}

/** Тело отказа тоже является контрактом, но требования к нему мягче. */
export function readFailure(status: number, value: unknown): ApiFailure {
  const body = typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
  const error = typeof body["error"] === "object" && body["error"] !== null
    ? (body["error"] as Record<string, unknown>)
    : body;

  return Object.freeze({
    status,
    code: typeof error["code"] === "string" ? error["code"] : "UNKNOWN",
    message:
      typeof error["message"] === "string" ? error["message"] : "нет описания",
    correlationId:
      typeof body["correlationId"] === "string" ? body["correlationId"] : null,
  });
}
