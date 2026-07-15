import { expect, test } from "@playwright/test";
import { startLocalApi } from "../support/local-api.js";

type TaskPayload = { title: string; completed: boolean };

class TaskBuilder {
  private value: TaskPayload = { title: "Задача по умолчанию", completed: false };

  withTitle(title: string): this {
    this.value = { ...this.value, title };
    return this;
  }

  completed(): this {
    this.value = { ...this.value, completed: true };
    return this;
  }

  build(): TaskPayload {
    return { ...this.value };
  }
}

test("строит данные и удаляет созданный ресурс", async ({ request }) => {
  const api = await startLocalApi();
  let taskId: string | undefined;
  try {
    const payload = new TaskBuilder().withTitle("Отчёт 192").completed().build();
    const created = await request.post(`${api.baseURL}/tasks`, { data: payload });
    expect(created.status()).toBe(201);
    const location = created.headers().location;
    expect(location).toMatch(/^\/tasks\/task-\d+$/);
    if (location === undefined) throw new Error("Ответ создания не содержит Location");
    taskId = location.slice("/tasks/".length);
  } finally {
    if (taskId !== undefined) {
      await request.delete(`${api.baseURL}/tasks/${taskId}`);
    }
    await api.close();
  }
});
