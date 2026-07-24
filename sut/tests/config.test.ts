import assert from "node:assert/strict";
import test from "node:test";

import {
  loadDatabaseConfig,
  SUTConfigurationError,
} from "../src/config/index.js";

test("принимает безопасную educational конфигурацию", () => {
  const config = loadDatabaseConfig("reader", {
    SUT_MODE: "educational",
    SUT_DB_HOST: "localhost",
    SUT_DB_PORT: "55432",
  });

  assert.equal(config.mode, "educational");
  assert.equal(config.host, "localhost");
  assert.equal(config.user, "sut_reader");
  assert.equal(Object.isFrozen(config), true);

  const containerConfig = loadDatabaseConfig("migration", {
    SUT_MODE: "educational",
    SUT_DB_HOST: "postgres",
    SUT_DB_PORT: "5432",
  });
  assert.equal(containerConfig.host, "postgres");
  assert.equal(containerConfig.port, 5432);
});

test("отклоняет внешний PostgreSQL host", () => {
  assert.throws(
    () =>
      loadDatabaseConfig("migration", {
        SUT_MODE: "educational",
        SUT_DB_HOST: "database.example.com",
      }),
    (error: unknown) =>
      error instanceof SUTConfigurationError &&
      error.code === "invalid_local_target",
  );
});

test("отклоняет production mode", () => {
  assert.throws(
    () =>
      loadDatabaseConfig("application", {
        SUT_MODE: "production",
      }),
    (error: unknown) =>
      error instanceof SUTConfigurationError &&
      error.code === "unsupported_mode",
  );
});

test("не раскрывает raw password в ошибках", () => {
  const marker = "private-password-marker";
  let captured: unknown;

  try {
    loadDatabaseConfig("reader", {
      SUT_MODE: "educational",
      SUT_DB_READER_PASSWORD: marker,
      SUT_DB_PORT: "invalid",
    });
  } catch (error) {
    captured = error;
  }

  assert.ok(captured instanceof Error);
  assert.equal(captured.message.includes(marker), false);
});

test("отклоняет подмену разрешённой service role", () => {
  assert.throws(
    () =>
      loadDatabaseConfig("reader", {
        SUT_MODE: "educational",
        SUT_DB_READER_USER: "sut_bootstrap",
      }),
    (error: unknown) =>
      error instanceof SUTConfigurationError &&
      error.code === "invalid_role" &&
      error.key === "SUT_DB_READER_USER",
  );
});

test("проверяет port и database timeout ranges", () => {
  for (const source of [
    { SUT_DB_PORT: "0" },
    { SUT_DB_PORT: "65536" },
    { SUT_DB_CONNECTION_TIMEOUT_MS: "99" },
    { SUT_DB_STATEMENT_TIMEOUT_MS: "60001" },
  ]) {
    assert.throws(
      () =>
        loadDatabaseConfig("reader", {
          SUT_MODE: "educational",
          ...source,
        }),
      (error: unknown) =>
        error instanceof SUTConfigurationError &&
        error.code === "invalid_integer",
    );
  }
});

test("отклоняет неизвестную runtime database role", () => {
  assert.throws(
    () =>
      loadDatabaseConfig(
        "bootstrap" as Parameters<typeof loadDatabaseConfig>[0],
        { SUT_MODE: "educational" },
      ),
    (error: unknown) =>
      error instanceof SUTConfigurationError &&
      error.code === "invalid_role",
  );
});
