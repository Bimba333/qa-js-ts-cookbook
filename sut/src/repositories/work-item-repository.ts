import type { PoolClient } from "pg";

import type {
  WorkItem,
  WorkItemPriority,
  WorkItemStatus,
} from "../domain/work-item.js";

type WorkItemRow = Readonly<{
  id: string;
  title: string;
  description: string;
  status: WorkItemStatus;
  priority: WorkItemPriority;
  owner_id: string;
  created_by: string;
  test_run_id: string | null;
  creator_test_id: string | null;
  is_seed: boolean;
  created_at: Date;
  updated_at: Date;
  version: number;
}>;

export type StoredWorkItem = WorkItem & Readonly<{ isSeed: boolean }>;

export type WorkItemFilters = Readonly<{
  status?: WorkItemStatus;
  priority?: WorkItemPriority;
  ownerId?: string;
  limit: number;
  offset: number;
}>;

export type NewWorkItem = Readonly<{
  id: string;
  title: string;
  description: string;
  priority: WorkItemPriority;
  ownerId: string;
  createdBy: string;
  testRunId: string;
  creatorTestId: string;
}>;

export type WorkItemChanges = Readonly<{
  title?: string;
  description?: string;
  priority?: WorkItemPriority;
  status?: WorkItemStatus;
}>;

const SELECTED_COLUMNS = `
  id, title, description, status, priority, owner_id, created_by,
  test_run_id, creator_test_id, is_seed, created_at, updated_at, version
`;

function toWorkItem(row: WorkItemRow): StoredWorkItem {
  return Object.freeze({
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    ownerId: row.owner_id,
    createdBy: row.created_by,
    testRunId: row.test_run_id,
    creatorTestId: row.creator_test_id,
    isSeed: row.is_seed,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    version: row.version,
  });
}

export async function findWorkItemById(
  client: PoolClient,
  id: string,
): Promise<StoredWorkItem | null> {
  const result = await client.query<WorkItemRow>(
    `SELECT ${SELECTED_COLUMNS} FROM work_items WHERE id = $1`,
    [id],
  );
  const row = result.rows[0];

  return row ? toWorkItem(row) : null;
}

/**
 * Возвращает записи, доступные принципалу: seed-данные общие, а созданное
 * тестами видит только владелец. Порядок детерминирован, поэтому пагинация
 * устойчива между запросами.
 */
export async function searchWorkItems(
  client: PoolClient,
  principalId: string,
  filters: WorkItemFilters,
): Promise<readonly StoredWorkItem[]> {
  const result = await client.query<WorkItemRow>(
    `SELECT ${SELECTED_COLUMNS}
       FROM work_items
      WHERE (is_seed OR owner_id = $1)
        AND ($2::text IS NULL OR status = $2)
        AND ($3::text IS NULL OR priority = $3)
        AND ($4::uuid IS NULL OR owner_id = $4)
      ORDER BY created_at ASC, id ASC
      LIMIT $5 OFFSET $6`,
    [
      principalId,
      filters.status ?? null,
      filters.priority ?? null,
      filters.ownerId ?? null,
      filters.limit,
      filters.offset,
    ],
  );

  return Object.freeze(result.rows.map(toWorkItem));
}

export async function countWorkItems(
  client: PoolClient,
  principalId: string,
  filters: Omit<WorkItemFilters, "limit" | "offset">,
): Promise<number> {
  const result = await client.query<{ total: string }>(
    `SELECT count(*)::text AS total
       FROM work_items
      WHERE (is_seed OR owner_id = $1)
        AND ($2::text IS NULL OR status = $2)
        AND ($3::text IS NULL OR priority = $3)
        AND ($4::uuid IS NULL OR owner_id = $4)`,
    [
      principalId,
      filters.status ?? null,
      filters.priority ?? null,
      filters.ownerId ?? null,
    ],
  );

  return Number(result.rows[0]?.total ?? 0);
}

export async function insertWorkItem(
  client: PoolClient,
  item: NewWorkItem,
): Promise<StoredWorkItem> {
  const result = await client.query<WorkItemRow>(
    `INSERT INTO work_items (
       id, title, description, status, priority, owner_id, created_by,
       test_run_id, creator_test_id
     )
     VALUES ($1, $2, $3, 'NEW', $4, $5, $6, $7, $8)
     RETURNING ${SELECTED_COLUMNS}`,
    [
      item.id,
      item.title,
      item.description,
      item.priority,
      item.ownerId,
      item.createdBy,
      item.testRunId,
      item.creatorTestId,
    ],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error("Insert did not return a Work Item row");
  }

  return toWorkItem(row);
}

/**
 * Условное обновление: строка меняется только если её версия всё ещё та,
 * которую видел клиент. Возврат `null` означает конфликт версий, а не
 * отсутствие записи — вызывающий код уже проверил существование.
 */
export async function updateWorkItemWithVersion(
  client: PoolClient,
  id: string,
  expectedVersion: number,
  changes: WorkItemChanges,
): Promise<StoredWorkItem | null> {
  const result = await client.query<WorkItemRow>(
    `UPDATE work_items
        SET title = COALESCE($3, title),
            description = COALESCE($4, description),
            priority = COALESCE($5, priority),
            status = COALESCE($6, status),
            updated_at = CURRENT_TIMESTAMP,
            version = version + 1
      WHERE id = $1
        AND version = $2
      RETURNING ${SELECTED_COLUMNS}`,
    [
      id,
      expectedVersion,
      changes.title ?? null,
      changes.description ?? null,
      changes.priority ?? null,
      changes.status ?? null,
    ],
  );

  const row = result.rows[0];

  return row ? toWorkItem(row) : null;
}

export async function deleteWorkItemById(
  client: PoolClient,
  id: string,
): Promise<boolean> {
  const result = await client.query(
    "DELETE FROM work_items WHERE id = $1 AND is_seed = false",
    [id],
  );

  return (result.rowCount ?? 0) > 0;
}

/**
 * Удаляет данные ровно одного test run. Seed защищён и условием, и триггером
 * базы: вычистить чужой или общий набор этим путём нельзя.
 */
export async function deleteWorkItemsByTestRun(
  client: PoolClient,
  testRunId: string,
): Promise<number> {
  const result = await client.query(
    "DELETE FROM work_items WHERE test_run_id = $1 AND is_seed = false",
    [testRunId],
  );

  return result.rowCount ?? 0;
}
