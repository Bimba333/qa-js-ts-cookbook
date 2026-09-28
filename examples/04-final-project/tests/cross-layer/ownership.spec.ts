import { expect, test } from "../../src/fixtures/cross-layer-fixture.js";
import { OwnedData } from "../../src/test-data/index.js";

test("уникальная идентичность содержит признаки прогона", async ({ layers }) => {
  const first = layers.identity.next("alpha");
  const second = layers.identity.next("alpha");

  expect(first).not.toBe(second);
  expect(first.startsWith(layers.identity.prefix)).toBe(true);
  // Имя диагностируемо: по оставшейся записи видно проект, процесс и повтор.
  // Сверяется форма, а не числа: индексы зависят от расписания запуска.
  expect(layers.identity.prefix).toMatch(/^fp-cross-layer-w\d+-r\d+-[0-9a-z]{8}$/);
});

test("данные исчезают даже после падения сценария", async ({ layers }) => {
  const created = await layers.rest.create({
    title: layers.identity.next("failure"),
    description: "Проверка очистки при отказе",
    priority: "LOW",
  });

  expect(created.ok).toBe(true);

  if (!created.ok) return;

  const id = created.value.id;
  const owned = new OwnedData();

  owned.own(`задача ${id}`, async () => {
    await layers.rest.remove(id);
  });

  // Контролируемое падение: сценарий не валится, но проходит ту же ветку,
  // что и настоящий отказ.
  let raised: unknown;

  try {
    await owned.release(new Error("шаг сценария не выполнен"));
  } catch (error) {
    raised = error;
  }

  expect(raised).toBeInstanceOf(Error);
  expect((raised as Error).message).toBe("шаг сценария не выполнен");

  // Главная проверка: запись удалена, хотя сценарий завершился ошибкой.
  const row = await layers.repository.findById(id);

  expect(row).toBe(undefined);
});

test("ошибка очистки не скрывает исходную ошибку", async () => {
  const owned = new OwnedData();

  owned.own("первый ресурс", () => {
    throw new Error("очистка первого не удалась");
  });

  let raised: unknown;

  try {
    await owned.release(new Error("исходная ошибка сценария"));
  } catch (error) {
    raised = error;
  }

  expect(raised).toBeInstanceOf(AggregateError);

  const aggregate = raised as AggregateError;

  // Исходная ошибка стоит первой: отчёт покажет причину падения, а не
  // последствие.
  expect((aggregate.errors[0] as Error).message).toBe("исходная ошибка сценария");
  expect(aggregate.errors.length).toBe(2);
});
