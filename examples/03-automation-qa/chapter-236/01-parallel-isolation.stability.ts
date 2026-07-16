import { rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { expect, test, type TestInfo } from "@playwright/test";

async function useOwnedFile(testInfo: TestInfo): Promise<void> {
  const filePath = testInfo.outputPath("owned-resource.json");
  await writeFile(filePath, JSON.stringify({ title: testInfo.title }), "utf8");
  expect(existsSync(filePath)).toBe(true);
  await rm(filePath, { force: true });
  expect(existsSync(filePath)).toBe(false);
}

test.describe.configure({ mode: "parallel" });

test("первый тест владеет своим файлом", async ({}, testInfo) => {
  await useOwnedFile(testInfo);
});

test("второй тест владеет своим файлом", async ({}, testInfo) => {
  await useOwnedFile(testInfo);
});
