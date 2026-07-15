import { expect, test } from "@playwright/test";
import { startLocalApi } from "../support/local-api.js";

test("передаёт query, headers и JSON body", async ({ request }) => {
  const api = await startLocalApi();
  try {
    const response = await request.post(`${api.baseURL}/inspect`, {
      params: { source: "api test" },
      headers: { "x-test-role": "qa" },
      data: { title: "Новая задача" },
    });

    expect(await response.json()).toEqual({
      method: "POST",
      pathname: "/inspect",
      query: { source: "api test" },
      testRole: "qa",
      body: { title: "Новая задача" },
    });
  } finally {
    await api.close();
  }
});
