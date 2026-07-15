import { expect, type Locator, type Page, test } from "@playwright/test";

class NavigationComponent {
  constructor(private readonly root: Locator) {}

  async openOrders(): Promise<void> {
    await this.root.getByRole("link", { name: "Заказы" }).click();
  }
}

class DashboardPage {
  readonly navigation: NavigationComponent;

  constructor(private readonly page: Page) {
    this.navigation = new NavigationComponent(page.getByRole("navigation"));
  }

  async open(): Promise<void> {
    await this.page.setContent(`
      <nav><a href="#orders">Заказы</a></nav>
      <main><h1>Панель</h1></main>
    `);
  }
}

test("компонует страницу из независимого component object", async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.open();
  await dashboard.navigation.openOrders();

  await expect(page).toHaveURL(/#orders$/);
});
