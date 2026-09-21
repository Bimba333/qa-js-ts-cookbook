import { expect, type Locator, type Page, test } from "@playwright/test";

import { sutConfig } from "../support/sut/config.js";
import { signIn } from "../support/sut/ui.js";

/** Компонент шапки повторяется на каждой странице и владеет своей областью. */
class HeaderComponent {
  readonly currentUser: Locator;
  readonly logoutButton: Locator;

  constructor(root: Locator) {
    this.currentUser = root.getByTestId("current-user");
    this.logoutButton = root.getByRole("button", { name: "Выйти" });
  }
}

/** Компонент фильтра — самостоятельная часть страницы со своим поведением. */
class FiltersComponent {
  constructor(
    private readonly root: Locator,
    private readonly page: Page,
  ) {}

  async filterBy(status: string, priority: string): Promise<void> {
    await this.root.getByLabel("Статус").selectOption(status);
    await this.root.getByLabel("Приоритет").selectOption(priority);
    await this.root.getByRole("button", { name: "Применить фильтр" }).click();
    await this.page.waitForURL(/status=/);
  }
}

/**
 * Страница собирается композицией компонентов, а не наследованием.
 * Каждый компонент отвечает за свою область и переиспользуется отдельно.
 */
class WorkItemsPage {
  readonly header: HeaderComponent;
  readonly filters: FiltersComponent;
  readonly rows: Locator;
  readonly pageRange: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page.getByRole("banner"));
    this.filters = new FiltersComponent(
      page.getByRole("form", { name: "Фильтр задач" }),
      page,
    );
    this.rows = page.getByRole("row");
    this.pageRange = page.getByTestId("page-range");
  }

  async open(): Promise<void> {
    await this.page.goto(`${sutConfig().baseURL}/work-items`);
  }
}

test("собирает страницу из независимых компонентов", async ({ page }) => {
  await signIn(page);

  const workItems = new WorkItemsPage(page);
  await workItems.open();

  await expect(workItems.header.currentUser).toContainText("educational_tester");
  await expect(workItems.header.logoutButton).toBeVisible();
  await expect(workItems.pageRange).toBeVisible();

  await workItems.filters.filterBy("DONE", "HIGH");

  // Заголовок таблицы тоже строка, поэтому проверяется наличие данных,
  // а не точное число строк.
  await expect(workItems.rows.first()).toBeVisible();
  await expect(page).toHaveURL(/status=DONE/);
  await expect(page).toHaveURL(/priority=HIGH/);
});
