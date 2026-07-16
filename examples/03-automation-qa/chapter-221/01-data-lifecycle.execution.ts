import { expect, test } from "@playwright/test";
import { ResourceScope, usingResources } from "../support/execution/resource-scope.js";

test("очищает данные в обратном порядке владения", async () => {
  const events: string[] = [];

  await usingResources(async (scope) => {
    events.push("create-parent");
    scope.register(() => {
      events.push("delete-parent");
    });

    events.push("create-child");
    scope.register(() => {
      events.push("delete-child");
    });
  });

  expect(events).toEqual([
    "create-parent",
    "create-child",
    "delete-child",
    "delete-parent",
  ]);

  const scope = new ResourceScope();
  let cleanupCalls = 0;
  scope.register(() => {
    cleanupCalls += 1;
  });
  await scope.close();
  await scope.close();

  expect(cleanupCalls).toBe(1);
  expect(() => scope.register(() => undefined)).toThrow(
    "Нельзя зарегистрировать cleanup после закрытия ResourceScope",
  );
});

test("сохраняет ошибку сценария и все ошибки cleanup", async () => {
  let capturedError: unknown;

  try {
    await usingResources(async (scope) => {
      scope.register(() => {
        throw new Error("first cleanup failed");
      });
      scope.register(() => {
        throw new Error("second cleanup failed");
      });
      throw new Error("scenario failed");
    });
  } catch (error) {
    capturedError = error;
  }

  expect(capturedError).toBeInstanceOf(AggregateError);
  if (!(capturedError instanceof AggregateError)) {
    throw new Error("Ожидался AggregateError");
  }
  expect(capturedError.errors).toEqual([
    expect.objectContaining({ message: "scenario failed" }),
    expect.objectContaining({ message: "second cleanup failed" }),
    expect.objectContaining({ message: "first cleanup failed" }),
  ]);
});
