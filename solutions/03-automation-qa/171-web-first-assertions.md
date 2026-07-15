# Решения: Web-first assertions

## Задача 1. Концептуальные вопросы
### Ответ
Web-first assertion с `Locator` повторно читает актуальный DOM до успеха или timeout; обычная проверка сравнивает уже полученное значение один раз.
### Объяснение
Повторяется не `expect` вообще, а поддерживаемая web-first проверка.
### Типичная ошибка
Ожидать retry от `expect(text).toBe()`.
### Связь с Automation QA
Асинхронный UI требует наблюдения результата.

## Задача 2. Выбор проверки
### Ответ
`toBeVisible`, `toHaveText`, `toHaveValue`, `toBeChecked`, `toHaveCount`.
### Объяснение
Каждая проверка выражает требуемое состояние.
### Типичная ошибка
Сводить всё к `toBeTruthy`.
### Связь с Automation QA
Диагностика становится предметной.

## Задача 3. Предскажите результат
### Ответ
Web-first assertion повторит чтение `Locator` и пройдёт после появления `Готово`, если это произойдёт до timeout.
### Объяснение
Ручная пауза не нужна.
### Типичная ошибка
Считать первое значение `Обработка` немедленной ошибкой.
### Связь с Automation QA
Проверка учитывает нормальную задержку UI.

## Задача 4. Debugging
### Ответ
```ts
await expect(page.getByLabel("Статус")).toHaveText("Готово");
```
### Объяснение
Web-first assertion с `Locator` заново получает текст.
### Типичная ошибка
Оборачивать прежний `textContent` в retry без нового чтения.
### Связь с Automation QA
Код проверяет наблюдаемое состояние.

## Задача 5. Automation QA
### Ответ
```ts
await expect(page.getByText("Профиль сохранён")).toBeVisible();
await expect(page.getByRole("button", { name: "Продолжить" })).toBeEnabled();
```
### Объяснение
Проверяются результат и доступное следующее действие.
### Типичная ошибка
Проверять только внутренний class.
### Связь с Automation QA
Assertions отражают пользовательский контракт.

## Задача 6. Мини-проект
### Ответ
```ts
await page.setContent(`<p aria-label="Статус">Старт</p><ul></ul><script>setTimeout(() => { document.querySelector('p').textContent='Готово'; document.querySelector('ul').innerHTML='<li>A</li><li>B</li>'; }, 80)</script>`);
await expect(page.getByLabel("Статус")).toHaveText("Готово");
await expect(page.getByRole("listitem")).toHaveCount(2);
```
### Объяснение
Обе проверки повторно наблюдают DOM.
### Типичная ошибка
Добавить fixed sleep.
### Связь с Automation QA
Моделируется асинхронная загрузка результата.
