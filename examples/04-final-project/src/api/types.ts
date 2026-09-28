/** Контракты REST-слоя: то, что проект обещает своим сценариям. */
export const workItemStatuses = [
  "NEW",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
] as const;

export const workItemPriorities = ["LOW", "MEDIUM", "HIGH"] as const;

export type WorkItemStatus = (typeof workItemStatuses)[number];
export type WorkItemPriority = (typeof workItemPriorities)[number];

export type WorkItem = Readonly<{
  id: string;
  title: string;
  description: string | null;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  version: number;
  /** Строка ISO 8601: сравнение времени между слоями требует общей формы. */
  createdAt: string;
}>;

/**
 * Все три поля обязательны: стенд отклоняет создание без описания и
 * приоритета. Необязательными их сделал бы тип, а не контракт, и ошибка
 * всплыла бы во время выполнения.
 */
export type CreateWorkItemInput = Readonly<{
  title: string;
  description: string;
  priority: WorkItemPriority;
}>;

export type SearchQuery = Readonly<{
  status?: WorkItemStatus;
  priority?: WorkItemPriority;
  limit?: number;
  offset?: number;
}>;

export type SearchResult = Readonly<{
  items: readonly WorkItem[];
  total: number;
}>;

/**
 * Отказ сервиса — обычный результат, а не исключение.
 *
 * Негативный сценарий обязан увидеть код и тело ответа, поэтому клиент не
 * превращает 4xx в ошибку: он возвращает разобранный отказ.
 */
export type ApiFailure = Readonly<{
  status: number;
  code: string;
  message: string;
  correlationId: string | null;
}>;

export type ApiResult<Value> =
  | Readonly<{ ok: true; value: Value }>
  | Readonly<{ ok: false; failure: ApiFailure }>;
