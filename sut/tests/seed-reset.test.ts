import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";

import { loadDatabaseConfig } from "../src/config/index.js";
import { resetEducationalDatabase } from "../src/database/reset-runner.js";
import {
  applySeed,
  TESTER_USER_ID,
  VIEWER_USER_ID,
} from "../src/database/seed-runner.js";
import { withRoleClient } from "./support/database.js";

const migrationConfig = loadDatabaseConfig("migration");

test("повторный seed остаётся idempotent и deterministic", async () => {
  const first = await applySeed(migrationConfig);
  await withRoleClient("migration", (client) =>
    client.query(
      `UPDATE users
          SET password_hash = $2,
              is_active = false
        WHERE id = $1`,
      [TESTER_USER_ID, "x".repeat(32)],
    ),
  );
  const second = await applySeed(migrationConfig);

  assert.deepEqual(first, second);
  assert.equal(second.requiredUsers, 2);

  await withRoleClient("reader", async (client) => {
    const rows = await client.query(
      `SELECT id, login, role, is_seed, created_at
         FROM users
        WHERE id = ANY($1::uuid[])
        ORDER BY id`,
      [[TESTER_USER_ID, VIEWER_USER_ID]],
    );

    assert.deepEqual(
      rows.rows.map((row) => ({
        id: row.id,
        login: row.login,
        role: row.role,
        isSeed: row.is_seed,
        createdAt: row.created_at.toISOString(),
      })),
      [
        {
          id: TESTER_USER_ID,
          login: "educational_tester",
          role: "tester",
          isSeed: true,
          createdAt: "2026-01-01T00:00:00.000Z",
        },
        {
          id: VIEWER_USER_ID,
          login: "educational_viewer",
          role: "viewer",
          isSeed: true,
          createdAt: "2026-01-01T00:00:00.000Z",
        },
      ],
    );
  });

  await withRoleClient("migration", async (client) => {
    const restored = await client.query<{
      password_hash: string;
      is_active: boolean;
    }>(
      "SELECT password_hash, is_active FROM users WHERE id = $1",
      [TESTER_USER_ID],
    );
    assert.deepEqual(restored.rows[0], {
      password_hash:
        "phase1-placeholder-hash-tester-00000000000000000000000000000001",
      is_active: true,
    });
  });
});

test("reset удаляет только non-seed data и повторяется безопасно", async () => {
  const workItemId = randomUUID();
  const testRunId = randomUUID();

  await withRoleClient("application", async (client) => {
    await client.query(
      `INSERT INTO work_items (
         id, title, description, status, priority, owner_id, created_by,
         test_run_id, creator_test_id
       )
       VALUES ($1, $2, $3, 'NEW', 'LOW', $4, $4, $5, $6)`,
      [
        workItemId,
        "Временная запись",
        "Эта запись принадлежит Phase 1 test",
        TESTER_USER_ID,
        testRunId,
        "reset-test",
      ],
    );
  });

  const first = await resetEducationalDatabase(migrationConfig);
  const second = await resetEducationalDatabase(migrationConfig);

  assert.equal(first.removedWorkItems, 1);
  assert.equal(second.removedWorkItems, 0);

  await withRoleClient("reader", async (client) => {
    const workItems = await client.query(
      "SELECT id FROM work_items WHERE id = $1",
      [workItemId],
    );
    const seedUsers = await client.query<{ count: string }>(
      "SELECT count(*)::text AS count FROM users WHERE is_seed",
    );

    assert.equal(workItems.rowCount, 0);
    assert.equal(seedUsers.rows[0]?.count, "2");
  });
});

