# Решения: Composition fixtures и configuration flow

## 1. Configuration boundary
### Ответ
Исходные настройки loader читает один раз и превращает в неизменяемый config. Он отклоняет отсутствующие, пустые и состоящие только из пробелов обязательные значения, неподдерживаемый enum, некорректный URL и неположительное целое число. Composition root передаёт client только нужные поля.
### Объяснение
Так отсутствующее значение останавливает construction, а детерминированный test может передать другой источник.
### Типичная ошибка
Вызывать `process.env` в каждом method.
### Связь с Automation QA
Local и CI используют один validation contract.

## 2. Fixture scope
### Ответ
Изменяемая корзина — test scope; неизменяемый config — worker или option fixture; database pool — worker scope при изолированных clients и корректном teardown.
### Объяснение
Scope определяется владением изменяемым состоянием, а не только стоимостью setup.
### Типичная ошибка
Хранить test-owned cart в worker fixture.
### Связь с Automation QA
Parallel tests не разделяют изменяемые данные.

## 3. Предскажите порядок
### Ответ
Setup: config → apiClient → scenario; затем `use()` передаёт готовый контекст тесту. Teardown: scenario → apiClient → config, если каждому ресурсу нужен teardown. Падение теста не отменяет teardown.
### Объяснение
Playwright разрешает dependency graph и завершает его в обратном порядке.
### Типичная ошибка
Считать порядок properties порядком dependency resolution.
### Связь с Automation QA
Client существует раньше использующего его scenario fixture.

## 4. Ошибка конфигурации
### Ответ
Loader должен отклонить отсутствующий, пустой и состоящий только из пробелов token до создания client; fallback `""` удаляется.
### Объяснение
Обязательная настройка не имеет безопасного неявного значения.
### Типичная ошибка
Продолжать запуск и получить поздний `401`.
### Связь с Automation QA
Config failure классифицируется отдельно от product failure.

## 5. Automation QA-задача
### Ответ
Option fixture принимает объект с environment, URL и test-only token; loader проверяет его, а attachments получают только redacted config.
### Объяснение
Option меняет вход construction без environment dump.
### Типичная ошибка
Прикладывать JSON всего `process.env`.
### Связь с Automation QA
Projects выбирают окружение без утечки credentials.

## 6. Мини-проект: composition fixture
### Ответ
`test.extend()` получает option source, вызывает loader, строит test-scoped context и передаёт его в `use()`. После `use()` fixture выполняет cleanup. При успешном cleanup исходная test error выбрасывается без замены; при дополнительной cleanup error обе сохраняются в `AggregateError`, причём test error идёт первой. Отдельный флаг отличает `throw undefined` от отсутствия ошибки. Import файла не выполняет I/O.
### Объяснение
Сборка зависимостей и teardown находятся в одной видимой границе, а composition root остаётся отдельным от fixture.
### Типичная ошибка
Создавать client на module level.
### Связь с Automation QA
Каждый test получает изолированный context и наблюдаемую initialization error.
