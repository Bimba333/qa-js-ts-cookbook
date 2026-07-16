import { expect, test } from "@playwright/test";

type OwnerState =
  | { kind: "missing" }
  | { kind: "null" }
  | { kind: "value"; value: string };

interface CanonicalTask {
  id: string;
  hours: number;
  dueAt: string;
  status: "open" | "closed";
  owner: OwnerState;
}

interface ApiTask {
  task_id: unknown;
  estimated_hours: unknown;
  due_at: unknown;
  status: unknown;
  owner?: unknown;
}

interface DatabaseTaskRow {
  task_id: unknown;
  estimated_hours: unknown;
  due_at: unknown;
  status_code: unknown;
  owner?: unknown;
}

function normalizeId(value: unknown): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error("task_id должен быть непустой строкой");
  }
  return value;
}

function normalizeHours(value: unknown): number {
  if (
    (typeof value !== "string" && typeof value !== "number")
    || (typeof value === "string" && value.trim() === "")
  ) {
    throw new Error("estimated_hours должен быть конечным числом");
  }
  const hours = Number(value);
  if (!Number.isFinite(hours)) {
    throw new Error("estimated_hours должен быть конечным числом");
  }
  return hours;
}

function normalizeDueAt(value: unknown): string {
  if (typeof value !== "string" && !(value instanceof Date)) {
    throw new Error("due_at должен содержать дату");
  }
  const dueAt = new Date(value);
  if (Number.isNaN(dueAt.getTime())) {
    throw new Error("due_at содержит некорректную дату");
  }
  return dueAt.toISOString();
}

function normalizeOwner(source: { owner?: unknown }): OwnerState {
  if (!Object.prototype.hasOwnProperty.call(source, "owner")) {
    return { kind: "missing" };
  }
  if (source.owner === null) {
    return { kind: "null" };
  }
  if (typeof source.owner === "string") {
    return { kind: "value", value: source.owner };
  }
  throw new Error("owner должен быть строкой или null");
}

function normalizeApiTask(source: ApiTask): CanonicalTask {
  if (source.status !== "OPEN" && source.status !== "CLOSED") {
    throw new Error("API status должен иметь значение OPEN или CLOSED");
  }
  return {
    id: normalizeId(source.task_id),
    hours: normalizeHours(source.estimated_hours),
    dueAt: normalizeDueAt(source.due_at),
    status: source.status === "OPEN" ? "open" : "closed",
    owner: normalizeOwner(source),
  };
}

function normalizeDatabaseTask(source: DatabaseTaskRow): CanonicalTask {
  if (source.status_code !== "O" && source.status_code !== "C") {
    throw new Error("Database status_code должен иметь значение O или C");
  }
  return {
    id: normalizeId(source.task_id),
    hours: normalizeHours(source.estimated_hours),
    dueAt: normalizeDueAt(source.due_at),
    status: source.status_code === "O" ? "open" : "closed",
    owner: normalizeOwner(source),
  };
}

test("сравнивает слои через canonical model", async () => {
  const apiTask = normalizeApiTask({
    task_id: "task-224",
    estimated_hours: 2.5,
    due_at: "2026-07-16T09:00:00.000Z",
    status: "OPEN",
    owner: null,
  });
  const databaseTask = normalizeDatabaseTask({
    task_id: "task-224",
    estimated_hours: "2.50",
    due_at: new Date("2026-07-16T09:00:00.000Z"),
    status_code: "O",
    owner: null,
  });

  expect(databaseTask).toEqual(apiTask);

  const missingOwner = normalizeApiTask({
    task_id: "task-224",
    estimated_hours: 2.5,
    due_at: "2026-07-16T09:00:00.000Z",
    status: "OPEN",
  });
  expect(missingOwner.owner).toEqual({ kind: "missing" });
  expect(missingOwner.owner).not.toEqual(apiTask.owner);

  const emptyOwner = normalizeApiTask({
    task_id: "task-224",
    estimated_hours: 2.5,
    due_at: "2026-07-16T09:00:00.000Z",
    status: "OPEN",
    owner: "",
  });
  expect(emptyOwner.owner).toEqual({ kind: "value", value: "" });
  expect(emptyOwner.owner).not.toEqual(missingOwner.owner);
  expect(emptyOwner.owner).not.toEqual(apiTask.owner);

  expect(() => normalizeApiTask({
    task_id: "task-224",
    estimated_hours: "not-a-number",
    due_at: "2026-07-16T09:00:00.000Z",
    status: "OPEN",
  })).toThrow("estimated_hours должен быть конечным числом");
  expect(() => normalizeApiTask({
    task_id: "task-224",
    estimated_hours: "   ",
    due_at: "2026-07-16T09:00:00.000Z",
    status: "OPEN",
  })).toThrow("estimated_hours должен быть конечным числом");
  expect(() => normalizeDatabaseTask({
    task_id: "task-224",
    estimated_hours: "2.50",
    due_at: "not-a-date",
    status_code: "O",
  })).toThrow("due_at содержит некорректную дату");
  expect(() => normalizeApiTask({
    task_id: "task-224",
    estimated_hours: 2.5,
    due_at: "2026-07-16T09:00:00.000Z",
    status: "IN_PROGRESS",
  })).toThrow("API status должен иметь значение OPEN или CLOSED");
  expect(() => normalizeDatabaseTask({
    task_id: "task-224",
    estimated_hours: "2.50",
    due_at: "2026-07-16T09:00:00.000Z",
    status_code: "UNKNOWN",
  })).toThrow("Database status_code должен иметь значение O или C");
});
