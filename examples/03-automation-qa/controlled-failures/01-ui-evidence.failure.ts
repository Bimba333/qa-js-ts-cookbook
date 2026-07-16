import { rm, writeFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const sourcePath = testInfo.outputPath("controlled-failure-context.json");
    await writeFile(
      sourcePath,
      JSON.stringify({ caseId: "task-227", expected: "ready", actual: "pending" }),
      "utf8",
    );
    try {
      await testInfo.attach("controlled-failure-context", {
        path: sourcePath,
        contentType: "application/json",
      });
    } finally {
      await rm(sourcePath, { force: true });
    }
  }
});

test("контролируемо сохраняет доказательства UI при падении", async ({ page }) => {
  await page.setContent('<main><p role="status">pending</p></main>');
  await expect(page.getByRole("status")).toHaveText("ready");
});
