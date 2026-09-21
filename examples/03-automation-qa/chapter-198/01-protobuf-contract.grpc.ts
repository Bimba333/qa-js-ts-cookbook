import { expect, test } from "@playwright/test";

import { readWorkItemsContract } from "../support/sut/contract.js";

test("читает service, rpc и номера полей из proto-контракта", async () => {
  const contract = await readWorkItemsContract();

  // Пакет с версией: несовместимое изменение потребует новой версии,
  // а не тихой правки существующей.
  expect(contract).toContain("package qa.educational.workitems.v1;");

  expect(contract).toContain("service WorkItemService");
  expect(contract).toContain(
    "rpc GetWorkItem(GetWorkItemRequest) returns (WorkItem);",
  );

  // Номера полей — часть контракта на уровне байтов. Имя поля можно изменить,
  // номер — нельзя: по нему стороны и находят значение.
  expect(contract).toMatch(/string id = 1;/);
  expect(contract).toMatch(/string title = 2;/);
  expect(contract).toMatch(/WorkItemStatus status = 4;/);
  expect(contract).toMatch(/int32 version = 12;/);

  // Нулевое значение enum зарезервировано за «не задано».
  expect(contract).toContain("WORK_ITEM_STATUS_UNSPECIFIED = 0;");
});
