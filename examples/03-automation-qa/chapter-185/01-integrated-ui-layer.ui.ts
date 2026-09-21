import {
  expect,
  type Locator,
  type Page,
  test as base,
} from "@playwright/test";

import { sutConfig, SUT_USERS } from "../support/sut/config.js";
import { signIn } from "../support/sut/ui.js";
import { issueToken, WorkItemsApi } from "../support/sut/work-items-api.js";

class HeaderComponent {
  readonly currentUser: Locator;

  constructor(root: Locator) {
    this.currentUser = root.getByTestId("current-user");
  }
}

class NewWorkItemPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(`${sutConfig().baseURL}/work-items/new`);
  }

  async create(title: string, description: string): Promise<void> {
    await this.page.getByLabel("Заголовок").fill(title);
    await this.page.getByLabel("Описание").fill(description);
    await this.page.getByLabel("Приоритет").selectOption("HIGH");
    await this.page.getByRole("button", { name: "Создать задачу" }).click();
  }
}

class WorkItemPage {
  readonly header: HeaderComponent;
  readonly identifier: Locator;
  readonly title: Locator;
  readonly status: Locator;
  readonly priority: Locator;
  readonly version: Locator;

  constructor(page: Page) {
    this.header = new HeaderComponent(page.getByRole("banner"));
    this.identifier = page.getByTestId("work-item-id");
    this.title = page.getByRole("heading", { level: 1 });
    this.status = page.getByTestId("work-item-status");
    this.priority = page.getByTestId("work-item-priority");
    this.version = page.getByTestId("work-item-version");
  }
}

type UiFixtures = {
  newWorkItemPage: NewWorkItemPage;
  workItemPage: WorkItemPage;
  /** Регистрирует созданную запись для удаления после теста. */
  registerForCleanup: (id: string) => void;
};

/**
 * Фикстуры собирают слой UI: аутентификация, страницы и компоненты
 * подготовлены до теста. Сценарий остаётся о поведении системы.
 */
const test = base.extend<UiFixtures>({
  newWorkItemPage: async ({ page }, use) => {
    await signIn(page, SUT_USERS.tester);
    await use(new NewWorkItemPage(page));
  },
  workItemPage: async ({ page }, use) => {
    await use(new WorkItemPage(page));
  },

  // Запись создана в запуске UI-сессии, поэтому очистка по текущему запуску
  // токена её не удалит. За удаление отвечает фикстура, а не тело теста:
  // тогда данные убираются и после упавшей проверки.
  registerForCleanup: async ({ request }, use) => {
    const created: string[] = [];

    await use((id) => created.push(id));

    if (created.length > 0) {
      const token = await issueToken(request, SUT_USERS.tester);
      const api = new WorkItemsApi(
        request,
        token.accessToken,
        "chapter-185.cleanup",
      );

      for (const id of created) {
        await api.remove(id);
      }
    }
  },
});

test("сохраняет бизнес-сценарий читаемым", async ({
  newWorkItemPage,
  workItemPage,
  registerForCleanup,
}, testInfo) => {
  const title = `Интеграция слоя UI ${testInfo.testId}`;

  await newWorkItemPage.open();
  await newWorkItemPage.create(title, "Сценарий проходит через слой целиком");

  registerForCleanup(await workItemPage.identifier.innerText());

  await expect(workItemPage.title).toHaveText(title);
  await expect(workItemPage.status).toHaveText("NEW");
  await expect(workItemPage.priority).toHaveText("HIGH");
  await expect(workItemPage.version).toHaveText("1");
  await expect(workItemPage.header.currentUser).toContainText(
    SUT_USERS.tester.login,
  );
});
