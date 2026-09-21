/**
 * Прогоняет примеры глав Automation QA против учебного стенда.
 *
 * Скрипт сначала убеждается, что стенд готов: иначе десятки тестов упали бы
 * с невнятной ошибкой соединения вместо одного понятного сообщения.
 */
import { spawnSync } from "node:child_process";
import process from "node:process";

const HEALTH_URL =
  `${process.env.SUT_BASE_URL ?? "http://127.0.0.1:4310"}/health/ready`;

const TYPECHECK_CONFIGS = [
  "examples/03-automation-qa/tsconfig.api-foundations.json",
  "examples/03-automation-qa/tsconfig.grpc.json",
  "examples/03-automation-qa/tsconfig.postgresql.json",
  "examples/03-automation-qa/tsconfig.ui-layer.json",
];

const TEST_GROUPS = [
  { name: "Playwright: основы", config: "examples/03-automation-qa/playwright.config.ts" },
  { name: "UI-слой", config: "examples/03-automation-qa/playwright.ui-layer.config.ts" },
  { name: "API", config: "examples/03-automation-qa/playwright.api-foundations.config.ts" },
  { name: "gRPC", config: "examples/03-automation-qa/playwright.grpc.config.ts" },
  { name: "PostgreSQL", config: "examples/03-automation-qa/playwright.postgresql.config.ts" },
];

const typecheckOnly = process.argv.includes("--typecheck-only");

async function assertStandIsReady() {
  let readiness;

  try {
    const response = await fetch(HEALTH_URL);
    readiness = await response.json();

    if (!response.ok || readiness.status !== "PASS") {
      throw new Error(JSON.stringify(readiness));
    }
  } catch (error) {
    process.stderr.write(
      `\nУчебный стенд не готов (${HEALTH_URL}).\n` +
        `Поднимите его командой:\n\n  npm run sut:up\n\n` +
        `Подробности: ${error instanceof Error ? error.message : String(error)}\n\n`,
    );
    process.exit(1);
  }
}

function run(label, command, args) {
  process.stdout.write(`\n── ${label}\n`);
  const result = spawnSync(command, args, { stdio: "inherit", shell: false });

  return result.status === 0;
}

const failures = [];

for (const config of TYPECHECK_CONFIGS) {
  if (!run(`Проверка типов: ${config}`, "npx", ["tsc", "-p", config])) {
    failures.push(`типы: ${config}`);
  }
}

if (!typecheckOnly) {
  await assertStandIsReady();

  for (const group of TEST_GROUPS) {
    if (!run(`Тесты: ${group.name}`, "npx", ["playwright", "test", `--config=${group.config}`])) {
      failures.push(`тесты: ${group.name}`);
    }
  }
}

process.stdout.write("\n");

if (failures.length > 0) {
  process.stdout.write(`Не прошло: ${failures.join(", ")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("Все группы примеров прошли\n");
}
