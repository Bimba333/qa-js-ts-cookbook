import { rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { expect, test } from "@playwright/test";

test("копирует вложение и удаляет временный исходный файл", async ({}, testInfo) => {
  const sourcePath = testInfo.outputPath("task-228-response.json");
  const safePayload = JSON.stringify({ taskId: "task-228", status: "ready" }, null, 2);

  await writeFile(sourcePath, safePayload, "utf8");
  try {
    await testInfo.attach("task-228-response", {
      path: sourcePath,
      contentType: "application/json",
    });
  } finally {
    await rm(sourcePath, { force: true });
  }

  expect(existsSync(sourcePath)).toBe(false);
});
