import type { APIRequestContext, APIResponse } from "@playwright/test";

import { readFailure, type ContractError } from "./validate-response.js";
import type { ApiFailure, ApiResult } from "./types.js";

export type RestClientOptions = Readonly<{
  request: APIRequestContext;
  baseUrl: string;
  token: string;
}>;

/**
 * Транспорт REST: заголовки, адреса, разбор тела.
 *
 * Он не знает ни одной сущности предметной области — этим занимается клиент
 * ресурса. Разделение нужно, чтобы смена способа авторизации не трогала
 * работу с задачами, и наоборот.
 */
export class RestClient {
  readonly #request: APIRequestContext;
  readonly #baseUrl: string;
  readonly #token: string;

  constructor(options: RestClientOptions) {
    this.#request = options.request;
    this.#baseUrl = options.baseUrl.replace(/\/$/, "");
    this.#token = options.token;
  }

  async get(path: string, query?: Record<string, string>): Promise<ApiResponsePair> {
    return this.#send(
      await this.#request.get(this.#url(path), {
        headers: this.#headers(),
        ...(query ? { params: query } : {}),
      }),
    );
  }

  async post(path: string, body: unknown): Promise<ApiResponsePair> {
    return this.#send(
      await this.#request.post(this.#url(path), {
        headers: this.#headers(),
        data: body,
      }),
    );
  }

  async patch(path: string, body: unknown): Promise<ApiResponsePair> {
    return this.#send(
      await this.#request.patch(this.#url(path), {
        headers: this.#headers(),
        data: body,
      }),
    );
  }

  async delete(path: string): Promise<ApiResponsePair> {
    return this.#send(
      await this.#request.delete(this.#url(path), { headers: this.#headers() }),
    );
  }

  #url(path: string): string {
    return `${this.#baseUrl}${path}`;
  }

  /** Токен живёт в заголовке и не попадает ни в адрес, ни в журнал. */
  #headers(): Record<string, string> {
    return {
      authorization: `Bearer ${this.#token}`,
      accept: "application/json",
    };
  }

  async #send(response: APIResponse): Promise<ApiResponsePair> {
    const status = response.status();

    if (status === 204) {
      return { status, body: null };
    }

    const text = await response.text();

    if (text === "") {
      return { status, body: null };
    }

    try {
      return { status, body: JSON.parse(text) as unknown };
    } catch {
      // Нечитаемое тело — тоже результат: сценарию нужно увидеть причину,
      // а не общую ошибку разбора JSON.
      return { status, body: { error: { code: "NOT_JSON", message: text.slice(0, 200) } } };
    }
  }
}

export type ApiResponsePair = Readonly<{ status: number; body: unknown }>;

/** Успех, если код в 2xx; иначе — разобранный отказ. */
export function toResult<Value>(
  pair: ApiResponsePair,
  read: (body: unknown) => Value,
): ApiResult<Value> {
  if (pair.status >= 200 && pair.status < 300) {
    return { ok: true, value: read(pair.body) };
  }

  return { ok: false, failure: readFailure(pair.status, pair.body) };
}

export type { ApiFailure, ContractError };
