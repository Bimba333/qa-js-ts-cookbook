import type { APIRequestContext, APIResponse } from "@playwright/test";

import { sutConfig, SUT_USERS } from "./config.js";
import { isWorkItem, type WorkItem, type WorkItemPage } from "./types.js";

export type SutCredentials = Readonly<{ login: string; password: string }>;

export type IssuedToken = Readonly<{
  accessToken: string;
  tokenType: string;
  expiresAt: string;
  testRunId: string;
  principal: Readonly<{ userId: string; login: string; role: string }>;
}>;

export type CreateWorkItemInput = Readonly<{
  title: string;
  description: string;
  priority: WorkItem["priority"];
}>;

export type ListQuery = Readonly<{
  status?: WorkItem["status"];
  priority?: WorkItem["priority"];
  ownerId?: string;
  limit?: number;
  offset?: number;
}>;

/**
 * Приводит название теста к допустимому идентификатору.
 *
 * Стенд принимает `[A-Za-z0-9._:-]`, поэтому кириллица и пробелы заменяются:
 * идентификатор нужен для поиска следов теста, а не для чтения человеком.
 */
export function toCreatorTestId(title: string): string {
  const normalized = title
    .replaceAll(/[^A-Za-z0-9._:-]+/gu, "-")
    .replaceAll(/-{2,}/gu, "-")
    .replace(/^-|-$/gu, "")
    .slice(0, 160);

  return normalized.length > 0 ? normalized : "example";
}

export async function issueToken(
  request: APIRequestContext,
  credentials: SutCredentials = SUT_USERS.tester,
): Promise<IssuedToken> {
  const response = await request.post(`${sutConfig().apiBaseURL}/auth/token`, {
    data: credentials,
  });

  if (!response.ok()) {
    throw new Error(
      `Не удалось получить токен: ${response.status()} ${await response.text()}`,
    );
  }

  return (await response.json()) as IssuedToken;
}

/**
 * Клиент публичной REST-границы стенда.
 *
 * Методы возвращают сырой ответ Playwright: тест сам решает, проверять ему
 * статус, заголовки или тело. Удобные обёртки с разбором вынесены отдельно,
 * чтобы не прятать HTTP-контракт от проверок.
 */
export class WorkItemsApi {
  readonly #request: APIRequestContext;
  readonly #baseURL: string;
  readonly #token: string;
  readonly #creatorTestId: string;

  constructor(
    request: APIRequestContext,
    token: string,
    creatorTestId: string,
    baseURL = sutConfig().apiBaseURL,
  ) {
    this.#request = request;
    this.#baseURL = baseURL;
    this.#token = token;
    this.#creatorTestId = creatorTestId;
  }

  get headers(): Readonly<Record<string, string>> {
    return {
      authorization: `Bearer ${this.#token}`,
      "x-creator-test-id": this.#creatorTestId,
    };
  }

  create(input: CreateWorkItemInput): Promise<APIResponse> {
    return this.#request.post(`${this.#baseURL}/work-items`, {
      headers: this.headers,
      data: input,
    });
  }

  get(id: string): Promise<APIResponse> {
    return this.#request.get(`${this.#baseURL}/work-items/${id}`, {
      headers: this.headers,
    });
  }

  list(query: ListQuery = {}): Promise<APIResponse> {
    const params = Object.fromEntries(
      Object.entries(query)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)]),
    );

    return this.#request.get(`${this.#baseURL}/work-items`, {
      headers: this.headers,
      params,
    });
  }

  patch(
    id: string,
    body: Readonly<Record<string, unknown>>,
  ): Promise<APIResponse> {
    return this.#request.patch(`${this.#baseURL}/work-items/${id}`, {
      headers: this.headers,
      data: body,
    });
  }

  remove(id: string): Promise<APIResponse> {
    return this.#request.delete(`${this.#baseURL}/work-items/${id}`, {
      headers: this.headers,
    });
  }

  /** Удаляет данные своего запуска. Seed и чужие запуски не затрагиваются. */
  cleanupRun(): Promise<APIResponse> {
    return this.#request.delete(
      `${this.#baseURL}/test-runs/current/work-items`,
      { headers: this.headers },
    );
  }

  async createOrThrow(input: CreateWorkItemInput): Promise<WorkItem> {
    const response = await this.create(input);

    if (response.status() !== 201) {
      throw new Error(
        `Создание вернуло ${response.status()}: ${await response.text()}`,
      );
    }

    const body: unknown = await response.json();
    if (!isWorkItem(body)) {
      throw new Error("Ответ создания не соответствует контракту Work Item");
    }

    return body;
  }

  async listOrThrow(query: ListQuery = {}): Promise<WorkItemPage> {
    const response = await this.list(query);

    if (!response.ok()) {
      throw new Error(
        `Список вернул ${response.status()}: ${await response.text()}`,
      );
    }

    return (await response.json()) as WorkItemPage;
  }
}
