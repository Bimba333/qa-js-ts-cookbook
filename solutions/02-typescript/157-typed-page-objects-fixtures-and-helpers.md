# Решения: Typed Page Objects, Fixtures and Helpers

## Концептуальные вопросы

### Ответ

Interface для Page Object описывает публичные действия страницы. Fixture contract показывает, какие зависимости доступны сценарию. Helper function лучше типизировать явно, чтобы все вызовы использовали одинаковые параметры и результат.

### Объяснение

Типы задают границы между частями проекта.

### Типичная ошибка

Описывать детали реализации вместо публичного API.

### Связь с Automation QA

Это помогает поддерживать Page Objects, fixtures и helpers в большом проекте.

## Чтение кода

### Ответ

Объект должен иметь методы `open()` и `login(email, password)`, оба возвращают `Promise<void>`.

### Объяснение

`runLogin` работает не с конкретным классом, а с контрактом `LoginPage`.

### Типичная ошибка

Передать объект, у которого похожее назначение, но нет нужного метода.

### Связь с Automation QA

Так тестовый сценарий зависит от понятного page contract.

## Предскажите результат проверки

### Ответ

TypeScript покажет ошибку: в объекте нет обязательного метода `logout`.

### Объяснение

Объект должен соответствовать всей форме `HeaderComponent`.

### Типичная ошибка

Считать, что можно реализовать только часть interface.

### Связь с Automation QA

Компоненты страниц должны предоставлять ожидаемые действия полностью.

## Анализ типа

### Ответ

TypeScript использует structural typing. Если объект имеет нужную форму, он подходит контракту независимо от имени класса.

### Объяснение

Проверяется набор свойств и методов, а не номинальная связь.

### Типичная ошибка

Ожидать, что совпадение имени класса влияет на совместимость.

### Связь с Automation QA

Это позволяет подменять реализации Page Object в разных окружениях, если публичный API совпадает.

## Задание на отладку

### Ответ

```ts
interface ReportHelper {
  buildTitle(suiteName: string, status: "passed" | "failed"): string;
}

class BasicReportHelper implements ReportHelper {
  buildTitle(suiteName: string, status: "passed" | "failed"): string {
    return `${suiteName}: ${status}`;
  }
}
```

### Объяснение

Метод класса должен соответствовать сигнатуре interface.

### Типичная ошибка

Упростить параметры метода и случайно нарушить контракт.

### Связь с Automation QA

Report helpers часто вызываются из разных мест, поэтому их API должен быть стабильным.

## Задание Automation QA

### Ответ

```ts
interface LoginPage {
  open(): Promise<void>;
  login(email: string, password: string): Promise<void>;
}

type TestFixtures = {
  loginPage: LoginPage;
  baseUrl: string;
  environmentName: "local" | "staging" | "production";
};
```

### Объяснение

Fixture contract описывает готовые зависимости сценария.

### Типичная ошибка

Хранить fixture как объект без явной формы.

### Связь с Automation QA

Так тесты получают предсказуемый набор зависимостей.

## Мини-проект

### Ответ

```ts
interface ProfilePage {
  open(): Promise<void>;
  updateDisplayName(name: string): Promise<void>;
}

class BasicProfilePage implements ProfilePage {
  constructor(private readonly baseUrl: string) {}

  async open(): Promise<void> {
    console.log(`open ${this.baseUrl}/profile`);
  }

  async updateDisplayName(name: string): Promise<void> {
    console.log(`update display name to ${name}`);
  }
}

type BuildProfileReportTitle = (userId: string, status: "passed" | "failed") => string;

const buildProfileReportTitle: BuildProfileReportTitle = (userId, status) => {
  return `profile ${userId}: ${status}`;
};
```

### Объяснение

Interface описывает страницу, класс реализует ее, helper имеет отдельный function type.

### Типичная ошибка

Смешивать действия страницы и отчетность в одном классе.

### Связь с Automation QA

Так UI-слой и вспомогательная функция отчетности остаются разделенными.
