import { expect, test } from "@playwright/test";

test("сохраняет идентичность, steps и безопасный контекст", async ({}, testInfo) => {
  testInfo.annotations.push({ type: "owner", description: "payments-qa" });
  testInfo.annotations.push({ type: "environment", description: "local" });

  const status = await test.step(
    "Получить состояние task-229",
    async (): Promise<"ready"> => "ready",
  );
  await test.step("Проверить бизнес-статус task-229", async () => {
    expect(status).toBe("ready");
  });

  expect(testInfo.title).toContain("идентичность");
  expect(testInfo.annotations).toContainEqual({ type: "owner", description: "payments-qa" });
});
