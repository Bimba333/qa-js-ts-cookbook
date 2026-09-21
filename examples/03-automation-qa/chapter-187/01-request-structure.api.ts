import { expect, test } from "../support/sut/fixtures.js";
import { toCreatorTestId } from "../support/sut/work-items-api.js";

test("передаёт query, headers и JSON body", async ({ workItems }, testInfo) => {
  // Заголовок влияет на результат: сервер сохраняет идентификатор теста
  // рядом с записью, поэтому след запроса виден в ответе.
  const created = await workItems.createOrThrow({
    title: "Запись со структурой запроса",
    description: "Тело запроса определяет содержимое ресурса",
    priority: "HIGH",
  });

  expect(created.creatorTestId).toBe(toCreatorTestId(testInfo.title));
  expect(created.priority).toBe("HIGH");
  expect(created.title).toBe("Запись со структурой запроса");

  // Query-параметры не меняют состояние, а сужают выборку.
  const filtered = await workItems.listOrThrow({
    status: "NEW",
    priority: "HIGH",
    limit: 5,
  });

  expect(filtered.limit).toBe(5);
  expect(filtered.items.length).toBeLessThanOrEqual(5);
  expect(
    filtered.items.every(
      (item) => item.status === "NEW" && item.priority === "HIGH",
    ),
  ).toBe(true);
});