test("seed failure откатывает все изменения transaction", async () => {
  const driftedHash = "y".repeat(32);

  await withRoleClient("migration", (client) =>
    client.query(
      `UPDATE users
          SET password_hash = CASE WHEN id = $1 THEN $3 ELSE password_hash END,
              is_seed = CASE WHEN id = $2 THEN false ELSE is_seed END
        WHERE id = ANY($4::uuid[])`,
      [
        TESTER_USER_ID,
        VIEWER_USER_ID,
        driftedHash,
        [TESTER_USER_ID, VIEWER_USER_ID],
      ],
    ),
  );

  try {
    await assert.rejects(applySeed(migrationConfig), /Seed drift detected/);

    await withRoleClient("migration", async (client) => {
      const state = await client.query<{
        id: string;
        password_hash: string;
        is_seed: boolean;
      }>(
        `SELECT id, password_hash, is_seed
           FROM users
          WHERE id = ANY($1::uuid[])
          ORDER BY id`,
        [[TESTER_USER_ID, VIEWER_USER_ID]],
      );

      assert.equal(state.rows[0]?.password_hash, driftedHash);
      assert.equal(state.rows[1]?.is_seed, false);
    });
  } finally {
    await withRoleClient("migration", (client) =>
      client.query(
        "UPDATE users SET is_seed = true WHERE id = $1",
        [VIEWER_USER_ID],
      ),
    );
    await applySeed(migrationConfig);
  }
});

test("application role не может удалить seed Work Item", async () => {
  const seedWorkItemId = randomUUID();

  await withRoleClient("migration", async (client) => {
    await client.query(
      `INSERT INTO work_items (
         id, title, description, status, priority, owner_id, created_by,
         is_seed
       )
       VALUES ($1, $2, $3, 'NEW', 'LOW', $4, $4, true)`,
      [
        seedWorkItemId,
        "Seed probe",
        "Проверка защиты seed row",
        TESTER_USER_ID,
      ],
    );
  });

  try {
    await assert.rejects(
      withRoleClient("application", (client) =>
        client.query("DELETE FROM work_items WHERE id = $1", [seedWorkItemId]),
      ),
      /seed work item is immutable/,
    );
  } finally {
    await withRoleClient("migration", (client) =>
      client.query("DELETE FROM work_items WHERE id = $1", [seedWorkItemId]),
    );
  }
});

test("reset failure откатывает все удаления", async () => {
  const userId = randomUUID();
  const regularWorkItemId = randomUUID();
  const blockingSeedWorkItemId = randomUUID();

  await withRoleClient("migration", async (client) => {
    await client.query(
      `INSERT INTO users (
         id, login, password_salt, password_hash, role, is_seed
       )
       VALUES ($1, $2, $3, $4, 'tester', false)`,
      [
        userId,
        `reset_rollback_${userId.replaceAll("-", "")}`,
        "0123456789abcdef",
        "x".repeat(32),
      ],
    );
    await client.query(
      `INSERT INTO work_items (
         id, title, description, status, priority, owner_id, created_by,
         is_seed
       )
       VALUES
         ($1, 'Regular probe', 'Must survive rollback', 'NEW', 'LOW', $3, $3, false),
         ($2, 'Blocking seed probe', 'Forces user delete failure', 'NEW', 'LOW', $3, $3, true)`,
      [regularWorkItemId, blockingSeedWorkItemId, userId],
    );
  });

  try {
    await assert.rejects(
      resetEducationalDatabase(migrationConfig),
      /foreign key constraint/,
    );

    await withRoleClient("migration", async (client) => {
      const rows = await client.query<{ id: string }>(
        "SELECT id FROM work_items WHERE id = ANY($1::uuid[]) ORDER BY id",
        [[regularWorkItemId, blockingSeedWorkItemId]],
      );
      assert.equal(rows.rowCount, 2);
    });
  } finally {
    await withRoleClient("migration", async (client) => {
      await client.query(
        "DELETE FROM work_items WHERE id = ANY($1::uuid[])",
        [[regularWorkItemId, blockingSeedWorkItemId]],
      );
      await client.query("DELETE FROM users WHERE id = $1", [userId]);
    });
  }
});
