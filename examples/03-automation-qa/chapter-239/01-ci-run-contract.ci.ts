import assert from "node:assert/strict";

type StageResult = Readonly<{
  name: string;
  exitCode: number;
}>;

type CiRunContract = Readonly<{
  runtimeVersion: string;
  cleanRunner: true;
  timeoutMinutes: number;
  stages: readonly StageResult[];
}>;

type CiRunResult = Readonly<{
  conclusion: "passed" | "failed";
  completedStages: readonly string[];
  exitCode: number;
  failedStage: string | null;
}>;

export function executeCiContract(contract: CiRunContract): CiRunResult {
  if (!Number.isInteger(contract.timeoutMinutes) || contract.timeoutMinutes <= 0 || contract.timeoutMinutes > 60) {
    throw new Error("CI timeout должен быть целым числом от 1 до 60 минут");
  }

  const completedStages: string[] = [];

  for (const stage of contract.stages) {
    completedStages.push(stage.name);
    if (stage.exitCode !== 0) {
      return {
        conclusion: "failed",
        completedStages,
        exitCode: stage.exitCode,
        failedStage: stage.name,
      };
    }
  }

  return { conclusion: "passed", completedStages, exitCode: 0, failedStage: null };
}

const result = executeCiContract({
  runtimeVersion: "22",
  cleanRunner: true,
  timeoutMinutes: 20,
  stages: [
    { name: "npm ci", exitCode: 0 },
    { name: "static checks", exitCode: 2 },
    { name: "tests", exitCode: 0 },
  ],
});

assert.deepEqual(result, {
  conclusion: "failed",
  completedStages: ["npm ci", "static checks"],
  exitCode: 2,
  failedStage: "static checks",
});

assert.throws(
  () => executeCiContract({ runtimeVersion: "22", cleanRunner: true, timeoutMinutes: 0, stages: [] }),
  /timeout/,
);

assert.throws(
  () => executeCiContract({ runtimeVersion: "22", cleanRunner: true, timeoutMinutes: 61, stages: [] }),
  /timeout/,
);

console.log("CI contract: PASS");
