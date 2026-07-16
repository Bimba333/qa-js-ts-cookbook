# Решения: GitHub Actions pipeline

## 1. Иерархия workflow
### Ответ
Событие запуска активирует workflow; workflow создаёт jobs; каждый job получает runner; steps последовательно выполняют actions или команды внутри job. Playwright workers создаются уже внутри процесса тестового runner и не заменяют GitHub Actions runner.
### Объяснение
Runner — машина задания, а не Playwright worker.
### Типичная ошибка
Называть каждый step отдельным job.
### Связь с Automation QA
Граница job определяет подготовку окружения и принадлежность файлов.

## 2. События запуска
### Ответ
Используйте `push`, `pull_request` и `workflow_dispatch` без job развёртывания и прав на запись.
### Объяснение
Первые два события дают автоматическую проверку, третье — контролируемый ручной запуск.
### Типичная ошибка
Добавлять `pull_request_target` ради secrets непроверенного кода.
### Связь с Automation QA
Один контракт тестирования работает для ветки и pull request.

## 3. Permissions
### Ответ
```yaml
permissions:
  contents: read
```
### Объяснение
Checkout тестируемого commit требует чтения, но не изменения репозитория.
### Типичная ошибка
Использовать `write-all` по умолчанию.
### Связь с Automation QA
Компрометация шага тестов имеет меньшие последствия.

## 4. Распространение ошибки
### Ответ
Удалите `continue-on-error: true` у обязательного шага тестов.
### Объяснение
Ненулевой код завершения должен перевести job в состояние failed.
### Типичная ошибка
Скрывать красный тест ради зелёного workflow.
### Связь с Automation QA
Pull request не получает ложный успешный сигнал.

## 5. Automation QA-задача
### Ответ
```yaml
timeout-minutes: 20
steps:
  - uses: actions/checkout@v6
  - uses: actions/setup-node@v6
    with:
      node-version: 22
      cache: npm
  - run: npm ci
  - run: npm run docs:ts:smoke
  - run: npx playwright test --config=examples/03-automation-qa/playwright.stability.config.ts
```
### Объяснение
Порядок позволяет недорогим обязательным проверкам остановить непригодный запуск раньше.
### Типичная ошибка
Запускать команды до checkout или установки зависимостей.
### Связь с Automation QA
Команда тестов уже проверена локально.

## 6. Мини-проект: workflow fixture
### Ответ
Полное решение находится в учебном fixture главы 240: события `push`, `pull_request`, `workflow_dispatch`, `contents: read`, один job с ограниченным timeout, Node.js 22, `npm ci`, статические проверки и набор тестов стабильности.
### Объяснение
Fixture неактивен и не меняет автоматизацию репозитория.
### Типичная ошибка
Поместить учебный workflow в `.github/workflows` и неожиданно запускать его.
### Связь с Automation QA
Структуру можно проверить статически до включения в реальный pipeline.
