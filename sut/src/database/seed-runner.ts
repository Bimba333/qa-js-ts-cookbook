import type { PoolClient } from "pg";

import type { DatabaseConfig } from "../config/index.js";
import { hashPasswordWithSalt } from "../auth/password.js";
import { withDatabaseClient } from "./pool.js";
import {
  DISABLED_USER_ID,
  SECOND_TESTER_USER_ID,
  SEED_USERS,
  SEED_WORK_ITEM_COUNT,
  SEED_WORK_ITEMS,
  TESTER_USER_ID,
  VIEWER_USER_ID,
  type SeedUser,
  type SeedWorkItem,
} from "./seed-data.js";

export {
  DISABLED_USER_ID,
  SECOND_TESTER_USER_ID,
  SEED_USERS,
  SEED_WORK_ITEM_COUNT,
  SEED_WORK_ITEMS,
  TESTER_USER_ID,
  VIEWER_USER_ID,
};

const SEED_USER_CREATED_AT = "2026-01-01T00:00:00.000Z";

export type SeedResult = Readonly<{
  seedUsers: number;
  seedWorkItems: number;
}>;

type PreparedUser = SeedUser & Readonly<{ passwordHash: string }>;

/**
 * Hash считается из детерминированной соли, поэтому seed воспроизводим, а в
 * репозитории не лежит заранее посчитанный credential material.
 */
async function prepareUsers(): Promise<readonly PreparedUser[]> {
  return Promise.all(
    SEED_USERS.map(async (user) => {
      const record = await hashPasswordWithSalt(
        user.password,
        user.passwordSalt,
      );

      return Object.freeze({ ...user, passwordHash: record.hash });
    }),
  );
}

async function upsertUsers(
  client: PoolClient,
  users: readonly PreparedUser[],
): Promise<void> {
  await client.query(
    `INSERT INTO users (
       id, login, password_salt, password_hash, role, is_active, is_seed, created_at
     )
     SELECT
       source.id,
       source.login,
       source.password_salt,
       source.password_hash,
       source.role,
       source.is_active,
       true,
       $7::timestamptz
     FROM unnest(
       $1::uuid[], $2::text[], $3::text[], $4::text[], $5::text[], $6::boolean[]
     ) AS source(id, login, password_salt, password_hash, role, is_active)
     ON CONFLICT (id) DO UPDATE
     SET
       login = EXCLUDED.login,
       password_salt = EXCLUDED.password_salt,
       password_hash = EXCLUDED.password_hash,
       role = EXCLUDED.role,
       is_active = EXCLUDED.is_active,
       is_seed = true,
       created_at = EXCLUDED.created_at
     WHERE users.is_seed = true`,
    [
      users.map((user) => user.id),
      users.map((user) => user.login),
      users.map((user) => user.passwordSalt),
      users.map((user) => user.passwordHash),
      users.map((user) => user.role),
      users.map((user) => user.isActive),
      SEED_USER_CREATED_AT,
    ],
  );
}

function workItemColumns(items: readonly SeedWorkItem[]): unknown[] {
  return [
    items.map((item) => item.id),
    items.map((item) => item.title),
    items.map((item) => item.description),
    items.map((item) => item.status),
    items.map((item) => item.priority),
    items.map((item) => item.ownerId),
    items.map((item) => item.createdBy),
    items.map((item) => item.createdAt),
    items.map((item) => item.updatedAt),
    items.map((item) => item.version),
  ];
}

async function upsertWorkItems(
  client: PoolClient,
  items: readonly SeedWorkItem[],
): Promise<void> {
  await client.query(
    `INSERT INTO work_items (
       id, title, description, status, priority, owner_id, created_by,
       is_seed, created_at, updated_at, version
     )
     SELECT
       source.id,
       source.title,
       source.description,
       source.status,
       source.priority,
       source.owner_id,
       source.created_by,
       true,
       source.created_at,
       source.updated_at,
       source.version
     FROM unnest(
       $1::uuid[], $2::text[], $3::text[], $4::text[], $5::text[],
       $6::uuid[], $7::uuid[], $8::timestamptz[], $9::timestamptz[], $10::integer[]
     ) AS source(
       id, title, description, status, priority, owner_id, created_by,
       created_at, updated_at, version
     )
     ON CONFLICT (id) DO UPDATE
     SET
       title = EXCLUDED.title,
       description = EXCLUDED.description,
       status = EXCLUDED.status,
       priority = EXCLUDED.priority,
       updated_at = EXCLUDED.updated_at,
       version = EXCLUDED.version
     WHERE work_items.is_seed = true`,
    workItemColumns(items),
  );
}

