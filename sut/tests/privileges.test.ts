import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import test from "node:test";

import { TESTER_USER_ID } from "../src/database/seed-runner.js";
import { withRoleClient } from "./support/database.js";

test("read-only role может читать, но не изменять данные", async () => {
  await withRoleClient("reader", async (client) => {
    const result = await client.query("SELECT id FROM users ORDER BY id");
    assert.equal(result.rowCount, 2);

    await assert.rejects(
      client.query(
        `INSERT INTO work_items (
           id, title, description, status, priority, owner_id, created_by
         )
         VALUES ($1, 'Denied', 'Reader cannot write', 'NEW', 'LOW', $2, $2)`,
        [randomUUID(), TESTER_USER_ID],
      ),
      /permission denied/,
    );
    await assert.rejects(
      client.query(
        "UPDATE work_items SET status = 'DONE' WHERE id = $1",
        [randomUUID()],
      ),
      /permission denied/,
    );
    await assert.rejects(
      client.query("DELETE FROM work_items WHERE id = $1", [randomUUID()]),
      /permission denied/,
    );
    await assert.rejects(
      client.query("SELECT password_hash FROM users LIMIT 1"),
      /permission denied/,
    );
  });
});

test("application role имеет CRUD только для Work Items", async () => {
  const id = randomUUID();

  await withRoleClient("application", async (client) => {
    await client.query(
      `INSERT INTO work_items (
         id, title, description, status, priority, owner_id, created_by,
         test_run_id, creator_test_id
       )
       VALUES ($1, 'App role', 'Проверка минимальных прав', 'NEW', 'MEDIUM',
               $2, $2, $3, 'privilege-test')`,
      [id, TESTER_USER_ID, randomUUID()],
    );
    await client.query(
      "UPDATE work_items SET status = 'IN_PROGRESS', version = version + 1 WHERE id = $1",
      [id],
    );
    await client.query("DELETE FROM work_items WHERE id = $1", [id]);

    await assert.rejects(
      client.query(
        "UPDATE users SET is_active = false WHERE id = $1",
        [TESTER_USER_ID],
      ),
      /permission denied/,
    );
    await assert.rejects(
      client.query("SELECT is_seed FROM work_items LIMIT 1"),
      /permission denied/,
    );
    await assert.rejects(
      client.query("SELECT password_salt FROM users LIMIT 1"),
      /permission denied/,
    );
    await assert.rejects(
      client.query("DELETE FROM schema_migrations"),
      /permission denied/,
    );
  });
});

test("application role не может назначать служебный seed marker", async () => {
  await withRoleClient("application", async (client) => {
    await assert.rejects(
      client.query(
        `INSERT INTO work_items (
           id, title, description, status, priority, owner_id, created_by,
           is_seed
         )
         VALUES ($1, 'Denied seed', 'Application cannot create seed data',
                 'NEW', 'LOW', $2, $2, true)`,
        [randomUUID(), TESTER_USER_ID],
      ),
      /permission denied/,
    );
  });
});

test("служебные роли не имеют повышенных PostgreSQL attributes", async () => {
  await withRoleClient("migration", async (client) => {
    const result = await client.query<{
      rolname: string;
      rolsuper: boolean;
      rolcreatedb: boolean;
      rolcreaterole: boolean;
      rolcanlogin: boolean;
    }>(
      `SELECT rolname, rolsuper, rolcreatedb, rolcreaterole, rolcanlogin
         FROM pg_roles
        WHERE rolname = ANY($1::text[])
        ORDER BY rolname`,
      [["sut_app", "sut_cleanup", "sut_migrator", "sut_reader"]],
    );

    assert.equal(result.rowCount, 4);
    for (const role of result.rows) {
      assert.equal(role.rolsuper, false);
      assert.equal(role.rolcreatedb, false);
      assert.equal(role.rolcreaterole, false);
    }
    assert.equal(
      result.rows.find((role) => role.rolname === "sut_cleanup")?.rolcanlogin,
      false,
    );

    const cleanupPrivileges = await client.query<{
      connect: boolean;
      users_select: boolean;
      work_items_delete: boolean;
    }>(
      `SELECT
         has_database_privilege(
           'sut_cleanup',
           'educational_work_items',
           'CONNECT'
         ) AS connect,
         has_table_privilege(
           'sut_cleanup',
           'users',
           'SELECT'
         ) AS users_select,
         has_table_privilege(
           'sut_cleanup',
           'work_items',
           'DELETE'
         ) AS work_items_delete`,
    );
    assert.deepEqual(cleanupPrivileges.rows[0], {
      connect: false,
      users_select: false,
      work_items_delete: false,
    });
  });
});

test("PUBLIC не получает schema create или function execute", async () => {
  await withRoleClient("migration", async (client) => {
    const result = await client.query<{
      schema_create: boolean;
      function_execute: boolean;
      users_select: boolean;
      work_items_delete: boolean;
    }>(
      `SELECT
         has_schema_privilege('public', 'public', 'CREATE') AS schema_create,
         has_function_privilege(
           'public',
           'protect_seed_work_items()',
           'EXECUTE'
         ) AS function_execute,
         has_table_privilege('public', 'users', 'SELECT') AS users_select,
         has_table_privilege(
           'public',
           'work_items',
           'DELETE'
         ) AS work_items_delete`,
    );

    assert.equal(result.rows[0]?.schema_create, false);
    assert.equal(result.rows[0]?.function_execute, false);
    assert.equal(result.rows[0]?.users_select, false);
    assert.equal(result.rows[0]?.work_items_delete, false);
  });
});
