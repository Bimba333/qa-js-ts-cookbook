import { findWorkItemRow, withReaderClient } from "../support/sut/database.js";
import { expect, test } from "../support/sut/fixtures.js";
import { pollUntil } from "../support/sut/poll-until.js";

test("ожидает конкретную строку через ограниченный polling", async ({
  workItems,
}) => {
  await withReaderClient(async (client) => {
    const created = await workItems.createOrThrow({
      title: "Eventually stored",
      description: "Ожидание конкретного факта",
      priority: "LOW",
    });

    // Ожидание описывает нужное состояние, а не длительность паузы.
    // Граница времени задана, поэтому тест не зависает навсегда.
    const row = await pollUntil({
      read: () => findWorkItemRow(client, created.id),
      isReady: (value) => value?.title === "Eventually stored",
      deadlineMs: 5_000,
      intervalMs: 50,
      describeLastValue: (value) => JSON.stringify(value ?? null),
    });

    expect(row?.id).toBe(created.id);
  });
});

test("падает с понятным сообщением, когда состояние не наступило", async () => {
  await withReaderClient(async (client) => {
    // Запись отсутствует, поэтому ожидание завершится по истечении срока.
    await expect(
      pollUntil({
        read: () =>
          findWorkItemRow(client, "00000000-0000-4000-8000-000000000000"),
        isReady: (value) => value !== undefined,
        deadlineMs: 200,
        intervalMs: 20,
        describeLastValue: (value) => JSON.stringify(value ?? null),
      }),
      // Сообщение содержит последнее увиденное значение: без него отчёт
      // говорил бы только о факте таймаута, но не о причине.
    ).rejects.toThrow("Last value: null");
  });
});

test("не маскирует ошибку чтения ожиданием", async () => {
  await withReaderClient(async (client) => {
    await expect(
      pollUntil({
        read: () => client.query("SELECT * FROM missing_table"),
        isReady: () => false,
        deadlineMs: 500,
        intervalMs: 20,
        describeLastValue: String,
      }),
    ).rejects.toThrow(/missing_table/);
  });
});
