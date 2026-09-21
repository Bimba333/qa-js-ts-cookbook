import { expect, type APIRequestContext, test } from "@playwright/test";

import { sutConfig } from "../support/sut/config.js";
import { issueToken } from "../support/sut/work-items-api.js";

/**
 * Клиент выражает операции предметной области, а не устройство HTTP.
 * Тест вызывает `create` и `get`, а не собирает URL и заголовки вручную.
 */
class WorkItemsClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL: string,
    private readonly token: string,
  ) {}

  private get headers(): Record<string, string> {
    return {
      authorization: `Bearer ${this.token}`,
      "x-creator-test-id": "chapter-190.client",
    };
  }

  create(title: string, description: string) {
    return this.request.post(`${this.baseURL}/work-items`, {
      headers: this.headers,
      data: { title, description, priority: "MEDIUM" },
    });
  }

  get(id: string) {
    return this.request.get(`${this.baseURL}/work-items/${id}`, {
      headers: this.headers,
    });
  }

  cleanupRun() {
    return this.request.delete(`${this.baseURL}/test-runs/current/work-items`, {
      headers: this.headers,
    });
  }
}

test("сохраняет смысл операции в API Client", async ({ request }) => {
  const token = await issueToken(request);
  const workItems = new WorkItemsClient(
    request,
    sutConfig().apiBaseURL,
    token.accessToken,
  );

  try {
    const created = await workItems.create(
      "Проверить API Client",
      "Клиент скрывает транспорт, но не контракт",
    );
    expect(created.status()).toBe(201);

    const { id } = (await created.json()) as { id: string };
    const response = await workItems.get(id);

    expect(response.status()).toBe(200);
    expect(await response.json()).toMatchObject({
      title: "Проверить API Client",
      status: "NEW",
      version: 1,
    });
  } finally {
    await workItems.cleanupRun();
  }
});
