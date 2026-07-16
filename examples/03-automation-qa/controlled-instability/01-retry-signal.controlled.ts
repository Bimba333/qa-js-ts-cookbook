import { rm, writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import { createExecutionIdentity } from "../support/stability/execution-identity.js";

test("первая попытка падает, retry проходит", async ({}, testInfo) => {
  const evidence = {
    retry: testInfo.retry,
    repeat: testInfo.repeatEachIndex,
    worker: testInfo.workerIndex,
    identity: createExecutionIdentity(testInfo),
  };
  const attemptState = testInfo.outputPath("attempt-state.json");
  await writeFile(attemptState, JSON.stringify(evidence), "utf8");

  try {
    await testInfo.attach(`attempt-${testInfo.retry}`, {
      path: attemptState,
      contentType: "application/json",
    });
    expect(testInfo.retry, "controlled retry signal").toBe(1);
  } finally {
    await rm(attemptState, { force: true });
  }
});
