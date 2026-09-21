import type { PoolClient } from "pg";

import type { UserRole } from "./user-repository.js";

export type AuthSource = "rest" | "ui";

export type Principal = Readonly<{
  userId: string;
  login: string;
  role: UserRole;
  testRunId: string;
  source: AuthSource;
}>;

type PrincipalRow = Readonly<{
  user_id: string;
  login: string;
  role: UserRole;
  is_active: boolean;
  test_run_id: string;
}>;

export async function createTestRun(
  client: PoolClient,
  id: string,
  principalId: string,
  source: AuthSource,
): Promise<void> {
  await client.query(
    "INSERT INTO test_runs (id, principal_id, source) VALUES ($1, $2, $3)",
    [id, principalId, source],
  );
}

export async function insertAuthToken(
  client: PoolClient,
  tokenHash: string,
  userId: string,
  testRunId: string,
  expiresAt: Date,
): Promise<void> {
  await client.query(
    `INSERT INTO auth_tokens (token_hash, user_id, test_run_id, expires_at)
     VALUES ($1, $2, $3, $4)`,
    [tokenHash, userId, testRunId, expiresAt.toISOString()],
  );
}

/**
 * Разрешает bearer token в принципала.
 *
 * Истёкший token и отключённый пользователь дают тот же результат, что и
 * отсутствующий: транспорт вернёт обычный отказ аутентификации.
 */
export async function findPrincipalByTokenHash(
  client: PoolClient,
  tokenHash: string,
): Promise<Principal | null> {
  const result = await client.query<PrincipalRow>(
    `SELECT
       users.id AS user_id,
       users.login,
       users.role,
       users.is_active,
       auth_tokens.test_run_id
     FROM auth_tokens
     JOIN users ON users.id = auth_tokens.user_id
     WHERE auth_tokens.token_hash = $1
       AND auth_tokens.expires_at > CURRENT_TIMESTAMP
       AND users.is_active`,
    [tokenHash],
  );
  const row = result.rows[0];

  return row
    ? Object.freeze({
        userId: row.user_id,
        login: row.login,
        role: row.role,
        testRunId: row.test_run_id,
        source: "rest" as const,
      })
    : null;
}

export async function deleteAuthToken(
  client: PoolClient,
  tokenHash: string,
): Promise<void> {
  await client.query("DELETE FROM auth_tokens WHERE token_hash = $1", [
    tokenHash,
  ]);
}

export async function insertUiSession(
  client: PoolClient,
  sessionHash: string,
  userId: string,
  testRunId: string,
  csrfToken: string,
  expiresAt: Date,
): Promise<void> {
  await client.query(
    `INSERT INTO ui_sessions (
       session_hash, user_id, test_run_id, csrf_token, expires_at
     )
     VALUES ($1, $2, $3, $4, $5)`,
    [sessionHash, userId, testRunId, csrfToken, expiresAt.toISOString()],
  );
}

export type UiSession = Principal & Readonly<{ csrfToken: string }>;

export async function findUiSessionByHash(
  client: PoolClient,
  sessionHash: string,
): Promise<UiSession | null> {
  const result = await client.query<PrincipalRow & { csrf_token: string }>(
    `SELECT
       users.id AS user_id,
       users.login,
       users.role,
       users.is_active,
       ui_sessions.test_run_id,
       ui_sessions.csrf_token
     FROM ui_sessions
     JOIN users ON users.id = ui_sessions.user_id
     WHERE ui_sessions.session_hash = $1
       AND ui_sessions.expires_at > CURRENT_TIMESTAMP
       AND users.is_active`,
    [sessionHash],
  );
  const row = result.rows[0];

  return row
    ? Object.freeze({
        userId: row.user_id,
        login: row.login,
        role: row.role,
        testRunId: row.test_run_id,
        csrfToken: row.csrf_token,
        source: "ui" as const,
      })
    : null;
}

export async function deleteUiSession(
  client: PoolClient,
  sessionHash: string,
): Promise<void> {
  await client.query("DELETE FROM ui_sessions WHERE session_hash = $1", [
    sessionHash,
  ]);
}
