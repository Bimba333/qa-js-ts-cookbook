import { expect, test } from "@playwright/test";
import { startLocalApi } from "../support/local-api.js";

test("разделяет HTTP-контракт и бизнес-результат", async ({ request }) => {
  const api = await startLocalApi();
  try {
    const response = await request.post(`${api.baseURL}/tasks`, {
      data: { title: "Критический отчёт", completed: false },
    });
    expect(response.status(), "ресурс должен быть создан").toBe(201);
    const body: unknown = await response.json();
    if (
      typeof body !== "object"
      || body === null
      || !("id" in body)
      || typeof body.id !== "string"
      || !("title" in body)
      || typeof body.title !== "string"
      || !("completed" in body)
      || typeof body.completed !== "boolean"
    ) {
      throw new Error("Ответ создания не соответствует обязательной форме");
    }

    expect(response.headers().location).toBe(`/tasks/${body.id}`);
    expect(body.title, "API должен сохранить название без изменения").toBe("Критический отчёт");
    expect(body.completed).toBe(false);

    const stored = await request.get(`${api.baseURL}/tasks/${body.id}`);
    expect(stored.status()).toBe(200);
    expect(await stored.json()).toMatchObject({
      id: body.id,
      title: "Критический отчёт",
      completed: false,
    });
  } finally {
    await api.close();
  }
});
