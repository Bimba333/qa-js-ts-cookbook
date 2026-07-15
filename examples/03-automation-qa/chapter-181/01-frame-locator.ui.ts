import { expect, test } from "@playwright/test";

test("сохраняет границу iframe через FrameLocator", async ({ page }) => {
  await page.setContent(`
    <h1>Оплата</h1>
    <iframe title="Платёжная форма" srcdoc="
      <label>Код <input></label>
      <button>Подтвердить</button>
      <script>
        document.querySelector('button').addEventListener('click', () => {
          document.body.dataset.status = 'confirmed';
        });
      <\/script>
    "></iframe>
  `);

  const paymentFrame = page.frameLocator('iframe[title="Платёжная форма"]');
  await paymentFrame.getByLabel("Код").fill("QA-181");
  await paymentFrame.getByRole("button", { name: "Подтвердить" }).click();

  await expect(paymentFrame.locator("body")).toHaveAttribute("data-status", "confirmed");
});
