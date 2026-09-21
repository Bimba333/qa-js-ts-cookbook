import { expect, request as requestFactory, test } from "@playwright/test";

import { sutConfig } from "../support/sut/config.js";
import { issueToken } from "../support/sut/work-items-api.js";

test("владеет созданным вручную APIRequestContext", async ({ request }) => {
  const config = sutConfig();
  const token = await issueToken(request);

  // Собственный context задаёт baseURL и общие заголовки один раз,
  // поэтому вызовы остаются короткими.
  //
  // baseURL — это origin, а не префикс пути: путь со слэша разрешается
  // относительно корня, поэтому версия API остаётся частью адреса запроса.
  const context = await requestFactory.newContext({
    baseURL: config.baseURL,
    extraHTTPHeaders: {
      authorization: `Bearer ${token.accessToken}`,
      "x-creator-test-id": "chapter-189.context",
    },
  });

  try {
    const page = await context.get("/api/v1/work-items", {
      params: { status: "DONE", limit: "3" },
    });

    expect(page.status()).toBe(200);
    const body = (await page.json()) as {
      items: { status: string }[];
      limit: number;
    };

    expect(body.limit).toBe(3);
    expect(body.items.every((item) => item.status === "DONE")).toBe(true);

    const me = await context.get("/api/v1/me");
    expect(await me.json()).toMatchObject({
      login: "educational_tester",
      role: "tester",
      testRunId: token.testRunId,
    });
  } finally {
    // Context владеет соединениями и cookie, поэтому его нужно закрыть
    // явно — сборщик мусора за этим не следит.
    await context.dispose();
  }
});
