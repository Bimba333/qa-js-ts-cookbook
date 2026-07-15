import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

export type TaskRecord = {
  id: string;
  title: string;
  completed: boolean;
};

export type LocalApi = {
  baseURL: string;
  close: () => Promise<void>;
};

type JsonRecord = Record<string, unknown>;

const MAX_REQUEST_BODY_BYTES = 64 * 1024;

class RequestBodyTooLargeError extends Error {}

const readBody = async (request: IncomingMessage): Promise<string> => {
  const chunks: Buffer[] = [];
  let receivedBytes = 0;
  let tooLarge = false;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    receivedBytes += buffer.byteLength;

    if (receivedBytes <= MAX_REQUEST_BODY_BYTES) {
      chunks.push(buffer);
    } else {
      tooLarge = true;
    }
  }

  if (tooLarge) {
    throw new RequestBodyTooLargeError("Request body exceeds the local API limit");
  }

  return Buffer.concat(chunks).toString("utf8");
};

const sendJson = (
  response: ServerResponse,
  status: number,
  body: unknown,
  headers: Record<string, string> = {},
): void => {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    ...headers,
  });
  response.end(JSON.stringify(body));
};

const parseJson = (source: string): JsonRecord | undefined => {
  try {
    const value: unknown = JSON.parse(source);
    return typeof value === "object" && value !== null && !Array.isArray(value)
      ? value as JsonRecord
      : undefined;
  } catch {
    return undefined;
  }
};

const hasJsonContentType = (request: IncomingMessage): boolean =>
  request.headers["content-type"]
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase() === "application/json";

