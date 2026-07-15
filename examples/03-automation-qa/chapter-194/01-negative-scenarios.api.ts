import { expect, test } from "@playwright/test";
import { startLocalApi } from "../support/local-api.js";

test("проверяет контролируемый отказ без побочного эффекта", async ({ request }) => {
  const api = await startLocalApi();
  try {
    const rejected = await request.post(`${api.baseURL}/tasks`, { data: { title: "" } });
    const oversized = await request.post(`${api.baseURL}/tasks`, {
      data: { title: "x".repeat(70 * 1024) },
    });
    const unsupportedMethod = await request.delete(`${api.baseURL}/tasks`);
    const tasks = await request.get(`${api.baseURL}/tasks`);

    expect(rejected.status()).toBe(422);
    expect(await rejected.json()).toEqual({ code: "TITLE_REQUIRED" });
    expect(oversized.status()).toBe(413);
    expect(await oversized.json()).toEqual({ code: "PAYLOAD_TOO_LARGE" });
    expect(unsupportedMethod.status()).toBe(405);
    expect(unsupportedMethod.headers().allow).toBe("GET, POST");
    expect(await unsupportedMethod.json()).toEqual({ code: "METHOD_NOT_ALLOWED" });
    expect(await tasks.json()).toEqual([]);
  } finally {
    await api.close();
  }
});
