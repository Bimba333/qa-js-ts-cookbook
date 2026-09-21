import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";

import { TESTER_USER_ID } from "../src/database/seed-runner.js";
import {
  inRollbackTransaction,
  withRoleClient,
} from "./support/database.js";

type WorkItemOverrides = Readonly<
  Partial<{
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    ownerId: string;
    createdBy: string;
    testRunId: string | null;
    creatorTestId: string | null;
    version: number;
  }>
>;

async function insertWorkItem(
  client: Parameters<Parameters<typeof inRollbackTransaction>[0]>[0],
  overrides: WorkItemOverrides = {},
): Promise<void> {
  const testRunId =
    overrides.testRunId === undefined ? randomUUID() : overrides.testRunId;

  // Миграция 004 связала work_items с test_runs, поэтому run должен
  // существовать до вставки записи.
  if (testRunId !== null) {
    await client.query(
      `INSERT INTO test_runs (id, principal_id, source)
       VALUES ($1, $2, 'rest')
       ON CONFLICT (id) DO NOTHING`,
      [testRunId, overrides.ownerId ?? TESTER_USER_ID],
    );
  }

  await client.query(
    `INSERT INTO work_items (
       id, title, description, status, priority, owner_id, created_by,
       test_run_id, creator_test_id, version
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [
      overrides.id ?? randomUUID(),
      overrides.title ?? "Проверить итоговый отчёт",
      overrides.description ?? "Детерминированная Phase 1 запись",
      overrides.status ?? "NEW",
      overrides.priority ?? "MEDIUM",
      overrides.ownerId ?? TESTER_USER_ID,
      overrides.createdBy ?? TESTER_USER_ID,
      testRunId,
      overrides.creatorTestId === undefined
        ? "schema-test"
        : overrides.creatorTestId,
      overrides.version ?? 1,
    ],
  );
}

test("принимает корректный Work Item и хранит UTC timestamps", async () => {
  await inRollbackTransaction(async (client) => {
    const id = randomUUID();
    await insertWorkItem(client, { id });

    const result = await client.query<{
      created_at: Date;
      updated_at: Date;
    }>(
      "SELECT created_at, updated_at FROM work_items WHERE id = $1",
      [id],
    );

    assert.ok(result.rows[0]?.created_at instanceof Date);
    assert.ok(result.rows[0]?.updated_at instanceof Date);
    assert.match(result.rows[0]!.created_at.toISOString(), /Z$/);
  });
});

test("применяет status, priority и version constraints", async () => {
  for (const overrides of [
    { status: "UNKNOWN" },
    { priority: "URGENT" },
    { version: 0 },
  ] satisfies WorkItemOverrides[]) {
    await assert.rejects(
      inRollbackTransaction((client) => insertWorkItem(client, overrides)),
    );
  }
});

test("применяет границы title и description", async () => {
  for (const overrides of [
    { title: " " },
    { title: "x".repeat(121) },
    { description: " " },
    { description: "x".repeat(2001) },
  ] satisfies WorkItemOverrides[]) {
    await assert.rejects(
      inRollbackTransaction((client) => insertWorkItem(client, overrides)),
    );
  }
});

test("требует парные test run и creator test identifiers", async () => {
  await assert.rejects(
    inRollbackTransaction((client) =>
      insertWorkItem(client, {
        testRunId: null,
        creatorTestId: "orphan-test-id",
      }),
    ),
  );
  await assert.rejects(
    inRollbackTransaction((client) =>
      insertWorkItem(client, {
        testRunId: randomUUID(),
        creatorTestId: null,
      }),
    ),
  );
  await assert.rejects(
    inRollbackTransaction((client) =>
      insertWorkItem(client, {
        creatorTestId: "x".repeat(161),
      }),
    ),
  );
});

test("применяет owner и creator foreign keys", async () => {
  await assert.rejects(
    inRollbackTransaction((client) =>
      insertWorkItem(client, { ownerId: randomUUID() }),
    ),
  );
  await assert.rejects(
    inRollbackTransaction((client) =>
      insertWorkItem(client, { createdBy: randomUUID() }),
    ),
  );
});

test("ограничивает роли пользователей", async () => {
  await assert.rejects(
    inRollbackTransaction((client) =>
      client.query(
        `INSERT INTO users (
           id, login, password_salt, password_hash, role, is_seed
         )
         VALUES ($1, $2, $3, $4, $5, false)`,
        [
          randomUUID(),
          "invalid_role_user",
          "0123456789abcdef",
          "x".repeat(32),
          "admin",
        ],
      ),
    ),
  );
});

test("создаёт обязательные indexes", async () => {
  await withRoleClient("reader", async (client) => {
    const result = await client.query<{ indexname: string }>(
      `SELECT indexname
         FROM pg_indexes
        WHERE schemaname = 'public'
          AND tablename = 'work_items'`,
    );
    const names = new Set(result.rows.map((row) => row.indexname));

    for (const expected of [
      "work_items_test_run_id_idx",
      "work_items_creator_test_id_idx",
      "work_items_owner_id_idx",
      "work_items_status_priority_idx",
    ]) {
      assert.equal(names.has(expected), true);
    }
    assert.equal(names.has("work_items_status_idx"), false);
  });
});
