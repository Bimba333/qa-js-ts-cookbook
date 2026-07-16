import { expect, test } from "../support/integration/fixtures.js";
import { loadRuntimeConfig } from "../support/execution/runtime-config.js";
import { createFramework } from "../support/integration/composition-root.js";

test("проводит одну entity через слои и очищает только owned data", async ({ framework }) => {
  const id = "task-247";

  const result = await framework.tasks.createCloseAndVerify(id, "Lifecycle");

  expect(result).toEqual({ id, title: "Lifecycle", status: "closed" });
  expect(await framework.database.find(id)).toEqual(result);
});

test("сохраняет исходную ошибку как cause", async ({ framework }) => {
  const id = "task-247-duplicate";
  await framework.api.create({ id, title: "First" });
  framework.registerOwnedTask(id);

  await expect(framework.tasks.createCloseAndVerify(id, "Second")).rejects.toMatchObject({
    message: `Не удалось выполнить сценарий для ${id}`,
    cause: expect.objectContaining({ message: `Task ${id} уже существует` }),
  });
});

test("удаляет зарегистрированную entity при закрытии context", async () => {
  const framework = createFramework(loadRuntimeConfig({
    QA_ENV: "local",
    QA_API_BASE_URL: "https://integration.qa.test",
    QA_API_TOKEN: "test-only-token",
  }), "cleanup-check");
  const id = "task-247-cleanup";
  await framework.api.create({ id, title: "Cleanup" });
  framework.registerOwnedTask(id);

  await framework.close();

  expect(await framework.database.find(id)).toBeNull();
});
