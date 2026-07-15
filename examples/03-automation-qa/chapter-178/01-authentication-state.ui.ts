import { expect, test } from "@playwright/test";

test("получает подготовленное состояние без общей изменяемой Page", async ({ context }) => {
  const cookies = await context.cookies("https://book.test");

  expect(cookies).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: "session_role", value: "qa" }),
    ]),
  );
});
