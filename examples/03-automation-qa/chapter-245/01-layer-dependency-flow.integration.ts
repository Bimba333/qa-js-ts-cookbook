import { expect, test } from "../support/integration/fixtures.js";

test("использует публичные контракты слоёв через composition root", async ({ framework }) => {
  const created = await framework.api.create({ id: "task-245", title: "Dependency flow" });
  framework.registerOwnedTask(created.id);

  const grpcView = await framework.grpc.get(created.id);
  const databaseView = await framework.database.find(created.id);

  expect(grpcView).toEqual(created);
  expect(databaseView).toEqual(created);
});
