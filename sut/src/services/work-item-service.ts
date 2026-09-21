import { randomUUID } from "node:crypto";

import type { PoolClient } from "pg";

import type { Database } from "../database/database.js";
import { DomainError, validationError } from "../domain/errors.js";
import {
  assertTransitionAllowed,
  validateCreatorTestId,
  validateDescription,
  validateExpectedVersion,
  validateIdentifier,
  validatePriority,
  validateStatus,
  validateTitle,
  type WorkItem,
} from "../domain/work-item.js";
import { recordAuditEvent } from "../repositories/audit-repository.js";
import type { Principal } from "../repositories/auth-repository.js";
import {
  countWorkItems,
  deleteWorkItemById,
  deleteWorkItemsByTestRun,
  findWorkItemById,
  insertWorkItem,
  searchWorkItems,
  updateWorkItemWithVersion,
  type StoredWorkItem,
} from "../repositories/work-item-repository.js";

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export type CreateWorkItemInput = Readonly<{
  title: unknown;
  description: unknown;
  priority: unknown;
}>;

export type UpdateWorkItemInput = Readonly<{
  title?: unknown;
  description?: unknown;
  priority?: unknown;
  status?: unknown;
  expectedVersion: unknown;
}>;

export type SearchInput = Readonly<{
  status?: unknown;
  priority?: unknown;
  ownerId?: unknown;
  limit?: unknown;
  offset?: unknown;
}>;

export type SearchResult = Readonly<{
  items: readonly WorkItem[];
  total: number;
  limit: number;
  offset: number;
}>;

/** Публичный контракт не раскрывает служебный признак seed. */
function toPublic(item: StoredWorkItem): WorkItem {
  return Object.freeze({
    id: item.id,
    title: item.title,
    description: item.description,
    status: item.status,
    priority: item.priority,
    ownerId: item.ownerId,
    createdBy: item.createdBy,
    testRunId: item.testRunId,
    creatorTestId: item.creatorTestId,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    version: item.version,
  });
}

function parseBoundedInteger(
  value: unknown,
  field: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const numeric =
    typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;

  if (
    typeof numeric !== "number" ||
    !Number.isSafeInteger(numeric) ||
    numeric < minimum ||
    numeric > maximum
  ) {
    throw validationError(
      field,
      `Поле ${field} должно быть целым числом от ${minimum} до ${maximum}`,
    );
  }

  return numeric;
}

export class WorkItemService {
  readonly #database: Database;

  constructor(database: Database) {
    this.#database = database;
  }

  /**
   * Мутации разрешены только роли tester и только над собственной записью,
   * созданной в текущем запуске. Seed остаётся неизменным для всех.
   */
  #assertCanMutate(principal: Principal, item: StoredWorkItem): void {
    if (item.isSeed) {
      throw new DomainError(
        "SEED_IMMUTABLE",
        "Seed-запись доступна только для чтения",
      );
    }

