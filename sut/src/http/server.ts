import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";

import { isDomainError } from "../domain/errors.js";
import { logEvent, safeErrorCode } from "../logging/logger.js";
import { resolveCorrelationId } from "./request.js";
import {
  sendDomainError,
  sendInternalError,
  sendJson,
} from "./responses.js";
import { resolveRoute, type Route } from "./router.js";

export type HttpServerOptions = Readonly<{
  routes: readonly Route[];
  host?: string;
  port?: number;
}>;

export class HttpServer {
  readonly #server: Server;
  readonly #host: string;
  readonly #port: number;
  #started = false;
  #closed = false;

  constructor(options: HttpServerOptions) {
    this.#host = options.host ?? "0.0.0.0";
    this.#port = options.port ?? 4_310;

    this.#server = createServer((request, response) => {
      void this.#handle(options.routes, request, response);
    });
  }

  async #handle(
    routes: readonly Route[],
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    const correlationId = resolveCorrelationId(request);
    response.setHeader("x-correlation-id", correlationId);

    const url = new URL(
      request.url ?? "/",
      `http://${request.headers.host ?? "127.0.0.1"}`,
    );
    const resolved = resolveRoute(routes, request.method ?? "GET", url.pathname);

    if (resolved.outcome === "not_found") {
      sendJson(response, 404, {
        code: "NOT_FOUND",
        message: "Маршрут не найден",
        correlationId,
      });
      return;
    }

    if (resolved.outcome === "method_not_allowed") {
      response.setHeader("allow", resolved.allowed.join(", "));
      sendJson(response, 405, {
        code: "METHOD_NOT_ALLOWED",
        message: "Метод не поддерживается для этого маршрута",
        correlationId,
      });
      return;
    }

    try {
      await resolved.match.handler({
        request,
        response,
        url,
        params: resolved.match.params,
        correlationId,
      });
    } catch (error) {
      if (isDomainError(error)) {
        // Доменная ошибка ожидаема: она часть контракта, а не сбой.
        logEvent("http.request.rejected", {
          correlationId,
          path: url.pathname,
          method: request.method ?? "GET",
          errorCode: error.code,
        });
        if (!response.headersSent) {
          // Тело запроса осталось непрочитанным, поэтому соединение
          // переиспользовать нельзя: закрываем его вместе с ответом.
          if (error.code === "PAYLOAD_TOO_LARGE") {
            response.setHeader("connection", "close");
          }
          sendDomainError(response, error, correlationId);
        }
        return;
      }

      logEvent("http.request.failed", {
        correlationId,
        path: url.pathname,
        method: request.method ?? "GET",
        errorCode: safeErrorCode(error),
      });

      if (!response.headersSent) {
        sendInternalError(response, correlationId);
      } else {
        response.end();
      }
    }
  }

  async start(): Promise<number> {
    if (this.#started || this.#closed) {
      throw new Error("HTTP server cannot be started in its current state");
    }

    await new Promise<void>((resolve, reject) => {
      this.#server.once("error", reject);
      this.#server.listen(this.#port, this.#host, () => {
        this.#server.off("error", reject);
        resolve();
      });
    });
    this.#started = true;

    const address = this.#server.address();
    if (address === null || typeof address === "string") {
      throw new Error("HTTP server did not expose a TCP port");
    }

    return address.port;
  }

  async close(timeoutMs = 3_000): Promise<void> {
    if (this.#closed) return;
    this.#closed = true;
    if (!this.#started) return;

    await new Promise<void>((resolve, reject) => {
      const forceClose = setTimeout(() => {
        this.#server.closeAllConnections();
      }, timeoutMs);
      forceClose.unref();

      this.#server.close((error) => {
        clearTimeout(forceClose);
        if (error) reject(error);
        else resolve();
      });
    });
  }
}
