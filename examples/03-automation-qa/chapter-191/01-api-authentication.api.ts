import { expect, test } from "@playwright/test";
import { startLocalApi } from "../support/local-api.js";

test("передаёт bearer token и различает 401 и 403", async ({ request }) => {
  const api = await startLocalApi();
  try {
    const session = await request.post(`${api.baseURL}/sessions`, {
      data: { username: "qa", password: "local-secret" },
    });
    expect(session.status()).toBe(200);
    const sessionBody: unknown = await session.json();
    if (
      typeof sessionBody !== "object"
      || sessionBody === null
      || !("token" in sessionBody)
      || typeof sessionBody.token !== "string"
    ) {
      throw new Error("Ответ сессии не содержит token");
    }

    const invalidSession = await request.post(`${api.baseURL}/sessions`, {
      data: { username: "qa", password: "wrong-password" },
    });

    const profile = await request.get(`${api.baseURL}/profile`, {
      headers: { authorization: `Bearer ${sessionBody.token}` },
    });
    const missing = await request.get(`${api.baseURL}/admin`);
    const forbidden = await request.get(`${api.baseURL}/admin`, {
      headers: { authorization: `Bearer ${sessionBody.token}` },
    });

    expect(profile.status()).toBe(200);
    expect(invalidSession.status()).toBe(401);
    expect(await invalidSession.json()).toEqual({ code: "INVALID_CREDENTIALS" });
    expect(missing.status()).toBe(401);
    expect(forbidden.status()).toBe(403);
  } finally {
    await api.close();
  }
});
