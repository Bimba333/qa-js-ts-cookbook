import { expect, request as requestFactory, test } from "@playwright/test";
import { startLocalApi } from "../support/local-api.js";

test("владеет созданным вручную APIRequestContext", async () => {
  const api = await startLocalApi();

  try {
    const context = await requestFactory.newContext({
      baseURL: api.baseURL,
      extraHTTPHeaders: { "x-test-role": "auditor" },
    });

    try {
      const response = await context.get("/inspect", { params: { page: "2" } });
      expect(await response.json()).toMatchObject({
        query: { page: "2" },
        testRole: "auditor",
      });
    } finally {
      await context.dispose();
    }
  } finally {
    await api.close();
  }
});
