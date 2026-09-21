import { DomainError, validationError } from "./errors.js";

export type WorkItemStatus = "NEW" | "IN_PROGRESS" | "DONE" | "CANCELLED";
export type WorkItemPriority = "LOW" | "MEDIUM" | "HIGH";

export const WORK_ITEM_STATUSES: readonly WorkItemStatus[] = Object.freeze([
  "NEW",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
]);

export const WORK_ITEM_PRIORITIES: readonly WorkItemPriority[] = Object.freeze([
  "LOW",
  "MEDIUM",
  "HIGH",
]);

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

export const TITLE_MIN_LENGTH = 1;
export const TITLE_MAX_LENGTH = 120;
export const DESCRIPTION_MIN_LENGTH = 1;
export const DESCRIPTION_MAX_LENGTH = 2_000;

const CREATOR_TEST_ID = /^[A-Za-z0-9._:-]{1,160}$/;
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Допустимые переходы. Терминальные состояния не переходят никуда, поэтому у
 * них пустой список, а не отсутствие ключа: отсутствие ключа скрывало бы
 * ошибку в данных за тем же сообщением.
 */
const ALLOWED_TRANSITIONS: Readonly<
  Record<WorkItemStatus, readonly WorkItemStatus[]>
> = Object.freeze({
  NEW: Object.freeze(["IN_PROGRESS", "CANCELLED"] as const),
  IN_PROGRESS: Object.freeze(["DONE", "CANCELLED"] as const),
  DONE: Object.freeze([] as const),
  CANCELLED: Object.freeze([] as const),
});

/** Длина считается в Unicode code points, а не в UTF-16 code units. */
function codePointLength(value: string): number {
  return [...value].length;
}

export function normalizeText(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw validationError(field, `Поле ${field} должно быть строкой`);
  }

  return value.normalize("NFC").trim();
}

export function validateTitle(value: unknown): string {
  const title = normalizeText(value, "title");
  const length = codePointLength(title);

  if (length < TITLE_MIN_LENGTH || length > TITLE_MAX_LENGTH) {
    throw validationError(
      "title",
      `Поле title должно содержать от ${TITLE_MIN_LENGTH} до ${TITLE_MAX_LENGTH} символов`,
    );
  }

  return title;
}

export function validateDescription(value: unknown): string {
  const description = normalizeText(value, "description");
  const length = codePointLength(description);

  if (
    length < DESCRIPTION_MIN_LENGTH ||
    length > DESCRIPTION_MAX_LENGTH
  ) {
    throw validationError(
      "description",
      `Поле description должно содержать от ${DESCRIPTION_MIN_LENGTH} до ${DESCRIPTION_MAX_LENGTH} символов`,
    );
  }

  return description;
}

export function validatePriority(value: unknown): WorkItemPriority {
  if (
    typeof value !== "string" ||
    !WORK_ITEM_PRIORITIES.includes(value as WorkItemPriority)
  ) {
    throw validationError(
      "priority",
      `Поле priority должно быть одним из: ${WORK_ITEM_PRIORITIES.join(", ")}`,
    );
  }

  return value as WorkItemPriority;
}

export function validateStatus(value: unknown, field = "status"): WorkItemStatus {
  if (
    typeof value !== "string" ||
    !WORK_ITEM_STATUSES.includes(value as WorkItemStatus)
  ) {
    throw validationError(
      field,
      `Поле ${field} должно быть одним из: ${WORK_ITEM_STATUSES.join(", ")}`,
    );
  }

  return value as WorkItemStatus;
}

export function validateIdentifier(value: unknown, field = "id"): string {
  if (typeof value !== "string" || !UUID.test(value)) {
    throw validationError(field, `Поле ${field} должно быть UUID`);
  }

  return value.toLowerCase();
}

export function validateCreatorTestId(value: unknown): string {
  if (typeof value !== "string" || !CREATOR_TEST_ID.test(value)) {
    throw validationError(
      "creatorTestId",
      "Идентификатор теста должен содержать от 1 до 160 символов [A-Za-z0-9._:-]",
    );
  }

  return value;
}

export function validateExpectedVersion(value: unknown): number {
  const numeric = typeof value === "string" && /^\d+$/.test(value)
    ? Number(value)
    : value;

  if (
    typeof numeric !== "number" ||
    !Number.isSafeInteger(numeric) ||
    numeric < 1
  ) {
    throw validationError(
      "expectedVersion",
      "Поле expectedVersion должно быть целым числом больше нуля",
    );
  }

  return numeric;
}

export function canTransition(
  from: WorkItemStatus,
  to: WorkItemStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

/**
 * Проверяет переход до обращения к базе. Недопустимый переход не изменяет
 * строку и возвращает отдельный код, отличный от конфликта версий.
 */
export function assertTransitionAllowed(
  from: WorkItemStatus,
  to: WorkItemStatus,
): void {
  if (from === to) {
    throw new DomainError(
      "INVALID_TRANSITION",
      `Work Item уже находится в статусе ${to}`,
      "status",
    );
  }

  if (!canTransition(from, to)) {
    throw new DomainError(
      "INVALID_TRANSITION",
      `Переход из ${from} в ${to} не разрешён`,
      "status",
    );
  }
}

export function allowedTransitionsFrom(
  status: WorkItemStatus,
): readonly WorkItemStatus[] {
  return ALLOWED_TRANSITIONS[status];
}
