import type { IncomingMessage } from "node:http";
import { randomUUID } from "node:crypto";

import { DomainError } from "../domain/errors.js";

export const MAX_BODY_BYTES = 64 * 1_024;

const CORRELATION_ID = /^[A-Za-z0-9._:-]{1,160}$/;

/**
 * Читает тело запроса с жёстким ограничением размера.
 *
 * Лимит проверяется по мере чтения, а не после: иначе слишком большой запрос
 * успел бы занять память до отказа. Соединение при этом не разрывается —
 * клиент должен получить осмысленный 413, а не сброс сокета.
 */
export async function readBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = chunk as Buffer;
    size += buffer.length;

    if (size > MAX_BODY_BYTES) {
      request.pause();
      throw new DomainError(
        "PAYLOAD_TOO_LARGE",
        `Тело запроса превышает ${MAX_BODY_BYTES} байт`,
      );
    }

    chunks.push(buffer);
  }

  return Buffer.concat(chunks).toString("utf8");
}

/**
 * То же чтение, но без превращения в строку.
 *
 * Загруженный файл может быть не текстом, и перевод в utf8 испортил бы и
 * содержимое, и подсчёт размера. Учебная страница показывает именно размер,
 * поэтому байты нужны как есть.
 */
export async function readRawBody(request: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = chunk as Buffer;
    size += buffer.length;

    if (size > MAX_BODY_BYTES) {
      request.pause();
      throw new DomainError(
        "PAYLOAD_TOO_LARGE",
        `Тело запроса превышает ${MAX_BODY_BYTES} байт`,
      );
    }

    chunks.push(buffer);
  }

  return Buffer.concat(chunks);
}

export async function readJsonBody(
  request: IncomingMessage,
): Promise<Record<string, unknown>> {
  const raw = await readBody(request);

  if (raw.trim().length === 0) {
    return {};
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new DomainError("VALIDATION_FAILED", "Тело запроса не является JSON");
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new DomainError(
      "VALIDATION_FAILED",
      "Тело запроса должно быть JSON-объектом",
    );
  }

  return parsed as Record<string, unknown>;
}

export async function readFormBody(
  request: IncomingMessage,
): Promise<URLSearchParams> {
  return new URLSearchParams(await readBody(request));
}

export function parseCookies(
  request: IncomingMessage,
): Readonly<Record<string, string>> {
  const header = request.headers.cookie;
  if (!header) return Object.freeze({});

  const cookies: Record<string, string> = {};

  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;

    const name = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();

    if (name.length > 0) {
      try {
        cookies[name] = decodeURIComponent(value);
      } catch {
        cookies[name] = value;
      }
    }
  }

  return Object.freeze(cookies);
}

export function headerValue(
  request: IncomingMessage,
  name: string,
): string | undefined {
  const value = request.headers[name];

  return Array.isArray(value) ? value[0] : value;
}

/**
 * Идентификатор запроса связывает ответ клиента, запись audit trail и строку
 * лога. Клиент может задать свой, если он соответствует контракту.
 */
export function resolveCorrelationId(request: IncomingMessage): string {
  const provided = headerValue(request, "x-correlation-id");

  return provided && CORRELATION_ID.test(provided) ? provided : randomUUID();
}

export function bearerToken(request: IncomingMessage): string | null {
  const authorization = headerValue(request, "authorization");
  if (!authorization) return null;

  const match = /^Bearer\s+(?<token>[A-Za-z0-9._~+/=-]{16,512})$/.exec(
    authorization,
  );

  return match?.groups?.token ?? null;
}
