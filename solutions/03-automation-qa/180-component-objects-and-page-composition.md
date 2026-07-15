# Решения: Component Objects и композиция страниц

## Задача 1. Концептуальные вопросы
### Ответ
Page Object представляет страницу, Component Object — ограниченный компонент интерфейса. Корневой Locator задаёт границу DOM, а композиция позволяет странице содержать компонент без наследования.
### Объяснение
Связь «имеет компонент» точнее, чем «является базовой страницей».
### Типичная ошибка
Наследовать страницы ради общей шапки.
### Связь с Automation QA
Один Component Object переиспользуется на нескольких страницах.

## Задача 2. Анализ границы
### Ответ
Создаются два `TableComponent`: один с root первой таблицы, другой со второй. Каждый ищет кнопку «Обновить» только внутри своего root.
### Объяснение
Цепочка Locator сохраняет границу поиска.
### Типичная ошибка
Использовать global `page.getByRole()` внутри component.
### Связь с Automation QA
Одинаковые компоненты остаются независимо адресуемыми.

## Задача 3. Предскажите результат
### Ответ
Нет. Locator не выйдет за пределы корневого элемента, и ожидаемое действие завершится по тайм-ауту, если кнопка внутри не появится.
### Объяснение
Корневой элемент является частью цепочки поиска.
### Типичная ошибка
Считать root только документационной меткой.
### Связь с Automation QA
Граница предотвращает случайное действие над соседним компонентом.

## Задача 4. Поиск ошибки
### Ответ
Микроклассы усложняют навигацию без самостоятельного поведения или повторного использования. Component Object оправдан устойчивой границей, несколькими связанными действиями либо реальным повторным использованием.
### Объяснение
Абстракция должна удалять сложность, а не только добавлять имя.
### Типичная ошибка
Оценивать архитектуру количеством классов.
### Связь с Automation QA
Осмысленные components проще поддерживать командой.

## Задача 5. Automation QA
### Ответ
`DashboardPage` владеет навигацией страницы и содержит `HeaderComponent`. Шапка владеет ограниченными своим корнем меню пользователя и индикатором роли. Каждый публичный метод меняет только свою область.
### Объяснение
Владение совпадает с границей UI.
### Типичная ошибка
Позволить шапке открывать отчёты панели управления.
### Связь с Automation QA
Изменение шапки не требует правок каждой страницы.

## Задача 6. Мини-проект
### Ответ
```ts
import { expect, type Locator, type Page, test } from "@playwright/test";

class NotificationComponent {
  readonly text: Locator;
  constructor(private readonly root: Locator) {
    this.text = root.getByRole("status");
  }
  async dismiss(): Promise<void> {
    await this.root.getByRole("button", { name: "Закрыть" }).click();
  }
}

class SettingsPage {
  readonly security: NotificationComponent;
  readonly profile: NotificationComponent;
  constructor(page: Page) {
    this.security = new NotificationComponent(page.getByTestId("security"));
    this.profile = new NotificationComponent(page.getByTestId("profile"));
  }
}

test("закрывает выбранное уведомление", async ({ page }) => {
  await page.setContent(`
    <div data-testid="security"><p role="status">Security</p><button onclick="this.parentElement.remove()">Закрыть</button></div>
    <div data-testid="profile"><p role="status">Profile</p><button>Закрыть</button></div>
  `);
  const settings = new SettingsPage(page);
  await settings.security.dismiss();
  await expect(settings.security.text).toBeHidden();
  await expect(settings.profile.text).toHaveText("Profile");
});
```
### Объяснение
Одинаковое поведение применяется к двум независимым корневым элементам.
### Типичная ошибка
Искать первую кнопку «Закрыть» глобально.
### Связь с Automation QA
Ограниченный корневым элементом Component Object устойчив к повторяющимся элементам управления.
