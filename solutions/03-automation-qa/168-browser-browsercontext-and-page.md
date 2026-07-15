# Решения: Browser, BrowserContext и Page

## Задача 1. Концептуальные вопросы
### Ответ
`Browser` представляет управляемый экземпляр браузера, `BrowserContext` — изолированную сессию, `Page` — вкладку или popup-страницу. Контекст владеет cookies и storage. Один `Browser` не обязан соответствовать одному OS-процессу.
### Объяснение
Страницы одного контекста разделяют сессию.
### Типичная ошибка
Называть контекст отдельным процессом.
### Связь с Automation QA
Модель определяет границу авторизации.

## Задача 2. Классификация
### Ответ
Один `Browser`, два `BrowserContext`, три `Page`: две страницы первого пользователя и одна второго.
### Объяснение
Пользователей разделяет session boundary.
### Типичная ошибка
Создавать Browser на каждую вкладку.
### Связь с Automation QA
Контексты моделируют независимые роли экономно.

## Задача 3. Предскажите результат
### Ответ
Контекст B увидит `null`, потому что `localStorage` не разделяется между независимыми контекстами.
### Объяснение
При одинаковом origin сохраняется граница контекста.
### Типичная ошибка
Считать общий Browser общим storage.
### Связь с Automation QA
Авторизация одного теста не должна протекать в другой.

## Задача 4. Debugging
### Ответ
```ts
const context = await browser.newContext();
try {
  const page = await context.newPage();
  await page.setContent("<h1>Профиль</h1>");
} finally {
  await context.close();
}
```
### Объяснение
`finally` освобождает ресурсы и при ошибке.
### Типичная ошибка
Закрывать ресурс только после успешного шага.
### Связь с Automation QA
Утечки ресурсов ухудшают длинные запуски.

## Задача 5. Automation QA
### Ответ
Новый context имеет отдельные cookies и storage, но заказ хранится во внешней системе, общей для контекстов.
### Объяснение
Браузерное и серверное состояние имеют разные границы.
### Типичная ошибка
Приписывать контексту очистку database.
### Связь с Automation QA
Данным серверной части нужны свой владелец и отдельная очистка.

## Задача 6. Мини-проект
### Ответ
```ts
test("изолирует sessionStorage", async ({ browser }) => {
  const first = await browser.newContext();
  const second = await browser.newContext();
  const storagePageUrl = new URL("./storage-page.html", import.meta.url).href;
  try {
    const a = await first.newPage();
    const b = await second.newPage();
    await a.goto(storagePageUrl);
    await b.goto(storagePageUrl);
    await a.evaluate(() => sessionStorage.setItem("role", "admin"));
    expect(await a.evaluate(() => sessionStorage.getItem("role"))).toBe("admin");
    expect(await b.evaluate(() => sessionStorage.getItem("role"))).toBeNull();
  } finally {
    await first.close();
    await second.close();
  }
});
```
### Объяснение
Контексты имеют один Browser, но разные сессии. Локальный `storage-page.html` должен лежать рядом со spec-файлом и не загружать внешние ресурсы; `data:` URL здесь не подходит, потому что Chromium запрещает Web Storage для такого origin.
### Типичная ошибка
Открыть `about:blank`, где storage недоступен ожидаемым способом.
### Связь с Automation QA
Сценарий доказывает browser isolation.
