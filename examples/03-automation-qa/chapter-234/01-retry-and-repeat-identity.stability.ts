import { expect, test } from "@playwright/test";
import { createExecutionIdentity } from "../support/stability/execution-identity.js";

test("различает retry и repeat identity", async ({}, testInfo) => {
  const identity = createExecutionIdentity(testInfo);
  expect(testInfo.retry).toBe(0);
  expect(identity).toContain(`e${testInfo.repeatEachIndex}`);
  expect(identity).toContain("r0");
});
