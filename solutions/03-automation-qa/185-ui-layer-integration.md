# Решения: Интеграция UI-слоя

## Задача 1. Концептуальные вопросы
### Ответ
Test runner предоставляет built-in fixtures, custom fixture создаёт Page Object, Page Object компонует Component Object, а тест выполняет сценарий. Объекты UI имеют область жизни fixture, которая их создала.
### Объяснение
Обычный класс не получает отдельный жизненный цикл от Playwright.
### Типичная ошибка
Считать Page Object worker-safe сам по себе.
### Связь с Automation QA
Владение читается по графу fixtures.

## Задача 2. Анализ архитектуры
### Ответ
Зависимости направлены от test runner к fixture, Page Object и Component Object. Тест остаётся потребителем и явно показывает действие и проверку, поэтому бизнес-намерение видно.
### Объяснение
Нижний слой не зависит от конкретного тестового сценария.
### Типичная ошибка
Передать callback теста внутрь Page Object.
### Связь с Automation QA
Направленный поток зависимостей упрощает повторное использование и диагностику.

## Задача 3. Предскажите результат
### Ответ
Playwright отклонит зависимость: worker fixture не может зависеть от fixture с test scope. Иначе долгоживущий объект удерживал бы ресурс конкретного теста.
### Объяснение
Область жизни зависимости не может быть короче области жизни потребителя.
### Типичная ошибка
Менять `page` на глобальную переменную, чтобы обойти проверку.
### Связь с Automation QA
Правило областей жизни защищает изоляцию между тестами.

## Задача 4. Поиск ошибки
### Ответ
Одиночки разделяют изменяемую Page и состояние, зависящее от порядка. Нужно создавать Page Object в fixture с test scope из полученной `page`, а Component Object создавать внутри объекта-владельца.
### Объяснение
Каждый тест получает собственный граф объектов.
### Типичная ошибка
Очищать singleton в `beforeEach`.
### Связь с Automation QA
Композиция с test scope поддерживает параллельное выполнение.

## Задача 5. Automation QA
### Ответ
Ревью проверяет владельца подготовки и освобождения ресурсов, однонаправленные зависимости, соответствие области fixture данным, устойчивые границы страниц и компонентов, новые BrowserContext для состояния и читаемое тело теста.
### Объяснение
Критерии оценивают поведение архитектуры, а не папки.
### Типичная ошибка
Проверять только названия классов.
### Связь с Automation QA
Так ревью обнаруживает скрытые связи до нестабильных падений.

## Задача 6. Мини-проект
### Ответ
```ts
import { expect, type Locator, type Page, test as base } from "@playwright/test";

class RoleComponent {
  constructor(readonly value: Locator) {}
}

class WorkspacePage {
  readonly role: RoleComponent;
  readonly status: Locator;
  constructor(private readonly page: Page) {
    this.role = new RoleComponent(page.getByTestId("role"));
    this.status = page.getByTestId("status");
  }
  async open(role: string): Promise<void> {
    await this.page.setContent(`
      <span data-testid="role">${role}</span>
      <button onclick="document.querySelector('[data-testid=status]').textContent = 'Объект создан'">Создать</button>
      <output data-testid="status"></output>
    `);
  }
  async create(): Promise<void> {
    await this.page.getByRole("button", { name: "Создать" }).click();
  }
}

type Fixtures = { role: string; workspace: WorkspacePage };
const test = base.extend<Fixtures>({
  role: async ({}, use) => { await use("qa"); },
  workspace: async ({ page, role }, use) => {
    const workspace = new WorkspacePage(page);
    await workspace.open(role);
    await use(workspace);
  },
});

test("создаёт объект в роли QA", async ({ workspace }) => {
  await workspace.create();
  await expect(workspace.status).toHaveText("Объект создан");
  await expect(workspace.role.value).toHaveText("qa");
});
```
### Объяснение
Граф fixtures имеет test scope, Component Object принадлежит Page Object, действие и проверка видимы.
### Типичная ошибка
Сделать `workspace` fixture с worker scope ради повторного использования.
### Связь с Automation QA
Структура расширяется без общего изменяемого состояния.
