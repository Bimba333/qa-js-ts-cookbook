import type pg from "pg";

import { withReaderClient } from "../support/sut/database.js";
import { expect, test } from "../support/sut/fixtures.js";
import type { WorkItemStatus } from "../support/sut/types.js";

export type StoredWorkItem = Readonly<{
  id: string;
  title: string;
  status: WorkItemStatus;
  version: number;
  createdAt: string;
}>;

/**
 * Слой доступа к базе выражает вопросы сценария, а не устройство схемы.
 *
 * Тест спрашивает «какая запись с таким идентификатором» и «сколько записей
 * у запуска», а не собирает SQL и не разбирает имена колонок.
 */
class WorkItemsReadRepository {
  constructor(private readonly client: pg.Client) {}

  async findById(id: string): Promise<StoredWorkItem | undefined> {
    const result = await this.client.query<{
      id: string;
      title: string;
      status: WorkItemStatus;
      version: number;
      created_at: Date;
    }>(
      `SELECT id, title, status, version, created_at
         FROM work_items
        WHERE id = $1`,
      [id],
    );
    const row = result.rows[0];

    // Наружу отдаётся модель сценария: snake_case и Date остаются
    // деталями хранения.
    return row === undefined
      ? undefined
      : {
          id: row.id,
          title: row.title,
          status: row.status,
          version: row.version,
          createdAt: row.created_at.toISOString(),
        };
  }

  async countByRun(testRunId: string): Promise<number> {
    const result = await this.client.query<{ total: string }>(
      "SELECT count(*)::text AS total FROM work_items WHERE test_run_id = $1",
      [testRunId],
    );

    return Number(result.rows[0]?.total ?? 0);
  }
}

test("выражает операцию базы данных через узкий публичный API", async ({
  workItems,
  testerToken,
}) => {
  const created = await workItems.createOrThrow({
    title: "Repository boundary",
    description: "Слой доступа скрывает схему",
    priority: "HIGH",
  });

  await withReaderClient(async (client) => {
    const repository = new WorkItemsReadRepository(client);

    const stored = await repository.findById(created.id);
    expect(stored).toMatchObject({
      id: created.id,
      title: "Repository boundary",
      status: "NEW",
      version: 1,
    });
    expect(stored?.createdAt).toMatch(/Z$/);

    expect(await repository.countByRun(testerToken.testRunId)).toBe(1);
    expect(await repository.findById(
      "00000000-0000-4000-8000-000000000000",
    )).toBeUndefined();
  });
});
