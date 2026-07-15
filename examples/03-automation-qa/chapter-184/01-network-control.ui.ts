import { expect, test } from "@playwright/test";

test("наблюдает request и response страницы", async ({ page }) => {
  const requests: string[] = [];
  const statuses: number[] = [];
  page.on("request", (request) => requests.push(request.url()));
  page.on("response", (response) => statuses.push(response.status()));
  await page.route("https://book.test/profile", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: '{"role":"qa"}' }),
  );

  const result = await page.evaluate<{ role: string }>(async () => {
    const response = await fetch("https://book.test/profile");
    return response.json();
  });

  expect(result).toEqual({ role: "qa" });
  expect(requests).toContain("https://book.test/profile");
  expect(statuses).toContain(200);
});

test("изменяет исходящий request через route.fallback", async ({ page }) => {
  await page.route("https://book.test/settings", async (route) => {
    expect(route.request().headers()["x-test-role"]).toBe("qa");
    await route.fulfill({ status: 204 });
  });
  await page.route("https://book.test/settings", async (route) => {
    const headers = { ...route.request().headers(), "x-test-role": "qa" };
    await route.fallback({ headers });
  });

  const status = await page.evaluate(async () =>
    fetch("https://book.test/settings").then((response) => response.status),
  );

  expect(status).toBe(204);
});

test("явно прерывает запрещённый запрос", async ({ page }) => {
  await page.route("https://book.test/analytics", (route) => route.abort("blockedbyclient"));

  const result = await page.evaluate(async () => {
    try {
      await fetch("https://book.test/analytics");
      return "completed";
    } catch {
      return "aborted";
    }
  });

  expect(result).toBe("aborted");
});
