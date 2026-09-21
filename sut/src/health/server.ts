import { createServer, type Server } from "node:http";

import type { SutReadiness } from "./readiness.js";

export type HealthServerOptions = Readonly<{
  host?: string;
  port?: number;
  readinessTimeoutMs?: number;
  readiness: () => Promise<SutReadiness>;
}>;

export class HealthServer {
  readonly #server: Server;
  readonly #host: string;
  readonly #port: number;
  readonly #readinessTimeoutMs: number;
  #started = false;
  #closed = false;

  constructor(options: HealthServerOptions) {
    this.#host = options.host ?? "127.0.0.1";
    this.#port = options.port ?? 0;
    this.#readinessTimeoutMs = options.readinessTimeoutMs ?? 6_000;
    if (
      !Number.isSafeInteger(this.#readinessTimeoutMs) ||
      this.#readinessTimeoutMs < 100 ||
      this.#readinessTimeoutMs > 30_000
    ) {
      throw new Error("Invalid health readiness timeout");
    }
    this.#server = createServer(async (request, response) => {
      response.setHeader("content-type", "application/json; charset=utf-8");

      if (request.method === "GET" && request.url === "/health/live") {
        response.statusCode = 200;
        response.end(
          JSON.stringify({
            status: "PASS",
            capability: "process-liveness",
          }),
        );
        return;
      }

      if (request.method === "GET" && request.url === "/health/ready") {
        let timeout: NodeJS.Timeout | undefined;
        try {
          const readiness = await Promise.race([
            options.readiness(),
            new Promise<never>((_, reject) => {
              timeout = setTimeout(
                () => reject(new Error("Health readiness timeout")),
                this.#readinessTimeoutMs,
              );
            }),
          ]);
          response.statusCode = readiness.status === "PASS" ? 200 : 503;
          response.end(JSON.stringify(readiness));
        } catch {
          response.statusCode = 503;
          response.end(
            JSON.stringify({
              status: "BLOCKED",
              capability: "sut-foundation",
              checks: [],
            }),
          );
        } finally {
          if (timeout) clearTimeout(timeout);
        }
        return;
      }

      response.statusCode = 404;
      response.end(
        JSON.stringify({
          status: "NOT_FOUND",
          capability: "health-only",
        }),
      );
    });
  }

  async start(): Promise<number> {
    if (this.#started || this.#closed) {
      throw new Error("Health server cannot be started in its current state");
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
      throw new Error("Health server did not expose a TCP port");
    }

    return address.port;
  }

  async close(timeoutMs = 2_000): Promise<void> {
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
