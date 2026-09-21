import { findWorkItemRow, withReaderClient } from "../support/sut/database.js";
import { expect, test } from "../support/sut/fixtures.js";

test("нормализует представления слоёв перед сравнением", async ({
  workItems,
  workItemsGrpc,
}) => {
  const created = await workItems.createOrThrow({
    title: "Cross-layer model",
    description: "Одна запись в трёх представлениях",
    priority: "HIGH",
  });

  const viaGrpc = await workItemsGrpc.getWorkItem(created.id);

  await withReaderClient(async (client) => {
    const row = await findWorkItemRow(client, created.id);
    if (row === undefined) throw new Error("Запись не найдена в базе");

    // Каждый слой отдаёт свою форму: REST — camelCase и строки,
    // gRPC — сообщение с enum, база — snake_case и объекты Date.
    // Сравнивать их можно только после приведения к общей модели.
    const canonical = {
      id: created.id,
      title: "Cross-layer model",
      status: "NEW",
      priority: "HIGH",
      version: 1,
    };

    expect({
      id: created.id,
      title: created.title,
      status: created.status,
      priority: created.priority,
      version: created.version,
    }).toEqual(canonical);

    expect({
      id: viaGrpc.id,
      title: viaGrpc.title,
      status: viaGrpc.status,
      priority: viaGrpc.priority,
      version: viaGrpc.version,
    }).toEqual(canonical);

    expect({
      id: row.id,
      title: row.title,
      status: row.status,
      priority: row.priority,
      version: row.version,
    }).toEqual(canonical);

    // Время приводится к одному формату: база отдаёт Date, транспорт — строку.
    expect(row.created_at.toISOString()).toBe(created.createdAt);
    expect(viaGrpc.createdAt).toBe(created.createdAt);
  });
});
