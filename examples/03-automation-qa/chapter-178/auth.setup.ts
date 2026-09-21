import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { test as setup } from "@playwright/test";

import { signIn } from "../support/sut/ui.js";

const authenticationStatePath = fileURLToPath(
  new URL("../../../test-results/ui-layer-auth/qa-user.json", import.meta.url),
);

/**
 * Готовит состояние аутентификации один раз для всех тестов проекта.
 *
 * Вход выполняется через настоящую форму, поэтому сохранённое состояние
 * содержит реальную сессию стенда, а не выдуманную cookie.
 */
setup("создаёт состояние аутентифицированного тестировщика", async ({ page }) => {
  await mkdir(dirname(authenticationStatePath), { recursive: true });
  await signIn(page);
  await page.context().storageState({ path: authenticationStatePath });
});
