import { randomUUID } from "node:crypto";

import pg from "pg";

import { sutConfig } from "./config.js";
import type { WorkItemPriority, WorkItemStatus } from "./types.js";

export type WorkItemRow = Readonly<{
  id: string;
  title: string;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  owner_id: string;
  test_run_id: string | null;
  creator_test_id: string | null;
  is_seed: boolean;
  version: number;
  created_at: Date;
  updated_at: Date;
}>;

/**
 * Открывает read-only подключение к базе стенда.
 *
 * Тест проверяет состояние, но не изменяет его в обход публичных границ:
 * роль `sut_reader` физически не имеет прав на запись, поэтому ошибка в тесте
 * не сможет незаметно подменить данные.
 */
export async function withReaderClient<T>(
  operation: (client: pg.Client) => Promise<T>,
): Promise<T> {
  const client = new pg.Client({
    ...sutConfig().database,
    application_name: "qa-book-examples",
  });

  await client.connect();
  try {
    return await operation(client);
  } finally {
    await client.end();
  }
}

export async function findWorkItemRow(
  client: pg.Client,
  id: string,
): Promise<WorkItemRow | undefined> {
  const result = await client.query<WorkItemRow>(
    `SELECT id, title, status, priority, owner_id, test_run_id,
            creator_test_id, is_seed, version, created_at, updated_at
       FROM work_items
      WHERE id = $1`,
    [id],
  );

  return result.rows[0];
}

export async function countWorkItemsByRun(
  client: pg.Client,
  testRunId: string,
): Promise<number> {
  const result = await client.query<{ total: string }>(
    "SELECT count(*)::text AS total FROM work_items WHERE test_run_id = $1",
    [testRunId],
  );

  return Number(result.rows[0]?.total ?? 0);
}

/**
 * Уникальное имя объекта в песочнице.
 *
 * Параллельные тесты работают в одной схеме, поэтому изоляция достигается
 * уникальностью имён: пересечься двум запускам нечем.
 */
export function sandboxName(prefix: string): string {
  if (!/^[a-z][a-z0-9_]{0,20}$/.test(prefix)) {
    throw new Error("Недопустимый префикс объекта песочницы");
  }

  return `sandbox.${prefix}_${randomUUID().replaceAll("-", "")}`;
}

/**
 * Открывает подключение к учебной песочнице.
 *
 * В схеме `sandbox` verification role может создавать собственные таблицы.
 * Доменные таблицы SUT при этом остаются доступны только для чтения.
 */
export async function withSandboxClient<T>(
  operation: (client: pg.Client) => Promise<T>,
): Promise<T> {
  return withReaderClient(operation);
}

export async function findAuditEvents(
  client: pg.Client,
  testRunId: string,
): Promise<readonly string[]> {
  const result = await client.query<{ event: string }>(
    `SELECT event
       FROM audit_events
      WHERE test_run_id = $1
      ORDER BY occurred_at, id`,
    [testRunId],
  );

  return result.rows.map((row) => row.event);
}
