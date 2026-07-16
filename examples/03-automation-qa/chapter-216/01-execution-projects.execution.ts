import { expect, test } from "@playwright/test";

test("получает настройки выбранного execution project", async ({ baseURL, browserName }, testInfo) => {
  const environment = testInfo.project.metadata.environment;

  expect(["local-chromium", "preview-chromium"]).toContain(testInfo.project.name);
  expect(environment === "local" || environment === "preview").toBe(true);
  expect(browserName).toBe("chromium");
  expect(baseURL).toBe(`https://${environment}.qa.test`);
});
