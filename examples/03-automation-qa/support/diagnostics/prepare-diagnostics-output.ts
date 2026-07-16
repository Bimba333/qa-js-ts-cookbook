import { rm } from "node:fs/promises";
import { resolve } from "node:path";

export default async function prepareDiagnosticsOutput(): Promise<void> {
  const allureResultsDir = resolve("test-results/diagnostics/allure-results");
  await rm(allureResultsDir, { recursive: true, force: true });
}
