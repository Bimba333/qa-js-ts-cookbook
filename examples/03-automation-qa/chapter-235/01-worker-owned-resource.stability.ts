import { expect, test } from "@playwright/test";
import { createExecutionIdentity } from "../support/stability/execution-identity.js";

test("создаёт bounded identity владельца ресурса", async ({}, testInfo) => {
  const resourceId = `account-${createExecutionIdentity(testInfo)}`;
  expect(resourceId.length).toBeLessThan(128);
  expect(resourceId).toContain(`p${testInfo.parallelIndex}`);
  expect(resourceId).toContain(`w${testInfo.workerIndex}`);
  expect(resourceId).toContain(
    testInfo.config.shard === null
      ? "s-local"
      : `s${testInfo.config.shard.current}of${testInfo.config.shard.total}`,
  );
  expect(resourceId).toMatch(/-[a-f0-9]{12}$/);
  expect(resourceId).not.toContain("/");
});
