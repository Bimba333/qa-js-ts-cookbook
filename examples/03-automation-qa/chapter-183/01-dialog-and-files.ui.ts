import { readFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

const uploadPath = fileURLToPath(new URL("./upload-profile.txt", import.meta.url));

test("обрабатывает dialog до вызвавшего его действия", async ({ page }) => {
  await page.setContent(`
    <button onclick="alert('Профиль сохранён'); document.querySelector('output').textContent = 'Сохранено'">
      Сохранить
    </button>
    <output aria-label="Статус"></output>
  `);

  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toBe("Профиль сохранён");
    await dialog.accept();
  });

  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByLabel("Статус")).toHaveText("Сохранено");
});

test("передаёт локальный файл через input", async ({ page }) => {
  await page.setContent('<label>Профиль <input type="file"></label>');

  await page.getByLabel("Профиль").setInputFiles(uploadPath);

  await expect(page.getByLabel("Профиль")).toHaveValue(/upload-profile\.txt$/);
});

test("сохраняет download во временный путь и удаляет артефакт", async ({ page }) => {
  await page.setContent(`
    <a download="report.txt" href="data:text/plain,QA%20report">Скачать отчёт</a>
  `);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Скачать отчёт" }).click();
  const download = await downloadPromise;
  const temporaryPath = test.info().outputPath(download.suggestedFilename());

  try {
    await download.saveAs(temporaryPath);
    expect(await readFile(temporaryPath, "utf8")).toBe("QA report");
  } finally {
    await rm(temporaryPath, { force: true });
  }
});
