import { expect, test } from "@playwright/test";
import { startLocalApi } from "../support/local-api.js";

type Profile = { id: string; active: boolean };

const isProfile = (value: unknown): value is Profile => {
  if (typeof value !== "object" || value === null) return false;
  return "id" in value
    && typeof value.id === "string"
    && "active" in value
    && typeof value.active === "boolean";
};

test("проверяет внешний JSON во время выполнения", async ({ request }) => {
  const api = await startLocalApi();
  try {
    const response = await request.get(`${api.baseURL}/contracts/profile`);
    const body: unknown = await response.json();

    expect(isProfile(body), "ответ должен соответствовать контракту Profile").toBe(true);
    if (!isProfile(body)) throw new Error("Некорректный контракт Profile");
    expect(body.active).toBe(true);

    const invalidResponse = await request.get(`${api.baseURL}/contracts/profile`, {
      params: { variant: "invalid" },
    });
    const invalidBody: unknown = await invalidResponse.json();
    expect(isProfile(invalidBody), "невалидный ответ не должен пройти guard").toBe(false);
  } finally {
    await api.close();
  }
});