export const startLocalApi = async (): Promise<LocalApi> => {
  const tasks = new Map<string, TaskRecord>();
  let nextTaskId = 1;

  const server = createServer((request, response) => {
    void (async () => {
    const origin = `http://${request.headers.host ?? "127.0.0.1"}`;
    const url = new URL(request.url ?? "/", origin);
    const method = request.method ?? "GET";

    if (method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { status: "ready" }, { "x-service-version": "1" });
      return;
    }

    if (url.pathname === "/inspect") {
      const rawBody = await readBody(request);
      sendJson(response, 200, {
        method,
        pathname: url.pathname,
        query: Object.fromEntries(url.searchParams),
        testRole: request.headers["x-test-role"] ?? null,
        body: rawBody === "" ? null : parseJson(rawBody) ?? rawBody,
      });
      return;
    }

    if (method === "GET" && url.pathname === "/responses/accepted") {
      sendJson(
        response,
        202,
        { status: "queued", jobId: "job-1" },
        { "x-request-id": "request-1" },
      );
      return;
    }

    if (method === "POST" && url.pathname === "/sessions") {
      if (!hasJsonContentType(request)) {
        sendJson(response, 415, { code: "UNSUPPORTED_CONTENT_TYPE" });
        return;
      }

      const body = parseJson(await readBody(request));
      if (body?.username === "qa" && body.password === "local-secret") {
        sendJson(response, 200, { token: "test-token", expiresIn: 300 });
      } else {
        sendJson(response, 401, { code: "INVALID_CREDENTIALS" });
      }
      return;
    }

    if (method === "GET" && url.pathname === "/profile") {
      const authorization = request.headers.authorization;
      if (authorization === undefined) {
        sendJson(response, 401, { code: "MISSING_TOKEN" });
      } else if (authorization !== "Bearer test-token") {
        sendJson(response, 401, { code: "INVALID_TOKEN" });
      } else {
        sendJson(response, 200, { id: "user-1", role: "qa" });
      }
      return;
    }

    if (method === "GET" && url.pathname === "/admin") {
      const authorization = request.headers.authorization;
      if (authorization === undefined) {
        sendJson(response, 401, { code: "MISSING_TOKEN" });
      } else if (authorization !== "Bearer admin-token") {
        sendJson(response, 403, { code: "INSUFFICIENT_PERMISSIONS" });
      } else {
        sendJson(response, 200, { scope: "admin" });
      }
      return;
    }

    if (method === "GET" && url.pathname === "/contracts/profile") {
      const body = url.searchParams.get("variant") === "invalid"
        ? { id: 7, active: "yes" }
        : { id: "profile-1", active: true };
      sendJson(response, 200, body);
      return;
    }

    if (method === "GET" && url.pathname === "/app") {
      response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      response.end(`<!doctype html>
        <button id="create">Создать задачу</button>
        <output id="result"></output>
        <script>
          document.querySelector('#create').onclick = async () => {
            const response = await fetch('/tasks', {
              method: 'POST',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ title: 'Создано из UI' })
            });
            const task = await response.json();
            document.querySelector('#result').textContent = task.id;
          };
        </script>`);
      return;
    }

    if (method === "GET" && url.pathname === "/tasks") {
      const completed = url.searchParams.get("completed");
      const records = [...tasks.values()].filter((task) =>
        completed === null ? true : task.completed === (completed === "true")
      );
      sendJson(response, 200, records);
      return;
    }

    if (method === "POST" && url.pathname === "/tasks") {
      if (!hasJsonContentType(request)) {
        sendJson(response, 415, { code: "UNSUPPORTED_CONTENT_TYPE" });
        return;
      }

      const body = parseJson(await readBody(request));
      if (body === undefined) {
        sendJson(response, 400, { code: "MALFORMED_JSON" });
        return;
      }
      if (typeof body.title !== "string" || body.title.trim() === "") {
        sendJson(response, 422, { code: "TITLE_REQUIRED" });
        return;
      }
      if ([...tasks.values()].some((task) => task.title === body.title)) {
        sendJson(response, 409, { code: "TASK_ALREADY_EXISTS" });
        return;
      }

      const task: TaskRecord = {
        id: `task-${nextTaskId++}`,
        title: body.title,
        completed: body.completed === true,
      };
      tasks.set(task.id, task);
      sendJson(response, 201, task, { location: `/tasks/${task.id}` });
      return;
    }

    if (url.pathname === "/tasks") {
      sendJson(response, 405, { code: "METHOD_NOT_ALLOWED" }, { allow: "GET, POST" });
      return;
    }

    const taskMatch = /^\/tasks\/([^/]+)$/.exec(url.pathname);
    if (taskMatch !== null) {
      const taskId = decodeURIComponent(taskMatch[1]);

      if (method === "GET") {
        const task = tasks.get(taskId);
        task === undefined
          ? sendJson(response, 404, { code: "TASK_NOT_FOUND" })
          : sendJson(response, 200, task);
        return;
      }

      if (method === "PUT") {
        if (!hasJsonContentType(request)) {
          sendJson(response, 415, { code: "UNSUPPORTED_CONTENT_TYPE" });
          return;
        }

        const body = parseJson(await readBody(request));
        if (typeof body?.title !== "string" || typeof body.completed !== "boolean") {
          sendJson(response, 422, { code: "INVALID_TASK" });
          return;
        }
        const task: TaskRecord = { id: taskId, title: body.title, completed: body.completed };
        tasks.set(taskId, task);
        sendJson(response, 200, task);
        return;
      }

      if (method === "PATCH") {
        const current = tasks.get(taskId);
        if (current === undefined) {
          sendJson(response, 404, { code: "TASK_NOT_FOUND" });
          return;
        }
        if (!hasJsonContentType(request)) {
          sendJson(response, 415, { code: "UNSUPPORTED_CONTENT_TYPE" });
          return;
        }

        const body = parseJson(await readBody(request));
        if (body === undefined) {
          sendJson(response, 400, { code: "MALFORMED_JSON" });
          return;
        }
        const task: TaskRecord = {
          ...current,
          title: typeof body.title === "string" ? body.title : current.title,
          completed: typeof body.completed === "boolean" ? body.completed : current.completed,
        };
        tasks.set(taskId, task);
        sendJson(response, 200, task);
        return;
      }

      if (method === "DELETE") {
        tasks.delete(taskId);
        response.writeHead(204);
        response.end();
        return;
      }

      sendJson(
        response,
        405,
        { code: "METHOD_NOT_ALLOWED" },
        { allow: "GET, PUT, PATCH, DELETE" },
      );
      return;
    }

    sendJson(response, 404, { code: "ROUTE_NOT_FOUND" });
    })().catch((error: unknown) => {
      if (response.headersSent) {
        response.destroy(error instanceof Error ? error : undefined);
        return;
      }

      if (error instanceof RequestBodyTooLargeError) {
        sendJson(response, 413, { code: "PAYLOAD_TOO_LARGE" });
        return;
      }

      sendJson(response, 500, { code: "INTERNAL_SERVER_ERROR" });
    });
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      server.off("error", reject);
      resolve();
    });
  });

  const address = server.address();
  if (address === null || typeof address === "string") {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    throw new Error("Local API did not receive a TCP address");
  }

  let closePromise: Promise<void> | undefined;

  return {
    baseURL: `http://127.0.0.1:${address.port}`,
    close: () => {
      closePromise ??= new Promise<void>((resolve, reject) => {
        server.close((error) => error === undefined ? resolve() : reject(error));
      });
      return closePromise;
    },
  };
};
