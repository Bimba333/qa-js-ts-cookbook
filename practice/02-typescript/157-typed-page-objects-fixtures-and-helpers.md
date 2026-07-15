# Практика: Typed Page Objects, Fixtures and Helpers

## Концептуальные вопросы

1. Что описывает interface для Page Object?
2. Почему fixture contract полезен в большом проекте?
3. Почему helper function лучше типизировать явно, если ей пользуется много файлов?

## Чтение кода

```ts
interface LoginPage {
  open(): Promise<void>;
  login(email: string, password: string): Promise<void>;
}

async function runLogin(page: LoginPage): Promise<void> {
  await page.open();
  await page.login("admin@example.test", "secret");
}
```

Что должен уметь объект, который передается в `runLogin`?

## Предскажите результат проверки

```ts
interface HeaderComponent {
  openProfile(): Promise<void>;
  logout(): Promise<void>;
}

const header: HeaderComponent = {
  async openProfile() {},
};
```

Что покажет TypeScript?

## Анализ типа

Объясните, почему TypeScript проверяет форму объекта, а не имя класса.

## Задание на отладку

Исправьте класс:

```ts
interface ReportHelper {
  buildTitle(suiteName: string, status: "passed" | "failed"): string;
}

class BasicReportHelper implements ReportHelper {
  buildTitle(suiteName: string): string {
    return suiteName;
  }
}
```

## Задание Automation QA

Опишите `TestFixtures`, которые содержат:

- `loginPage`;
- `baseUrl`;
- `environmentName`.

`loginPage` должен иметь методы `open` и `login`.

## Мини-проект

Создайте interface `ProfilePage`, класс `BasicProfilePage` и helper `buildProfileReportTitle`.

Класс должен реализовать interface, а helper должен иметь явный function type.
