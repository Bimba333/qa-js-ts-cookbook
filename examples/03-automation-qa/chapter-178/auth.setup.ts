import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { test as setup } from "@playwright/test";

const authenticationStatePath = fileURLToPath(
  new URL("../../../test-results/ui-layer-auth/qa-user.json", import.meta.url),
);

setup("создаёт контролируемое состояние роли QA", async ({ page }) => {
  await mkdir(dirname(authenticationStatePath), { recursive: true });
  await page.context().addCookies([
    {
      name: "session_role",
      value: "qa",
      domain: "book.test",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
      secure: true,
    },
  ]);
  await page.context().storageState({ path: authenticationStatePath });
});
