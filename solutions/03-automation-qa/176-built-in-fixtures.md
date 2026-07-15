# Решения: Built-in fixtures

## Задача 1. Концептуальные вопросы
### Ответ
`browser` представляет процесс браузера, `context` — изолированную сессию, `page` — вкладку внутри контекста. `page` и `context` обычно имеют test scope, `browser` — worker scope.
### Объяснение
Долгоживущий Browser экономит запуск процесса, а новые BrowserContext сохраняют изоляцию.
### Типичная ошибка
Считать общий Browser общей пользовательской сессией.
### Связь с Automation QA
Разные тесты могут безопасно использовать один Browser через независимые BrowserContext.

## Задача 2. Анализ владения
### Ответ
Полученный как fixture `context` закроет Playwright Test. Второй контекст создал сам тест, поэтому тест должен закрыть его в `finally`.
### Объяснение
Ответственность за освобождение следует за ответственностью за создание.
### Типичная ошибка
Закрывать полученный fixture или оставлять созданный вручную ресурс test runner.
### Связь с Automation QA
Явное владение предотвращает утечки ресурсов и случайное завершение соседних тестов.

## Задача 3. Предскажите результат
### Ответ
Тест B не увидит cookie теста A. Общий `browser` не объединяет хранилища независимых BrowserContext.
### Объяснение
Cookie jar принадлежит `BrowserContext`.
### Типичная ошибка
Считать, что область процесса совпадает с областью сессии.
### Связь с Automation QA
BrowserContext с test scope является базовой границей изоляции браузерных сессий.

## Задача 4. Поиск ошибки
### Ответ
Тест закрыл ресурс с worker scope, которым владеет test runner. Нужно удалить `browser.close()` и позволить Playwright Test освободить ресурс.
### Объяснение
Потребитель fixture не должен разрушать ресурс до окончания его области жизни.
### Типичная ошибка
Переносить управление ресурсами из отдельного скрипта в Playwright Test без изменений.
### Связь с Automation QA
Нарушение ломает все тесты worker, а не только текущую проверку.

## Задача 5. Automation QA
### Ответ
Тест получает `browser`, создаёт два BrowserContext, открывает Page, отдельно подготавливает состояния ролей, выполняет проверки и закрывает оба контекста в `finally`.
### Объяснение
Обе сессии принадлежат одному сценарию, но не разделяют браузерное хранилище.
### Типичная ошибка
Использовать одну Page и последовательно менять авторизацию.
### Связь с Automation QA
Так проверяют взаимодействие двух ролей без глобального состояния.

## Задача 6. Мини-проект
### Ответ
```ts
import { expect, test } from "@playwright/test";

test("изолирует два ручных контекста", async ({ browser }) => {
  const operatorContext = await browser.newContext();
  const managerContext = await browser.newContext();

  try {
    const operatorPage = await operatorContext.newPage();
    const managerPage = await managerContext.newPage();
    await operatorPage.setContent("<h1>Оператор</h1>");
    await managerPage.setContent("<h1>Менеджер</h1>");

    await expect(operatorPage.getByRole("heading")).toHaveText("Оператор");
    await expect(managerPage.getByRole("heading")).toHaveText("Менеджер");
  } finally {
    await operatorContext.close();
    await managerContext.close();
  }
});
```
### Объяснение
Каждая Page принадлежит своему созданному вручную BrowserContext, а `finally` гарантирует освобождение ресурсов.
### Типичная ошибка
Закрывать только Page и оставлять BrowserContext.
### Связь с Automation QA
Сценарий моделирует две независимые браузерные сессии в одном тесте.
