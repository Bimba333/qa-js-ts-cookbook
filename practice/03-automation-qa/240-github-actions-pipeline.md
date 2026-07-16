# Практика: GitHub Actions pipeline

## 1. Иерархия workflow
Разделите событие запуска, workflow, job, runner и step и укажите связь между ними. Отдельно объясните, почему runner не является Playwright worker.

## 2. События запуска
Спроектируйте события `push`, `pull_request` и ручного запуска без deployment.

## 3. Permissions
Выберите минимальные permissions для workflow, который только читает код и запускает тесты. Объясните отказ от прав на запись.

## 4. Распространение ошибки
Найдите проблему в обязательном шаге тестов с `continue-on-error: true` и исправьте её.

## 5. Automation QA-задача
Запишите безопасный порядок checkout, настройки Node.js, `npm ci`, статических проверок и тестов Playwright с timeout job.

## 6. Мини-проект: workflow fixture
Создайте неактивный workflow fixture для `push` и `pull_request`: Node.js 22, npm cache, `npm ci`, `docs:ts:smoke` и тесты стабильности. Используйте минимальные permissions.
