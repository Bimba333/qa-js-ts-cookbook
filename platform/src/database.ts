import pg from "pg";

import { hashPassword } from "./passwords.js";
import type { ProgressMap } from "./progress.js";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

CREATE TABLE IF NOT EXISTS progress (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  tasks jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
`;

export type User = Readonly<{ id: string; email: string }>;

export class Database {
  readonly #pool: pg.Pool;

  constructor(connectionString: string) {
    this.#pool = new pg.Pool({ connectionString, max: 10 });
  }

  async migrate(): Promise<void> {
    await this.#pool.query(SCHEMA);
  }

  async close(): Promise<void> {
    await this.#pool.end();
  }

  async ready(): Promise<boolean> {
    const result = await this.#pool.query("SELECT 1 AS ok");

    return result.rows.length === 1;
  }

  async createUser(email: string, password: string): Promise<User | null> {
    const passwordHash = await hashPassword(password);

    try {
      const result = await this.#pool.query<{ id: string; email: string }>(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
        [email, passwordHash],
      );

      return result.rows[0] ?? null;
    } catch (error) {
      // Повторная регистрация того же адреса — ожидаемый исход, а не сбой.
      if ((error as { code?: string }).code === "23505") {
        return null;
      }

      throw error;
    }
  }

  async findCredentials(
    email: string,
  ): Promise<Readonly<{ id: string; email: string; passwordHash: string }> | null> {
    const result = await this.#pool.query<{
      id: string;
      email: string;
      password_hash: string;
    }>("SELECT id, email, password_hash FROM users WHERE email = $1", [email]);

    const row = result.rows[0];

    return row ? { id: row.id, email: row.email, passwordHash: row.password_hash } : null;
  }

  async createSession(
    userId: string,
    tokenHash: string,
    days: number,
  ): Promise<void> {
    await this.#pool.query(
      `INSERT INTO sessions (token_hash, user_id, expires_at)
       VALUES ($1, $2, now() + ($3 || ' days')::interval)`,
      [tokenHash, userId, String(days)],
    );
  }

  async findSession(tokenHash: string): Promise<User | null> {
    const result = await this.#pool.query<{ id: string; email: string }>(
      `SELECT users.id, users.email
         FROM sessions
         JOIN users ON users.id = sessions.user_id
        WHERE sessions.token_hash = $1 AND sessions.expires_at > now()`,
      [tokenHash],
    );

    return result.rows[0] ?? null;
  }

  async deleteSession(tokenHash: string): Promise<void> {
    await this.#pool.query("DELETE FROM sessions WHERE token_hash = $1", [tokenHash]);
  }

  async readProgress(userId: string): Promise<Readonly<{ tasks: ProgressMap; updatedAt: string }>> {
    const result = await this.#pool.query<{ tasks: ProgressMap; updated_at: Date }>(
      "SELECT tasks, updated_at FROM progress WHERE user_id = $1",
      [userId],
    );

    const row = result.rows[0];

    return row
      ? { tasks: row.tasks, updatedAt: row.updated_at.toISOString() }
      : { tasks: {}, updatedAt: new Date(0).toISOString() };
  }

  async writeProgress(
    userId: string,
    tasks: ProgressMap,
  ): Promise<Readonly<{ tasks: ProgressMap; updatedAt: string }>> {
    const result = await this.#pool.query<{ tasks: ProgressMap; updated_at: Date }>(
      `INSERT INTO progress (user_id, tasks, updated_at)
       VALUES ($1, $2::jsonb, now())
       ON CONFLICT (user_id) DO UPDATE SET tasks = EXCLUDED.tasks, updated_at = now()
       RETURNING tasks, updated_at`,
      [userId, JSON.stringify(tasks)],
    );

    const row = result.rows[0]!;

    return { tasks: row.tasks, updatedAt: row.updated_at.toISOString() };
  }
}