export type SeedVerificationOptions = Readonly<{
  /**
   * Credential material читает только migration role. Verification role не
   * имеет column-level доступа к соли и hash, поэтому readiness проверяет
   * seed без них.
   */
  includeCredentials: boolean;
  expectedUsers?: readonly PreparedUser[];
}>;

/**
 * Проверяет, что в базе лежит ровно ожидаемый seed. Совпадение считается
 * соединением с ожидаемыми значениями, поэтому расхождение в любой строке
 * уменьшает счётчик и делает seed BLOCKED.
 */
export async function verifySeedRows(
  client: PoolClient,
  options: SeedVerificationOptions = { includeCredentials: true },
): Promise<SeedResult> {
  const expectedUsers =
    options.expectedUsers ??
    (options.includeCredentials ? await prepareUsers() : SEED_USERS.map(
      (user) => Object.freeze({ ...user, passwordHash: "" }),
    ));

  const credentialPredicate = options.includeCredentials
    ? `AND users.password_salt = expected.password_salt
       AND users.password_hash = expected.password_hash`
    : "";

  const userState = await client.query<{ matched: number; total: number }>(
    `SELECT
       count(*) FILTER (
         WHERE users.login = expected.login
           AND users.role = expected.role
           AND users.is_active = expected.is_active
           AND users.created_at = $7::timestamptz
           ${credentialPredicate}
       )::int AS matched,
       (SELECT count(*) FROM users WHERE is_seed)::int AS total
     FROM unnest(
       $1::uuid[], $2::text[], $3::text[], $4::text[], $5::text[], $6::boolean[]
     ) AS expected(id, login, password_salt, password_hash, role, is_active)
     JOIN users ON users.id = expected.id AND users.is_seed`,
    [
      expectedUsers.map((user) => user.id),
      expectedUsers.map((user) => user.login),
      expectedUsers.map((user) => user.passwordSalt),
      expectedUsers.map((user) => user.passwordHash),
      expectedUsers.map((user) => user.role),
      expectedUsers.map((user) => user.isActive),
      SEED_USER_CREATED_AT,
    ],
  );

  const matchedUsers = userState.rows[0]?.matched ?? 0;
  const totalSeedUsers = userState.rows[0]?.total ?? 0;

  if (
    matchedUsers !== expectedUsers.length ||
    totalSeedUsers !== expectedUsers.length
  ) {
    throw new Error("Seed drift detected in users");
  }

  const columns = workItemColumns(SEED_WORK_ITEMS);
  const workItemState = await client.query<{ matched: number; total: number }>(
    `SELECT
       count(*) FILTER (
         WHERE work_items.title = expected.title
           AND work_items.description = expected.description
           AND work_items.status = expected.status
           AND work_items.priority = expected.priority
           AND work_items.owner_id = expected.owner_id
           AND work_items.created_by = expected.created_by
           AND work_items.created_at = expected.created_at
           AND work_items.updated_at = expected.updated_at
           AND work_items.version = expected.version
           AND work_items.test_run_id IS NULL
           AND work_items.creator_test_id IS NULL
       )::int AS matched,
       (SELECT count(*) FROM work_items WHERE is_seed)::int AS total
     FROM unnest(
       $1::uuid[], $2::text[], $3::text[], $4::text[], $5::text[],
       $6::uuid[], $7::uuid[], $8::timestamptz[], $9::timestamptz[], $10::integer[]
     ) AS expected(
       id, title, description, status, priority, owner_id, created_by,
       created_at, updated_at, version
     )
     JOIN work_items ON work_items.id = expected.id AND work_items.is_seed`,
    columns,
  );

  const matchedWorkItems = workItemState.rows[0]?.matched ?? 0;
  const totalSeedWorkItems = workItemState.rows[0]?.total ?? 0;

  if (
    matchedWorkItems !== SEED_WORK_ITEM_COUNT ||
    totalSeedWorkItems !== SEED_WORK_ITEM_COUNT
  ) {
    throw new Error("Seed drift detected in work items");
  }

  return Object.freeze({
    seedUsers: totalSeedUsers,
    seedWorkItems: totalSeedWorkItems,
  });
}

export async function applySeedWithClient(
  client: PoolClient,
): Promise<SeedResult> {
  const users = await prepareUsers();

  await upsertUsers(client, users);
  await upsertWorkItems(client, SEED_WORK_ITEMS);

  return verifySeedRows(client, {
    includeCredentials: true,
    expectedUsers: users,
  });
}

export async function applySeed(
  config: DatabaseConfig,
): Promise<SeedResult> {
  return withDatabaseClient(config, async (client) => {
    await client.query("BEGIN");
    try {
      const result = await applySeedWithClient(client);
      await client.query("COMMIT");

      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }
  });
}
