import { expect, test } from "@playwright/test";

import { sutConfig, SUT_USERS } from "../support/sut/config.js";
import { issueToken } from "../support/sut/work-items-api.js";

test("передаёт bearer token и различает 401 и 403", async ({ request }) => {
  const api = sutConfig().apiBaseURL;

  const tester = await issueToken(request, SUT_USERS.tester);
  const viewer = await issueToken(request, SUT_USERS.viewer);

  const invalidCredentials = await request.post(`${api}/auth/token`, {
    data: { login: SUT_USERS.tester.login, password: "wrong-password" },
  });

  const withoutToken = await request.get(`${api}/work-items`);
  const withToken = await request.get(`${api}/work-items`, {
    headers: { authorization: `Bearer ${tester.accessToken}` },
  });

  // Роль viewer аутентифицирована, но не имеет права изменять данные.
  const forbidden = await request.post(`${api}/work-items`, {
    headers: { authorization: `Bearer ${viewer.accessToken}` },
    data: {
      title: "Попытка записи от viewer",
      description: "Роль viewer доступна только для чтения",
      priority: "LOW",
    },
  });

  expect(withToken.status()).toBe(200);

  // 401 — «кто ты» неизвестно: учётные данные неверны или токена нет.
  expect(invalidCredentials.status()).toBe(401);
  expect(await invalidCredentials.json()).toMatchObject({
    code: "UNAUTHENTICATED",
  });
  expect(withoutToken.status()).toBe(401);

  // 403 — «кто ты» известно, но действие не разрешено.
  expect(forbidden.status()).toBe(403);
  expect(await forbidden.json()).toMatchObject({ code: "PERMISSION_DENIED" });
});

test("отключённая учётная запись не получает токен", async ({ request }) => {
  const response = await request.post(`${sutConfig().apiBaseURL}/auth/token`, {
    data: SUT_USERS.disabled,
  });

  expect(response.status()).toBe(401);
});
