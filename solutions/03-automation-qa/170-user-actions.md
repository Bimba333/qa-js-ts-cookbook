# Решения: Пользовательские действия

## Задача 1. Концептуальные вопросы
### Ответ
Actionability проверяет, что элемент готов принять действие. DOM mutation обходит реальное пользовательское взаимодействие.
### Объяснение
Техническое изменение значения не гарантирует работу UI.
### Типичная ошибка
Считать `evaluate` эквивалентом click.
### Связь с Automation QA
Тест должен обнаруживать перекрытую кнопку.

## Задача 2. Выбор действия
### Ответ
`fill`, `check`, `selectOption`, `hover`, `press("Enter")`.
### Объяснение
Методы выражают тип управления.
### Типичная ошибка
Использовать click для любого control.
### Связь с Automation QA
Намерение шага остаётся читаемым.

## Задача 3. Предскажите результат
### Ответ
`check()` оставит checkbox отмеченным; `click()` переключит его и снимет отметку.
### Объяснение
`check` выражает конечное состояние.
### Типичная ошибка
Путать действие и toggle.
### Связь с Automation QA
Идемпотентное намерение снижает случайные ошибки подготовки.

## Задача 4. Debugging
### Ответ
Использовать `await locator.click()` без `force`. При ошибке исследовать видимость, стабильность, перекрытие, доступность элемента и правильность `Locator`.
### Объяснение
Force скрывает сигнал actionability.
### Типичная ошибка
Увеличить timeout без анализа.
### Связь с Automation QA
Причина может быть продуктовым дефектом.

## Задача 5. Automation QA
### Ответ
```ts
await page.getByLabel("Формат").selectOption("JSON");
await page.getByLabel("Согласие").check();
await page.getByRole("button", { name: "Сохранить" }).click();
await expect(page.getByText("Сохранено")).toBeVisible();
```
### Объяснение
Каждый control получает подходящее действие.
### Типичная ошибка
Проверять только отсутствие ошибки click.
### Связь с Automation QA
Assertion подтверждает бизнес-результат.

## Задача 6. Мини-проект
### Ответ
```ts
await page.setContent(`<input aria-label="Имя"><input type="checkbox" aria-label="Активно"><select aria-label="Формат"><option>HTML</option><option>JSON</option></select><button onclick="document.getElementById('result').textContent='Настройки сохранены'">Сохранить</button><p id="result"></p>`);
await page.getByLabel("Имя").fill("Регрессия");
await page.getByLabel("Активно").check();
await page.getByLabel("Формат").selectOption("JSON");
await page.getByRole("button", { name: "Сохранить" }).click();
await expect(page.getByText("Настройки сохранены")).toBeVisible();
```
### Объяснение
Сценарий использует действия по назначению.
### Типичная ошибка
Применить `force` без причины.
### Связь с Automation QA
Форма похожа на настройку отчёта.
