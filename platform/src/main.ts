import { createHash, randomBytes } from "node:crypto";
import http from "node:http";

import { loadConfig, type PlatformConfig } from "./config.js";
import { Database } from "./database.js";
import { isProgressMap, mergeProgress, type ProgressMap } from "./progress.js";
import { verifyPassword } from "./passwords.js";

const MAX_BODY_BYTES = 256 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_PASSWORD_LENGTH = 10;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function readJson(request: http.IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request) {
    const buffer = chunk as Buffer;
    size += buffer.length;

    if (size > MAX_BODY_BYTES) {
      throw new Error("PAYLOAD_TOO_LARGE");
    }

    chunks.push(buffer);
  }

  const raw = Buffer.concat(chunks).toString("utf8");

  if (raw.trim() === "") return {};

  return JSON.parse(raw);
}

function send(
  response: http.ServerResponse,
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): void {
  if (body === undefined) {
    response.writeHead(status, { "cache-control": "no-store", ...headers });
    response.end();
    return;
  }

  const payload = JSON.stringify(body);

  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
    "cache-control": "no-store",
    ...headers,
  });
  response.end(payload);
}

function corsHeaders(config: PlatformConfig, origin: string | undefined): Record<string, string> {
  const allowed = config.allowedOrigins.includes("*")
    ? origin ?? "*"
    : config.allowedOrigins.find((value) => value === origin);

  if (!allowed) return {};

  return {
    "access-control-allow-origin": allowed,
    "access-control-allow-headers": "authorization, content-type",
    "access-control-allow-methods": "GET, POST, PUT, OPTIONS",
    "access-control-max-age": "600",
  };
}

function bearer(request: http.IncomingMessage): string | null {
  const header = request.headers.authorization;
  const match = /^Bearer\s+([A-Za-z0-9._-]{16,512})$/.exec(header ?? "");

  return match?.[1] ?? null;
}

export async function start(): Promise<http.Server> {
  const config = loadConfig();
  const database = new Database(config.databaseUrl);

  await database.migrate();

  const server = http.createServer((request, response) => {
    void handle(request, response).catch((error) => {
      const code = error instanceof Error ? error.message : "UNKNOWN";

      if (code === "PAYLOAD_TOO_LARGE") {
        send(response, 413, { code: "PAYLOAD_TOO_LARGE", message: "Тело запроса слишком большое" });
        return;
      }

      send(response, 500, { code: "INTERNAL", message: "Внутренняя ошибка сервиса" });
    });
  });

  async function requireUser(request: http.IncomingMessage) {
    const token = bearer(request);

    if (!token) return null;

    return database.findSession(hashToken(token));
  }

  async function handle(request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    const cors = corsHeaders(config, request.headers.origin);
    const route = `${request.method} ${url.pathname}`;

    if (request.method === "OPTIONS") {
      send(response, 204, undefined, cors);
      return;
    }

    if (route === "GET /health/ready") {
      send(response, (await database.ready()) ? 200 : 503, { status: "ready" }, cors);
      return;
    }

    if (route === "POST /api/v1/auth/register" || route === "POST /api/v1/auth/login") {
      const body = (await readJson(request)) as { email?: unknown; password?: unknown };
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const password = typeof body.password === "string" ? body.password : "";

      if (!EMAIL.test(email)) {
        send(response, 400, { code: "VALIDATION_FAILED", message: "Адрес почты некорректен" }, cors);
        return;
      }

      if (password.length < MIN_PASSWORD_LENGTH) {
        send(response, 400, {
          code: "VALIDATION_FAILED",
          message: `Пароль короче ${MIN_PASSWORD_LENGTH} символов`,
        }, cors);
        return;
      }

      const user = route.endsWith("register")
        ? await database.createUser(email, password)
        : await (async () => {
            const credentials = await database.findCredentials(email);

            if (!credentials) return null;

            return (await verifyPassword(password, credentials.passwordHash))
              ? { id: credentials.id, email: credentials.email }
              : null;
          })();

      if (!user) {
        // Регистрация занятого адреса и неверный пароль отвечают по-разному:
        // первое — конфликт, второе — отказ в доступе без подсказок.
        const conflict = route.endsWith("register");

        send(response, conflict ? 409 : 401, {
          code: conflict ? "EMAIL_TAKEN" : "INVALID_CREDENTIALS",
          message: conflict ? "Адрес уже занят" : "Неверный адрес или пароль",
        }, cors);
        return;
      }

      const token = randomBytes(32).toString("hex");
      await database.createSession(user.id, hashToken(token), config.sessionDays);

      send(response, route.endsWith("register") ? 201 : 200, { token, user }, cors);
      return;
    }

    if (route === "POST /api/v1/auth/logout") {
      const token = bearer(request);

      if (token) await database.deleteSession(hashToken(token));

      send(response, 204, undefined, cors);
      return;
    }

    if (route === "GET /api/v1/progress" || route === "PUT /api/v1/progress") {
      const user = await requireUser(request);

      if (!user) {
        send(response, 401, { code: "UNAUTHENTICATED", message: "Требуется вход" }, cors);
        return;
      }

      if (request.method === "GET") {
        const stored = await database.readProgress(user.id);

        send(response, 200, { version: 1, ...stored }, cors);
        return;
      }

      const body = (await readJson(request)) as { tasks?: unknown };

      if (!isProgressMap(body.tasks)) {
        send(response, 400, {
          code: "VALIDATION_FAILED",
          message: "Раздел задач отсутствует или имеет неверную форму",
        }, cors);
        return;
      }

      const stored = await database.readProgress(user.id);
      const merged = mergeProgress(stored.tasks, body.tasks as ProgressMap);
      const written = await database.writeProgress(user.id, merged);

      send(response, 200, { version: 1, ...written }, cors);
      return;
    }

    send(response, 404, { code: "NOT_FOUND", message: "Маршрут не найден" }, cors);
  }

  await new Promise<void>((resolve) => {
    server.listen(config.httpPort, config.httpHost, resolve);
  });

  const shutdown = async () => {
    server.close();
    await database.close();
  };

  process.once("SIGTERM", () => void shutdown());
  process.once("SIGINT", () => void shutdown());

  console.log(
    JSON.stringify({
      event: "platform.started",
      host: config.httpHost,
      port: config.httpPort,
    }),
  );

  return server;
}

// Запуск как приложения; при импорте в тестах ничего не происходит.
if (process.argv[1]?.endsWith("main.js")) {
  void start();
}
