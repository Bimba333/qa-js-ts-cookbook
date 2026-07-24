import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";

const testDirectory = path.resolve(process.cwd(), ".sut-build/tests");
const testFiles = readdirSync(testDirectory)
  .filter((filename) => filename.endsWith(".test.js"))
  .sort()
  .map((filename) => path.join(testDirectory, filename));

if (testFiles.length === 0) {
  throw new Error("No compiled SUT database tests found");
}

const result = spawnSync(
  process.execPath,
  ["--test", "--test-concurrency=1", ...testFiles],
  {
    cwd: process.cwd(),
    stdio: "inherit",
    timeout: 120_000,
    killSignal: "SIGTERM",
  },
);

if (result.error) throw result.error;
if (result.status !== 0) process.exitCode = result.status ?? 1;
