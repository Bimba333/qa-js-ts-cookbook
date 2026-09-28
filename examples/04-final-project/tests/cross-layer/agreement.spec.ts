import { expect, test } from "../../src/fixtures/cross-layer-fixture.js";
import { fromGrpc, fromRest, fromRow } from "../../src/scenarios/index.js";

test("три слоя описывают одну запись одинаково", async ({ layers }) => {
  const title = layers.identity.next("agreement");
  const created = await layers.rest.create({
    title,
    description: "Сравнение представлений трёх слоёв",
    priority: "HIGH",
  });

  expect(created.ok).toBe(true);

  if (!created.ok) return;

  layers.owned.own(`задача ${created.value.id}`, async () => {
    await layers.rest.remove(created.value.id);
  });

  const viaRest = fromRest(created.value, created.value.createdAt);

  const grpcResult = await layers.readGrpc(created.value.id);

  expect(grpcResult.ok).toBe(true);

  if (!grpcResult.ok) return;

  const viaGrpc = fromGrpc(grpcResult.value);

  const row = await layers.repository.findById(created.value.id);

  expect(row).toBeDefined();

  if (!row) return;

  const viaDatabase = fromRow(row);

  // Сравниваются канонические модели, а не сырые ответы: время приходит
  // строкой из REST и gRPC и объектом Date из базы.
  expect(viaGrpc).toEqual(viaRest);
  expect(viaDatabase).toEqual(viaRest);
});

test("переход виден всеми слоями и согласован по версии", async ({ layers }) => {
  const created = await layers.rest.create({
    title: layers.identity.next("transition"),
    description: "Согласованность после изменения",
    priority: "LOW",
  });

  expect(created.ok).toBe(true);

  if (!created.ok) return;

  layers.owned.own(`задача ${created.value.id}`, async () => {
    await layers.rest.remove(created.value.id);
  });

  const moved = await layers.rest.transition(
    created.value.id,
    "IN_PROGRESS",
    created.value.version,
  );

  expect(moved.ok).toBe(true);

  if (!moved.ok) return;

  const grpcResult = await layers.readGrpc(created.value.id);
  const row = await layers.repository.findById(created.value.id);

  expect(grpcResult.ok).toBe(true);
  expect(row).toBeDefined();

  if (!grpcResult.ok || !row) return;

  const viaGrpc = fromGrpc(grpcResult.value);
  const viaDatabase = fromRow(row);

  expect(viaGrpc.status).toBe("IN_PROGRESS");
  expect(viaDatabase.status).toBe("IN_PROGRESS");
  // Версия — общий признак согласованности: слой, отставший на одно
  // изменение, обнаружится именно здесь.
  expect(viaGrpc.version).toBe(moved.value.version);
  expect(viaDatabase.version).toBe(moved.value.version);
});
