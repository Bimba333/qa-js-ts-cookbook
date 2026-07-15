async function runScenario(
  execute: () => Promise<void>,
  cleanup: () => Promise<void>,
): Promise<void> {
  let executionFailed = false;
  let executionError: unknown;

  try {
    await execute();
  } catch (error) {
    executionFailed = true;
    executionError = error;
  }

  try {
    await cleanup();
  } catch (cleanupError) {
    if (executionFailed) {
      throw new AggregateError(
        [executionError, cleanupError],
        "Сценарий и cleanup завершились с ошибками",
      );
    }

    throw cleanupError;
  }

  if (executionFailed) {
    throw executionError;
  }
}

await runScenario(
  async () => {
    console.log("Сценарий выполнен");
  },
  async () => {
    console.log("Данные очищены");
  },
);

try {
  await runScenario(
    async () => {
      throw new Error("Ошибка сценария");
    },
    async () => {
      throw new Error("Ошибка cleanup");
    },
  );
} catch (error) {
  if (error instanceof AggregateError) {
    console.log(`Сохранено ошибок: ${error.errors.length}`);
  }
}
