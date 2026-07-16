import { expect, test } from "@playwright/test";
import { pollUntil } from "../support/postgresql/poll-until.js";
import { withIsolatedClient } from "../support/postgresql/postgresql-test-db.js";

test("ожидает конкретную строку через ограниченный polling", async () => {
  await withIsolatedClient(async ({ client }) => {
    await expect(pollUntil({
      read: async () => "ready",
      isReady: (value) => value === "ready",
      deadlineMs: 100,
      intervalMs: 10,
      describeLastValue: String,
    })).resolves.toBe("ready");

    await expect(pollUntil({
      read: async () => undefined,
      isReady: () => false,
      deadlineMs: 30,
      intervalMs: 10,
      describeLastValue: (value) => JSON.stringify(value ?? null),
    })).rejects.toThrow("Last value: null");

    await expect(pollUntil({
      read: async () => undefined,
      isReady: () => false,
      deadlineMs: 100,
      intervalMs: 0,
      describeLastValue: String,
    })).rejects.toThrow("intervalMs must be a positive finite number");

    await expect(pollUntil({
      read: async () => {
        throw new Error("connection unavailable");
      },
      isReady: () => false,
      deadlineMs: 100,
      intervalMs: 10,
      describeLastValue: String,
    })).rejects.toThrow("connection unavailable");

    let producerTimer: ReturnType<typeof setTimeout> | undefined;
    const producer = new Promise<void>((resolve, reject) => {
      producerTimer = setTimeout(() => {
        client.query(
          "INSERT INTO tasks (id, title, priority) VALUES ($1, $2, $3)",
          ["task-213", "Eventually stored", "low"],
        ).then(() => resolve(), reject);
      }, 40);
    });
    const producerOutcome = producer.then(
      () => ({ ok: true } as const),
      (error: unknown) => ({ ok: false, error } as const),
    );

    try {
      const row = await pollUntil({
        read: async () => {
          const result = await client.query<{ id: string; title: string }>(
            "SELECT id, title FROM tasks WHERE id = $1",
            ["task-213"],
          );
          return result.rows[0];
        },
        isReady: (value) => value?.title === "Eventually stored",
        deadlineMs: 1_000,
        intervalMs: 20,
        describeLastValue: (value) => JSON.stringify(value ?? null),
      });

      const outcome = await producerOutcome;
      if (!outcome.ok) {
        throw outcome.error;
      }
      expect(row).toEqual({ id: "task-213", title: "Eventually stored" });
    } finally {
      if (producerTimer !== undefined) {
        clearTimeout(producerTimer);
      }
      await producerOutcome;
    }
  });
});
