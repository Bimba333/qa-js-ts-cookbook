# Решения: Authentication state и управляемые сессии

## Задача 1. Концептуальные вопросы
### Ответ
`storageState` сохраняет cookies и поддерживаемое браузерное хранилище. Setup project создаёт этот снимок до зависимых проектов. Файл состояния может содержать токены сессии и поэтому является чувствительным.
### Объяснение
Файл позволяет создавать новые BrowserContext с одинаковым начальным состоянием без общей Page.
### Типичная ошибка
Коммитить файл состояния как обычный тестовый fixture.
### Связь с Automation QA
Утечка состояния может дать доступ к тестовому окружению.

## Задача 2. Анализ изоляции
### Ответ
После создания BrowserContext изменения cookies и хранилища изолированы. Конфликт возможен через одну серверную учётную запись, её права и серверные записи.
### Объяснение
Изоляция BrowserContext не разделяет внешнюю систему.
### Типичная ошибка
Считать файл состояния копией серверных данных.
### Связь с Automation QA
Для серверных данных нужны отдельные учётные записи или стратегия управления данными.

## Задача 3. Предскажите результат
### Ответ
B сохранит исходное значение. Изменение cookie в A не обновляет другой уже созданный BrowserContext.
### Объяснение
Состояние используется как начальный снимок.
### Типичная ошибка
Считать файл каналом синхронизации.
### Связь с Automation QA
Каждый тест изменяет собственную браузерную сессию.

## Задача 4. Поиск ошибки
### Ответ
Тест обходит проверяемый сценарий входа. Для тестов входа нужен проект без `storageState`; остальные тесты могут зависеть от setup project и использовать сохранённое состояние.
### Объяснение
Подготовка теста не должна предрешать проверяемый результат.
### Типичная ошибка
Один общий проект для всех типов сценариев.
### Связь с Automation QA
Разделение сохраняет и скорость, и реальную проверку входа.

## Задача 5. Automation QA
### Ответ
Используются отдельные `operator.json` и `admin.json` вне Git. Учётные данные поступают из секретов окружения, setup project обновляет файлы перед запуском набора, а срок жизни ограничен запуском или политикой окружения.
### Объяснение
Роль и срок жизни являются частью правил владения состоянием.
### Типичная ошибка
Один бессрочный файл состояния администратора для команды.
### Связь с Automation QA
Минимально необходимые права снижают риск и делают разрешения явными.

## Задача 6. Мини-проект
### Ответ
```ts
// auth.setup.ts
import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { test as setup } from "@playwright/test";

const authenticationStatePath = "test-results/auth/qa.json";

setup("создаёт state", async ({ page }) => {
  await mkdir(dirname(authenticationStatePath), { recursive: true });
  await page.context().addCookies([{
    name: "role", value: "qa", domain: "book.test", path: "/",
  }]);
  await page.context().storageState({ path: authenticationStatePath });
});
```

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  projects: [
    { name: "setup", testMatch: "auth.setup.ts" },
    {
      name: "chromium",
      dependencies: ["setup"],
      use: { browserName: "chromium", storageState: "test-results/auth/qa.json" },
    },
  ],
});
```

```ts
import { expect, test } from "@playwright/test";

test("получает роль", async ({ context }) => {
  const cookies = await context.cookies("https://book.test");
  expect(cookies).toEqual(expect.arrayContaining([
    expect.objectContaining({ name: "role", value: "qa" }),
  ]));
});
```
### Объяснение
Setup project сохраняет локальный снимок, а зависимый тест получает новый BrowserContext.
### Типичная ошибка
Передавать одну созданную Page между проектами.
### Связь с Automation QA
Project dependency делает подготовку сессии явной.