    if (item.ownerId !== principal.userId) {
      throw new DomainError(
        "PERMISSION_DENIED",
        "Изменять можно только собственные записи",
      );
    }
  }

  #assertCanWrite(principal: Principal): void {
    if (principal.role !== "tester") {
      throw new DomainError(
        "PERMISSION_DENIED",
        "Роль viewer не может изменять данные",
      );
    }
  }

  async #loadReadable(
    client: PoolClient,
    principal: Principal,
    id: string,
  ): Promise<StoredWorkItem> {
    const item = await findWorkItemById(client, id);

    if (!item) {
      throw new DomainError("NOT_FOUND", "Work Item не найден");
    }

    if (!item.isSeed && item.ownerId !== principal.userId) {
      throw new DomainError(
        "PERMISSION_DENIED",
        "Запись принадлежит другому пользователю",
      );
    }

    return item;
  }

  async create(
    principal: Principal,
    input: CreateWorkItemInput,
    creatorTestId: unknown,
    correlationId: string,
  ): Promise<WorkItem> {
    this.#assertCanWrite(principal);

    const title = validateTitle(input.title);
    const description = validateDescription(input.description);
    const priority = validatePriority(input.priority);
    const testId = validateCreatorTestId(creatorTestId);

    return this.#database.withTransaction(async (client) => {
      const created = await insertWorkItem(client, {
        id: randomUUID(),
        title,
        description,
        priority,
        // Владелец и автор выводятся из аутентифицированного принципала:
        // клиент не может назначить запись другому пользователю.
        ownerId: principal.userId,
        createdBy: principal.userId,
        testRunId: principal.testRunId,
        creatorTestId: testId,
      });

      await recordAuditEvent(client, {
        event: "work_item.created",
        correlationId,
        testRunId: principal.testRunId,
        principalId: principal.userId,
        detail: { workItemId: created.id, creatorTestId: testId },
      });

      return toPublic(created);
    });
  }

  async getById(principal: Principal, rawId: unknown): Promise<WorkItem> {
    const id = validateIdentifier(rawId);

    return this.#database.withClient(async (client) =>
      toPublic(await this.#loadReadable(client, principal, id)),
    );
  }

  async search(
    principal: Principal,
    input: SearchInput,
  ): Promise<SearchResult> {
    const status =
      input.status === undefined || input.status === null || input.status === ""
        ? undefined
        : validateStatus(input.status);
    const priority =
      input.priority === undefined ||
      input.priority === null ||
      input.priority === ""
        ? undefined
        : validatePriority(input.priority);
    const ownerId =
      input.ownerId === undefined ||
      input.ownerId === null ||
      input.ownerId === ""
        ? undefined
        : validateIdentifier(input.ownerId, "ownerId");
    const limit = parseBoundedInteger(
      input.limit,
      "limit",
      DEFAULT_PAGE_SIZE,
      1,
      MAX_PAGE_SIZE,
    );
    const offset = parseBoundedInteger(
      input.offset,
      "offset",
      0,
      0,
      1_000_000,
    );

    return this.#database.withClient(async (client) => {
      const items = await searchWorkItems(client, principal.userId, {
        status,
        priority,
        ownerId,
        limit,
        offset,
      });
      const total = await countWorkItems(client, principal.userId, {
        status,
        priority,
        ownerId,
      });

      return Object.freeze({
        items: Object.freeze(items.map(toPublic)),
        total,
        limit,
        offset,
      });
    });
  }

  /**
   * Частичное обновление с обязательной ожидаемой версией.
   *
   * Гонку закрывает сам UPDATE: он меняет строку только при совпадении
   * версии. Любое изменение повышает версию, поэтому параллельный запрос с
   * той же ожидаемой версией получит конфликт, а не затрёт чужое изменение.
   */
  async update(
    principal: Principal,
    rawId: unknown,
    input: UpdateWorkItemInput,
    correlationId: string,
  ): Promise<WorkItem> {
    this.#assertCanWrite(principal);

    const id = validateIdentifier(rawId);
    const expectedVersion = validateExpectedVersion(input.expectedVersion);

    const title =
      input.title === undefined ? undefined : validateTitle(input.title);
    const description =
      input.description === undefined
        ? undefined
        : validateDescription(input.description);
    const priority =
      input.priority === undefined
        ? undefined
        : validatePriority(input.priority);
    const status =
      input.status === undefined ? undefined : validateStatus(input.status);

    if (
      title === undefined &&
      description === undefined &&
      priority === undefined &&
      status === undefined
    ) {
      throw validationError(
        "body",
        "Запрос должен изменять хотя бы одно поле",
      );
    }

    return this.#database.withTransaction(async (client) => {
      const current = await findWorkItemById(client, id);

      if (!current) {
        throw new DomainError("NOT_FOUND", "Work Item не найден");
      }

      this.#assertCanMutate(principal, current);

      if (status !== undefined) {
        assertTransitionAllowed(current.status, status);
      }

      if (current.version !== expectedVersion) {
        await recordAuditEvent(client, {
          event: "work_item.version_conflict",
          correlationId,
          testRunId: principal.testRunId,
          principalId: principal.userId,
          detail: {
            workItemId: id,
            expectedVersion,
            actualVersion: current.version,
          },
        });

        throw new DomainError(
          "VERSION_CONFLICT",
          `Ожидалась версия ${expectedVersion}, актуальная версия ${current.version}`,
          "expectedVersion",
        );
      }

      const updated = await updateWorkItemWithVersion(
        client,
        id,
        expectedVersion,
        { title, description, priority, status },
      );

      if (!updated) {
        throw new DomainError(
          "VERSION_CONFLICT",
          "Версия записи изменилась во время обновления",
          "expectedVersion",
        );
      }

      await recordAuditEvent(client, {
        event: "work_item.updated",
        correlationId,
        testRunId: principal.testRunId,
        principalId: principal.userId,
        detail: { workItemId: id, version: updated.version },
      });

      return toPublic(updated);
    });
  }

  async transition(
    principal: Principal,
    rawId: unknown,
    rawStatus: unknown,
    rawExpectedVersion: unknown,
    correlationId: string,
  ): Promise<WorkItem> {
    return this.update(
      principal,
      rawId,
      {
        status: validateStatus(rawStatus, "targetStatus"),
        expectedVersion: rawExpectedVersion,
      },
      correlationId,
    );
  }

  async delete(
    principal: Principal,
    rawId: unknown,
    correlationId: string,
  ): Promise<void> {
    this.#assertCanWrite(principal);

    const id = validateIdentifier(rawId);

    await this.#database.withTransaction(async (client) => {
      const current = await findWorkItemById(client, id);

      if (!current) {
        throw new DomainError("NOT_FOUND", "Work Item не найден");
      }

      this.#assertCanMutate(principal, current);
      await deleteWorkItemById(client, id);
      await recordAuditEvent(client, {
        event: "work_item.deleted",
        correlationId,
        testRunId: principal.testRunId,
        principalId: principal.userId,
        detail: { workItemId: id },
      });
    });
  }

  /**
   * Удаляет данные текущего запуска. Run выводится из аутентификации, поэтому
   * запросить чужой набор невозможно: параметра для него просто нет.
   */
  async cleanupCurrentRun(
    principal: Principal,
    correlationId: string,
  ): Promise<number> {
    this.#assertCanWrite(principal);

    return this.#database.withTransaction(async (client) => {
      const deleted = await deleteWorkItemsByTestRun(
        client,
        principal.testRunId,
      );

      await recordAuditEvent(client, {
        event: "test_run.cleaned",
        correlationId,
        testRunId: principal.testRunId,
        principalId: principal.userId,
        detail: { deletedCount: deleted },
      });

      return deleted;
    });
  }
}
