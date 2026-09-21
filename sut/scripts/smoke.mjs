/**
 * Сквозная проверка учебного стенда.
 *
 * Скрипт обращается только к публичным границам SUT: HTTP, REST, gRPC и
 * read-only подключение к PostgreSQL. Внутренние модули приложения он не
 * импортирует — ровно так же, как это будет делать тестовый framework.
 */
import assert from "node:assert/strict";
import path from "node:path";
import process from "node:process";

import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import pg from "pg";

const HTTP_BASE = process.env.SUT_HTTP_BASE ?? "http://127.0.0.1:4310";
const GRPC_TARGET = process.env.SUT_GRPC_TARGET ?? "127.0.0.1:4311";
const CREATOR_TEST_ID = "smoke.suite";

const checks = [];

async function check(name, operation) {
  try {
    await operation();
    checks.push({ name, status: "PASS" });
    process.stdout.write(`  PASS  ${name}\n`);
  } catch (error) {
    checks.push({ name, status: "FAIL", message: error.message });
    process.stdout.write(`  FAIL  ${name}\n        ${error.message}\n`);
  }
}

async function api(pathname, options = {}) {
  const response = await fetch(`${HTTP_BASE}${pathname}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      "x-creator-test-id": CREATOR_TEST_ID,
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const body = text.length > 0 ? JSON.parse(text) : null;

  return { status: response.status, body, headers: response.headers };
}

function authHeaders(token) {
  return { authorization: `Bearer ${token}` };
}

function loadGrpcClient() {
  const protoPath = path.resolve(
    process.cwd(),
    "sut/contracts/proto/work_items.proto",
  );
  const definition = protoLoader.loadSync(protoPath, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });
  const loaded = grpc.loadPackageDefinition(definition);
  const Service = loaded.qa.educational.workitems.v1.WorkItemService;

  return new Service(GRPC_TARGET, grpc.credentials.createInsecure());
}

function callUnary(client, method, request, token, correlationId) {
  return new Promise((resolve, reject) => {
    const metadata = new grpc.Metadata();
    metadata.set("authorization", `Bearer ${token}`);
    metadata.set("correlation-id", correlationId);
    metadata.set("creator-test-id", CREATOR_TEST_ID);

    const deadline = new Date(Date.now() + 5_000);

    client[method](request, metadata, { deadline }, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
}

async function main() {
  process.stdout.write("Учебный SUT: сквозная проверка\n\n");

  // --- Готовность -------------------------------------------------------
  let token;
  let testRunId;

  await check("health/ready отвечает PASS", async () => {
    const response = await api("/health/ready");
    assert.equal(response.status, 200);
    assert.equal(response.body.status, "PASS");
  });

  await check("REST выдаёт bearer token и test run", async () => {
    const response = await api("/api/v1/auth/token", {
      method: "POST",
      body: JSON.stringify({
        login: "educational_tester",
        password: "educational-tester-password",
      }),
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.tokenType, "Bearer");
    assert.ok(response.body.testRunId, "ожидался testRunId");
    token = response.body.accessToken;
    testRunId = response.body.testRunId;
  });

  await check("неверный пароль возвращает 401", async () => {
    const response = await api("/api/v1/auth/token", {
      method: "POST",
      body: JSON.stringify({
        login: "educational_tester",
        password: "wrong-password",
      }),
    });

    assert.equal(response.status, 401);
    assert.equal(response.body.code, "UNAUTHENTICATED");
  });

  await check("отключённый пользователь не получает токен", async () => {
    const response = await api("/api/v1/auth/token", {
      method: "POST",
      body: JSON.stringify({
        login: "educational_disabled",
        password: "educational-disabled-password",
      }),
    });

    assert.equal(response.status, 401);
  });

  // --- Чтение seed ------------------------------------------------------
  await check("список отдаёт наполненный seed с пагинацией", async () => {
    const response = await api("/api/v1/work-items?limit=10", {
      headers: authHeaders(token),
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.items.length, 10);
    assert.ok(
      response.body.total >= 200,
      `ожидалась наполненная база, получено ${response.body.total}`,
    );
  });

  await check("фильтр по статусу сужает выборку", async () => {
    const response = await api("/api/v1/work-items?status=DONE&limit=5", {
      headers: authHeaders(token),
    });

    assert.equal(response.status, 200);
    assert.ok(response.body.items.length > 0);
    assert.ok(response.body.items.every((item) => item.status === "DONE"));
  });

  await check("некорректный фильтр возвращает 400", async () => {
    const response = await api("/api/v1/work-items?status=NOPE", {
      headers: authHeaders(token),
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.code, "VALIDATION_FAILED");
    assert.equal(response.body.field, "status");
  });

  await check("запрос без токена возвращает 401", async () => {
    const response = await api("/api/v1/work-items");
    assert.equal(response.status, 401);
  });

  // --- Жизненный цикл записи -------------------------------------------
  let createdId;

  await check("создание записи возвращает 201 и версию 1", async () => {
    const response = await api("/api/v1/work-items", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        title: "Проверка сквозного сценария",
        description: "Запись создана smoke-проверкой",
        priority: "HIGH",
      }),
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.version, 1);
    assert.equal(response.body.status, "NEW");
    assert.equal(response.body.testRunId, testRunId);
    assert.equal(response.body.creatorTestId, CREATOR_TEST_ID);
    createdId = response.body.id;
  });

  await check("пустой заголовок отклоняется с указанием поля", async () => {
    const response = await api("/api/v1/work-items", {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        title: "   ",
        description: "Описание",
        priority: "LOW",
      }),
    });

    assert.equal(response.status, 400);
    assert.equal(response.body.field, "title");
  });

  await check("устаревшая версия даёт 409", async () => {
    const response = await api(`/api/v1/work-items/${createdId}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ title: "Новый заголовок", expectedVersion: 99 }),
    });

    assert.equal(response.status, 409);
    assert.equal(response.body.code, "VERSION_CONFLICT");
  });

  await check("обновление с верной версией повышает версию", async () => {
    const response = await api(`/api/v1/work-items/${createdId}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({
        title: "Обновлённый заголовок",
        expectedVersion: 1,
      }),
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.version, 2);
    assert.equal(response.body.title, "Обновлённый заголовок");
  });

  await check("недопустимый переход статуса даёт 409", async () => {
    const response = await api(`/api/v1/work-items/${createdId}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ status: "DONE", expectedVersion: 2 }),
    });

    assert.equal(response.status, 409);
    assert.equal(response.body.code, "INVALID_TRANSITION");
  });

  await check("seed-запись защищена от изменения", async () => {
    const list = await api("/api/v1/work-items?limit=1", {
      headers: authHeaders(token),
    });
    const seedItem = list.body.items[0];

    const response = await api(`/api/v1/work-items/${seedItem.id}`, {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({
        title: "Попытка изменить seed",
        expectedVersion: seedItem.version,
      }),
    });

    assert.equal(response.status, 403);
    assert.equal(response.body.code, "SEED_IMMUTABLE");
  });

  // --- gRPC -------------------------------------------------------------
  const grpcClient = loadGrpcClient();

  await check("gRPC GetWorkItem возвращает ту же запись", async () => {
    const item = await callUnary(
      grpcClient,
      "GetWorkItem",
      { id: createdId },
      token,
      "smoke-grpc-get",
    );

    assert.equal(item.id, createdId);
    assert.equal(item.status, "NEW");
    assert.equal(item.version, 2);
  });

  await check("gRPC TransitionWorkItem переводит NEW в IN_PROGRESS", async () => {
    const response = await callUnary(
      grpcClient,
      "TransitionWorkItem",
      { id: createdId, targetStatus: "IN_PROGRESS", expectedVersion: 2 },
      token,
      "smoke-grpc-transition",
    );

    assert.equal(response.item.status, "IN_PROGRESS");
    assert.equal(response.item.version, 3);
  });

  await check(
    "gRPC отклоняет недопустимый переход как FAILED_PRECONDITION",
    async () => {
      await assert.rejects(
        callUnary(
          grpcClient,
          "TransitionWorkItem",
          { id: createdId, targetStatus: "NEW", expectedVersion: 3 },
          token,
          "smoke-grpc-invalid",
        ),
        (error) => {
          assert.equal(error.code, grpc.status.FAILED_PRECONDITION);
          return true;
        },
      );
    },
  );

  await check("gRPC без метаданных возвращает UNAUTHENTICATED", async () => {
    await assert.rejects(
      new Promise((resolve, reject) => {
        grpcClient.GetWorkItem(
          { id: createdId },
          new grpc.Metadata(),
          { deadline: new Date(Date.now() + 5_000) },
          (error, response) => (error ? reject(error) : resolve(response)),
        );
      }),
      (error) => {
        assert.equal(error.code, grpc.status.UNAUTHENTICATED);
        return true;
      },
    );
  });

  // --- Проверка состояния через read-only подключение -------------------
  await check("состояние подтверждается в PostgreSQL", async () => {
    const client = new pg.Client({
      host: "127.0.0.1",
      port: 55_432,
      database: "educational_work_items",
      user: "sut_reader",
      password: "educational_reader_only",
    });

    await client.connect();
    try {
      const row = await client.query(
        "SELECT status, version, test_run_id, creator_test_id FROM work_items WHERE id = $1",
        [createdId],
      );

      assert.equal(row.rows[0].status, "IN_PROGRESS");
      assert.equal(row.rows[0].version, 3);
      assert.equal(row.rows[0].test_run_id, testRunId);
      assert.equal(row.rows[0].creator_test_id, CREATOR_TEST_ID);

      const audit = await client.query(
        "SELECT count(*)::int AS total FROM audit_events WHERE test_run_id = $1",
        [testRunId],
      );
      assert.ok(audit.rows[0].total > 0, "ожидались записи audit trail");
    } finally {
      await client.end();
    }
  });

  // --- UI ---------------------------------------------------------------
  await check("UI: вход создаёт сессию и открывает список", async () => {
    const form = new URLSearchParams({
      login: "educational_tester",
      password: "educational-tester-password",
    });
    const login = await fetch(`${HTTP_BASE}/login`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: form,
      redirect: "manual",
    });

    assert.equal(login.status, 303);
    const cookie = login.headers.get("set-cookie");
    assert.ok(cookie?.includes("HttpOnly"), "cookie должна быть HttpOnly");
    assert.ok(cookie?.includes("SameSite=Lax"), "cookie должна быть SameSite=Lax");

    const list = await fetch(`${HTTP_BASE}/work-items`, {
      headers: { cookie: cookie.split(";")[0] },
    });
    const html = await list.text();

    assert.equal(list.status, 200);
    assert.ok(html.includes("<h1>Задачи</h1>"), "ожидался заголовок списка");
    assert.ok(
      html.includes("&lt;script&gt;"),
      "заголовок с разметкой должен быть экранирован",
    );
  });

  await check("UI: неверные данные показывают ошибку, а не падают", async () => {
    const response = await fetch(`${HTTP_BASE}/login`, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ login: "educational_tester", password: "nope" }),
      redirect: "manual",
    });

    assert.equal(response.status, 401);
    const html = await response.text();
    assert.ok(html.includes('role="alert"'));
  });

  await check("UI: неаутентифицированный запрос уводит на /login", async () => {
    const response = await fetch(`${HTTP_BASE}/work-items`, {
      redirect: "manual",
    });

    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/login");
  });

  // --- Очистка запуска --------------------------------------------------
  await check("cleanup удаляет данные запуска и не трогает seed", async () => {
    const response = await api("/api/v1/test-runs/current/work-items", {
      method: "DELETE",
      headers: authHeaders(token),
    });

    assert.equal(response.status, 200);
    assert.equal(response.body.deletedCount, 1);
    assert.equal(response.body.testRunId, testRunId);

    const seedStillThere = await api("/api/v1/work-items?limit=1", {
      headers: authHeaders(token),
    });
    assert.ok(seedStillThere.body.total >= 200, "seed не должен удаляться");
  });

  grpcClient.close();

  const failed = checks.filter((entry) => entry.status === "FAIL");
  process.stdout.write(
    `\nИтог: ${checks.length - failed.length}/${checks.length} проверок пройдено\n`,
  );

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

await main();
