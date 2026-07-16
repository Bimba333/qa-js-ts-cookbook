import { createHash } from "node:crypto";
import type { TestInfo } from "@playwright/test";

function boundedSlug(value: string, maxLength: number): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLength);
  return slug || "test";
}

function shortHash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

export function createExecutionIdentity(testInfo: TestInfo): string {
  const shard = testInfo.config.shard;
  const shardIdentity = shard === null ? "s-local" : `s${shard.current}of${shard.total}`;
  const logicalTestIdentity = [testInfo.project.name, ...testInfo.titlePath].join("\u001f");

  return [
    boundedSlug(testInfo.project.name, 20),
    shardIdentity,
    `p${testInfo.parallelIndex}`,
    `w${testInfo.workerIndex}`,
    `e${testInfo.repeatEachIndex}`,
    `r${testInfo.retry}`,
    boundedSlug(testInfo.title, 24),
    shortHash(logicalTestIdentity),
  ].join("-");
}
