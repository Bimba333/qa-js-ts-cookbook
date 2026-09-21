import type { ServerResponse } from "node:http";

import { DomainError, type DomainErrorCode } from "../domain/errors.js";

/**
 * Соответствие доменного кода и HTTP-статуса.
 *
 * Таблица находится на границе транспорта: доменный слой не знает про HTTP,
 * а транспорт не придумывает собственную классификацию ошибок.
 */
const STATUS_BY_CODE: Readonly<Record<DomainErrorCode, number>> = Object.freeze({
  VALIDATION_FAILED: 400,
  PAYLOAD_TOO_LARGE: 413,
  UNAUTHENTICATED: 401,
  PERMISSION_DENIED: 403,
  SEED_IMMUTABLE: 403,
  CROSS_RUN_CLEANUP_DENIED: 403,
  NOT_FOUND: 404,
  VERSION_CONFLICT: 409,
  INVALID_TRANSITION: 409,
});

export function statusForDomainError(code: DomainErrorCode): number {
  return STATUS_BY_CODE[code];
}

export function sendJson(
  response: ServerResponse,
  status: number,
  payload: unknown,
): void {
  const body = JSON.stringify(payload);

  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(body);
}

export function sendNoContent(response: ServerResponse): void {
  response.writeHead(204, { "cache-control": "no-store" });
  response.end();
}

export function sendHtml(
  response: ServerResponse,
  status: number,
  html: string,
  headers: Readonly<Record<string, string>> = {},
): void {
  response.writeHead(status, {
    "content-type": "text/html; charset=utf-8",
    "content-length": Buffer.byteLength(html),
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    ...headers,
  });
  response.end(html);
}

export function sendRedirect(
  response: ServerResponse,
  location: string,
  headers: Readonly<Record<string, string>> = {},
): void {
  response.writeHead(303, {
    location,
    "cache-control": "no-store",
    ...headers,
  });
  response.end();
}

/**
 * Единая форма ошибки REST. Тело не содержит stack trace, SQL или
 * credential material: клиенту достаётся устойчивый код и безопасный текст.
 */
export function sendDomainError(
  response: ServerResponse,
  error: DomainError,
  correlationId: string,
): void {
  sendJson(response, statusForDomainError(error.code), {
    code: error.code,
    message: error.message,
    ...(error.field === undefined ? {} : { field: error.field }),
    correlationId,
  });
}

export function sendInternalError(
  response: ServerResponse,
  correlationId: string,
): void {
  sendJson(response, 500, {
    code: "INTERNAL_ERROR",
    message: "Внутренняя ошибка SUT",
    correlationId,
  });
}
