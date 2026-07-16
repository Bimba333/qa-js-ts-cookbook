import { rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const supportDirectory = dirname(fileURLToPath(import.meta.url));
const stabilityOutputDirectory = resolve(supportDirectory, "../../../../test-results/stability");
const controlledReport = resolve(stabilityOutputDirectory, "controlled-results.json");

if (dirname(controlledReport) !== stabilityOutputDirectory) {
  throw new Error("Controlled report вышел за границу module-owned output");
}

export default async function prepareStabilityOutput(): Promise<void> {
  await rm(controlledReport, { force: true });
}
