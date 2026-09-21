export type WorkItemStatus = "NEW" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type WorkItemPriority = "LOW" | "MEDIUM" | "HIGH";

export type WorkItem = Readonly<{
  id: string;
  title: string;
  description: string;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  ownerId: string;
  createdBy: string;
  testRunId: string | null;
  creatorTestId: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
}>;

export type WorkItemPage = Readonly<{
  items: readonly WorkItem[];
  total: number;
  limit: number;
  offset: number;
}>;

/** Единая форма ошибки стенда. */
export type ApiError = Readonly<{
  code: string;
  message: string;
  field?: string;
  correlationId: string;
}>;

/**
 * Runtime-проверка формы Work Item.
 *
 * Тест не должен доверять внешнему JSON только потому, что тип объявлен в
 * TypeScript: типы исчезают после компиляции, а ответ приходит во время
 * выполнения.
 */
export function isWorkItem(value: unknown): value is WorkItem {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate["id"] === "string" &&
    typeof candidate["title"] === "string" &&
    typeof candidate["description"] === "string" &&
    typeof candidate["status"] === "string" &&
    typeof candidate["priority"] === "string" &&
    typeof candidate["ownerId"] === "string" &&
    typeof candidate["version"] === "number"
  );
}

export function isApiError(value: unknown): value is ApiError {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate["code"] === "string" &&
    typeof candidate["message"] === "string" &&
    typeof candidate["correlationId"] === "string"
  );
}
