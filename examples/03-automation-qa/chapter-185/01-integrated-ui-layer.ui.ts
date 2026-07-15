import { expect, type Locator, type Page, test as base } from "@playwright/test";

class HeaderComponent {
  readonly role: Locator;

  constructor(root: Locator) {
    this.role = root.getByTestId("role");
  }
}

class OrdersPage {
  readonly header: HeaderComponent;
  readonly orderStatus: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page.getByRole("banner"));
    this.orderStatus = page.getByTestId("order-status");
  }

  async open(role: string): Promise<void> {
    await this.page.setContent(`
      <header><span data-testid="role">${role}</span></header>
      <main>
        <h1>Заказы</h1>
        <button onclick="document.querySelector('[data-testid=order-status]').textContent = 'Заказ создан'">
          Создать заказ
        </button>
        <output data-testid="order-status"></output>
      </main>
    `);
  }

  async createOrder(): Promise<void> {
    await this.page.getByRole("button", { name: "Создать заказ" }).click();
  }
}

type UiFixtures = {
  userRole: string;
  ordersPage: OrdersPage;
};

const test = base.extend<UiFixtures>({
  userRole: async ({}, use) => {
    await use("qa-manager");
  },
  ordersPage: async ({ page, userRole }, use) => {
    const ordersPage = new OrdersPage(page);
    await ordersPage.open(userRole);
    await use(ordersPage);
  },
});

test("сохраняет бизнес-сценарий читаемым", async ({ ordersPage }) => {
  await ordersPage.createOrder();

  await expect(ordersPage.orderStatus).toHaveText("Заказ создан");
  await expect(ordersPage.header.role).toHaveText("qa-manager");
});
