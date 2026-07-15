import { expect, test } from "@playwright/test";
import { startLocalApi } from "../support/local-api.js";

test("проверяет UI-действие через API и очищает данные", async ({ page, request }) => {
  const api = await startLocalApi();
  let taskId: string | undefined;
  try {
    await page.goto(`${api.baseURL}/app`);
    await page.getByRole("button", { name: "Создать задачу" }).click();
    const result = page.locator("output");
    await expect(result).toHaveText(/^task-\d+$/);
    taskId = await result.textContent() ?? undefined;

    expect(taskId).toBeTruthy();
    const response = await request.get(`${api.baseURL}/tasks/${taskId}`);
    expect(await response.json()).toMatchObject({ title: "Создано из UI" });
  } finally {
    if (taskId !== undefined) {
      await request.delete(`${api.baseURL}/tasks/${taskId}`);
    }
    await api.close();
  }
});
