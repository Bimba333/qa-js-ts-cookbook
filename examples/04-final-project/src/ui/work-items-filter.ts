import type { Locator } from "@playwright/test";

/**
 * Компонент формы фильтра.
 *
 * Компонент знает только свою область DOM: все поиски идут от корневого
 * локатора, поэтому такой же фильтр на другой странице не потребует ни новых
 * селекторов, ни изменения сценария.
 */
export class WorkItemsFilter {
  readonly #root: Locator;

  constructor(root: Locator) {
    this.#root = root;
  }

  async selectStatus(status: string): Promise<void> {
    await this.#root.getByLabel("Статус").selectOption(status);
  }

  async apply(): Promise<void> {
    await this.#root.getByRole("button", { name: "Применить фильтр" }).click();
  }

  controls(): Locator {
    return this.#root.locator("select, button");
  }
}
