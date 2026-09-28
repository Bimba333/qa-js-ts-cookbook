import type { APIRequestContext } from "@playwright/test";

export type ApiCredentials = Readonly<{ login: string; password: string }>;

export type IssuedToken = Readonly<{ token: string; testRunId: string }>;

/**
 * Получение токена — отдельная операция, а не часть клиента ресурса.
 *
 * Токен нужен один раз на прогон, а клиентов ресурсов может быть много.
 * Если бы каждый получал токен сам, стенд видел бы лишние входы, а тесты —
 * лишнюю точку отказа.
 */
export async function issueToken(
  request: APIRequestContext,
  baseUrl: string,
  credentials: ApiCredentials,
): Promise<IssuedToken> {
  const response = await request.post(`${baseUrl.replace(/\/$/, "")}/auth/token`, {
    data: credentials,
  });

  if (response.status() !== 200) {
    // Сообщение называет причину, а не «тест упал»: без токена дальше
    // падать будет каждый сценарий, и разбираться придётся с первого.
    throw new Error(
      `Не удалось получить токен: ${response.status()} ${await response.text()}`,
    );
  }

  const body = (await response.json()) as Record<string, unknown>;

  if (typeof body["accessToken"] !== "string" || typeof body["testRunId"] !== "string") {
    throw new Error("Ответ /auth/token не содержит accessToken или testRunId");
  }

  return Object.freeze({ token: body["accessToken"], testRunId: body["testRunId"] });
}

/** Удаление всех записей текущего прогона: страховка на случай утечки. */
export async function cleanupTestRun(
  request: APIRequestContext,
  baseUrl: string,
  token: string,
): Promise<number> {
  const response = await request.delete(
    `${baseUrl.replace(/\/$/, "")}/test-runs/current/work-items`,
    { headers: { authorization: `Bearer ${token}` } },
  );

  if (response.status() !== 200) return 0;

  const body = (await response.json()) as Record<string, unknown>;

  return typeof body["deletedCount"] === "number" ? body["deletedCount"] : 0;
}
