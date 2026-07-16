import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

test("читает service, rpc и номера полей из proto-контракта", async () => {
  const protoPath = fileURLToPath(new URL("../proto/tasks.proto", import.meta.url));
  const contract = await readFile(protoPath, "utf8");

  expect(contract).toContain("service TaskService");
  expect(contract).toContain("rpc CreateTask(CreateTaskRequest) returns (Task)");
  expect(contract).toMatch(/string id = 1;/);
  expect(contract).toMatch(/string title = 2;/);
  expect(contract).toMatch(/repeated string labels = 4;/);
});
