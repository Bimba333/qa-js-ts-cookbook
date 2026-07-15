import { expect, test } from "@playwright/test";
import { startLocalApi } from "../support/local-api.js";

test("проверяет уровни HTTP-ответа", async ({ request }) => {
  const api = await startLocalApi();
  try {
    const response = await request.get(`${api.baseURL}/responses/accepted`);

    expect(response.status()).toBe(202);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(response.headers()["x-request-id"]).toBe("request-1");
    expect(await response.json()).toEqual({ status: "queued", jobId: "job-1" });
  } finally {
    await api.close();
  }
});
