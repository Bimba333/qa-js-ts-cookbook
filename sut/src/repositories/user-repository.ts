import type { PoolClient } from "pg";

export type UserRole = "tester" | "viewer";

export type StoredUser = Readonly<{
  id: string;
  login: string;
  role: UserRole;
  isActive: boolean;
}>;

export type UserCredentials = StoredUser &
  Readonly<{
    passwordSalt: string;
    passwordHash: string;
  }>;

type UserRow = Readonly<{
  id: string;
  login: string;
  role: UserRole;
  is_active: boolean;
  password_salt: string;
  password_hash: string;
}>;

/**
 * Читает credential material вместе с профилем.
 *
 * Поиск идёт по неактивным пользователям тоже: решение об отказе принимает
 * сервис аутентификации, чтобы отсутствующий и отключённый пользователь дали
 * одинаковый по времени и по содержанию ответ.
 */
export async function findUserCredentialsByLogin(
  client: PoolClient,
  login: string,
): Promise<UserCredentials | null> {
  const result = await client.query<UserRow>(
    `SELECT id, login, role, is_active, password_salt, password_hash
       FROM users
      WHERE login = $1`,
    [login],
  );
  const row = result.rows[0];

  return row
    ? Object.freeze({
        id: row.id,
        login: row.login,
        role: row.role,
        isActive: row.is_active,
        passwordSalt: row.password_salt,
        passwordHash: row.password_hash,
      })
    : null;
}

export async function findUserById(
  client: PoolClient,
  id: string,
): Promise<StoredUser | null> {
  const result = await client.query<Omit<UserRow, "password_salt" | "password_hash">>(
    "SELECT id, login, role, is_active FROM users WHERE id = $1",
    [id],
  );
  const row = result.rows[0];

  return row
    ? Object.freeze({
        id: row.id,
        login: row.login,
        role: row.role,
        isActive: row.is_active,
      })
    : null;
}
