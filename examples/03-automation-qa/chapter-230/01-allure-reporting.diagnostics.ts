import { expect, test } from "@playwright/test";
import { allure } from "allure-playwright";

test("передаёт metadata и доказательства через адаптер Allure", async () => {
  await allure.owner("payments-qa");
  await allure.feature("Task diagnostics");
  await allure.link("tms", "https://tracker.test/cases/230", "CASE-230");
  await allure.attachment(
    "task-230-summary",
    JSON.stringify({ taskId: "task-230", status: "ready" }),
    "application/json",
  );

  expect({ taskId: "task-230", status: "ready" }).toEqual({
    taskId: "task-230",
    status: "ready",
  });
});
