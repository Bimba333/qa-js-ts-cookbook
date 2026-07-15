import { expect, test } from "@playwright/test";
import { startLocalApi } from "../support/local-api.js";

test("различает ресурс и идемпотентную операцию", async ({ request }) => {
  const api = await startLocalApi();
  try {
    const first = await request.put(`${api.baseURL}/tasks/task-fixed`, {
      data: { title: "Проверить отчёт", completed: false },
    });
    const second = await request.put(`${api.baseURL}/tasks/task-fixed`, {
      data: { title: "Проверить отчёт", completed: false },
    });

    expect(first.status()).toBe(200);
    expect(second.status()).toBe(200);
    expect(await second.json()).toEqual({
      id: "task-fixed",
      title: "Проверить отчёт",
      completed: false,
    });
  } finally {
    await api.close();
  }
});
