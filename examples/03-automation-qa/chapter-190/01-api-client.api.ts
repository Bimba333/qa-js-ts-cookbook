import { expect, type APIRequestContext, test } from "@playwright/test";
import { startLocalApi } from "../support/local-api.js";

class TasksClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string,
  ) {}

  create(title: string) {
    return this.request.post(`${this.baseURL}/tasks`, { data: { title } });
  }

  get(id: string) {
    return this.request.get(`${this.baseURL}/tasks/${id}`);
  }
}

test("сохраняет смысл операции в API Client", async ({ request }) => {
  const api = await startLocalApi();
  try {
    const tasks = new TasksClient(request, api.baseURL);
    const created = await tasks.create("Проверить API Client");
    expect(created.status()).toBe(201);

    const location = created.headers().location;
    expect(location).toMatch(/^\/tasks\/task-\d+$/);
    if (location === undefined) throw new Error("Ответ создания не содержит Location");

    const taskId = location.slice("/tasks/".length);
    const response = await tasks.get(taskId);

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({ title: "Проверить API Client" });
  } finally {
    await api.close();
  }
});
