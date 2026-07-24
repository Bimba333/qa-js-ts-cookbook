import { expect, test } from "@playwright/test";

import { validateRuntimeConfig } from "../../src/config/index.js";
import {
  createFoundation,
  ResourceScope,
} from "../../src/composition/index.js";

const VALID_SOURCE = Object.freeze({
  QA_PROFILE: "local",
  QA_UI_BASE_URL: "https://ui.example.invalid",
  QA_REST_BASE_URL: "https://rest.example.invalid",
  QA_GRPC_TARGET: "grpc.example.invalid:443",
  QA_POSTGRES_CONNECTION_REF: "secret://local/postgres",
  QA_CREDENTIALS_REF: "secret://local/qa-credentials",
  CI: "false",
});

test("Composition Root выдаёт только минимальный контекст", async () => {
  const runtime = createFoundation(validateRuntimeConfig(VALID_SOURCE));

  expect(Object.keys(runtime.context).sort()).toEqual(["config", "isCi", "profile"]);
  expect(Object.isFrozen(runtime.context)).toBe(true);
  expect(runtime.context.profile).toBe("local");

  await runtime.close();
});

test("очистка выполняется в обратном порядке регистрации", async () => {
  const scope = new ResourceScope();
  const calls: string[] = [];

  scope.register(() => {
    calls.push("first");
  });
  scope.register(() => {
    calls.push("second");
  });
  await scope.close();

  expect(calls).toEqual(["second", "first"]);
});

test("частичное построение очищает уже полученные ресурсы", async () => {
  const scope = new ResourceScope();
  const constructionError = new Error("construction failed");
  let released = false;

  scope.register(() => {
    released = true;
  });

  await expect(scope.close(constructionError)).rejects.toBe(constructionError);
  expect(released).toBe(true);
});

test("основная ошибка и ошибка очистки остаются наблюдаемыми", async () => {
  const scope = new ResourceScope();
  const primaryError = new Error("primary failed");
  const cleanupError = new Error("cleanup failed");

  scope.register(() => {
    throw cleanupError;
  });

  let captured: unknown;

  try {
    await scope.close(primaryError);
  } catch (error) {
    captured = error;
  }

  expect(captured).toBeInstanceOf(AggregateError);
  if (!(captured instanceof AggregateError)) {
    throw new Error("Ожидался AggregateError");
  }
  expect(captured.errors).toEqual([primaryError, cleanupError]);
});

test("выполняет всю очистку и сохраняет детерминированный порядок ошибок", async () => {
  const scope = new ResourceScope();
  const firstError = new Error("first cleanup failed");
  const secondError = new Error("second cleanup failed");
  const calls: string[] = [];

  scope.register(() => {
    calls.push("first");
    throw firstError;
  });
  scope.register(async () => {
    calls.push("second");
    await Promise.resolve();
    throw secondError;
  });
  scope.register(() => {
    calls.push("third");
  });

  let captured: unknown;

  try {
    await scope.close();
  } catch (error) {
    captured = error;
  }

  expect(calls).toEqual(["third", "second", "first"]);
  expect(captured).toBeInstanceOf(AggregateError);
  if (!(captured instanceof AggregateError)) {
    throw new Error("Ожидался AggregateError");
  }
  expect(captured.errors).toEqual([secondError, firstError]);
});

test("явно обрабатывает пустую область и операции после закрытия", async () => {
  const scope = new ResourceScope();

  await scope.close();

  expect(() => scope.register(() => {})).toThrow(
    "Нельзя зарегистрировать cleanup после закрытия ResourceScope",
  );
  await expect(scope.close()).rejects.toThrow("ResourceScope уже закрыт");
});

test("сохраняет явно переданный undefined как основную ошибку", async () => {
  const scope = new ResourceScope();
  let caught = false;

  try {
    await scope.close(undefined);
  } catch (error) {
    caught = true;
    expect(error).toBeUndefined();
  }

  expect(caught).toBe(true);
});
