import { createHash, randomBytes, randomUUID } from "node:crypto";

import { verifyPassword } from "../auth/password.js";
import type { Database } from "../database/database.js";
import { DomainError } from "../domain/errors.js";
import {
  createTestRun,
  deleteAuthToken,
  deleteUiSession,
  findPrincipalByTokenHash,
  findUiSessionByHash,
  insertAuthToken,
  insertUiSession,
  type Principal,
  type UiSession,
} from "../repositories/auth-repository.js";
import { recordAuditEvent } from "../repositories/audit-repository.js";
import { findUserCredentialsByLogin } from "../repositories/user-repository.js";

export const TOKEN_TTL_MS = 2 * 60 * 60 * 1_000;
export const SESSION_TTL_MS = 2 * 60 * 60 * 1_000;

export type IssuedToken = Readonly<{
  token: string;
  tokenType: "Bearer";
  testRunId: string;
  expiresAt: string;
  principal: Principal;
}>;

export type IssuedSession = Readonly<{
  sessionId: string;
  csrfToken: string;
  testRunId: string;
  expiresAt: string;
  principal: Principal;
}>;

function generateSecret(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * В базе хранится только SHA-256 от секрета. Секрет высокоэнтропийный, поэтому
 * быстрый хеш здесь достаточен — в отличие от пароля, который требует scrypt.
 */
export function hashSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("hex");
}

const AUTHENTICATION_FAILED = new DomainError(
  "UNAUTHENTICATED",
  "Неверный логин или пароль",
);

export class AuthService {
  readonly #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  /**
   * Выдаёт bearer token и вместе с ним новый test run.
   *
   * Run создаёт сервер: клиент не может выбрать чужой идентификатор и тем
   * самым получить доступ к данным другого запуска.
   */
  async issueToken(
    login: unknown,
    password: unknown,
    correlationId: string,
  ): Promise<IssuedToken> {
    if (
      typeof login !== "string" ||
      typeof password !== "string" ||
      login.length === 0 ||
      password.length === 0
    ) {
      throw new DomainError(
        "VALIDATION_FAILED",
        "Поля login и password обязательны",
        typeof login === "string" && login.length > 0 ? "password" : "login",
      );
    }

    return this.#database.withTransaction(async (client) => {
      const user = await findUserCredentialsByLogin(client, login);

      // Проверка пароля выполняется даже для отсутствующего пользователя,
      // чтобы отказ не отличался по времени выполнения.
      const matches = await verifyPassword(password, {
        salt: user?.passwordSalt ?? "0".repeat(32),
        hash: user?.passwordHash ?? "0".repeat(64),
      });

      if (!user || !user.isActive || !matches) {
        await recordAuditEvent(client, {
          event: "auth.token.rejected",
          correlationId,
          principalId: user?.id ?? null,
          detail: { login, reason: user ? "invalid_credentials" : "unknown_user" },
        });

        throw AUTHENTICATION_FAILED;
      }

      const testRunId = randomUUID();
      const token = generateSecret();
      const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

      await createTestRun(client, testRunId, user.id, "rest");
      await insertAuthToken(
        client,
        hashSecret(token),
        user.id,
        testRunId,
        expiresAt,
      );
      await recordAuditEvent(client, {
        event: "auth.token.issued",
        correlationId,
        testRunId,
        principalId: user.id,
        detail: { source: "rest" },
      });

      return Object.freeze({
        token,
        tokenType: "Bearer" as const,
        testRunId,
        expiresAt: expiresAt.toISOString(),
        principal: Object.freeze({
          userId: user.id,
          login: user.login,
          role: user.role,
          testRunId,
          source: "rest" as const,
        }),
      });
    });
  }

  async authenticateBearer(token: string): Promise<Principal> {
    const principal = await this.#database.withClient((client) =>
      findPrincipalByTokenHash(client, hashSecret(token)),
    );

    if (!principal) {
      throw new DomainError("UNAUTHENTICATED", "Токен недействителен или истёк");
    }

    return principal;
  }

  async revokeToken(token: string): Promise<void> {
    await this.#database.withClient((client) =>
      deleteAuthToken(client, hashSecret(token)),
    );
  }

  /**
   * Создаёт UI-сессию. Идентификатор сессии всегда новый, поэтому после входа
   * происходит ротация: перехваченный до логина идентификатор бесполезен.
   */
  async login(
    login: unknown,
    password: unknown,
    correlationId: string,
  ): Promise<IssuedSession> {
    if (
      typeof login !== "string" ||
      typeof password !== "string" ||
      login.length === 0 ||
      password.length === 0
    ) {
      throw new DomainError(
        "VALIDATION_FAILED",
        "Введите логин и пароль",
        typeof login === "string" && login.length > 0 ? "password" : "login",
      );
    }

    return this.#database.withTransaction(async (client) => {
      const user = await findUserCredentialsByLogin(client, login);
      const matches = await verifyPassword(password, {
        salt: user?.passwordSalt ?? "0".repeat(32),
        hash: user?.passwordHash ?? "0".repeat(64),
      });

      if (!user || !user.isActive || !matches) {
        await recordAuditEvent(client, {
          event: "auth.session.rejected",
          correlationId,
          principalId: user?.id ?? null,
          detail: { login, reason: user ? "invalid_credentials" : "unknown_user" },
        });

        throw AUTHENTICATION_FAILED;
      }

      const testRunId = randomUUID();
      const sessionId = generateSecret();
      const csrfToken = generateSecret();
      const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

      await createTestRun(client, testRunId, user.id, "ui");
      await insertUiSession(
        client,
        hashSecret(sessionId),
        user.id,
        testRunId,
        csrfToken,
        expiresAt,
      );
      await recordAuditEvent(client, {
        event: "auth.session.created",
        correlationId,
        testRunId,
        principalId: user.id,
        detail: { source: "ui" },
      });

      return Object.freeze({
        sessionId,
        csrfToken,
        testRunId,
        expiresAt: expiresAt.toISOString(),
        principal: Object.freeze({
          userId: user.id,
          login: user.login,
          role: user.role,
          testRunId,
          source: "ui" as const,
        }),
      });
    });
  }

  async findSession(sessionId: string): Promise<UiSession | null> {
    return this.#database.withClient((client) =>
      findUiSessionByHash(client, hashSecret(sessionId)),
    );
  }

  async logout(sessionId: string): Promise<void> {
    await this.#database.withClient((client) =>
      deleteUiSession(client, hashSecret(sessionId)),
    );
  }
}
