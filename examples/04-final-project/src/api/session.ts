import type { APIRequestContext } from "@playwright/test";

import { issueToken, type ApiCredentials } from "./authenticate.js";

export type ApiSession = Readonly<{ token: string; testRunId: string }>;

/**
 * Одна сессия на тест.
 *
 * Каждый выпуск токена открывает на стенде **новый прогон**: сервис выдаёт
 * ему собственный `testRunId`. Если две фикстуры получат токен независимо,
 * подготовленные данные окажутся в одном прогоне, а массовая очистка и
 * проверки — в другом.
 */
export async function openSession(
  request: APIRequestContext,
  baseUrl: string,
  credentials: ApiCredentials,
): Promise<ApiSession> {
  const issued = await issueToken(request, baseUrl, credentials);

  return Object.freeze({ token: issued.token, testRunId: issued.testRunId });
}
