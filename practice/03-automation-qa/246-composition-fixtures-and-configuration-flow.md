# Практика: Composition fixtures и configuration flow

## 1. Configuration boundary
Объясните путь исходные настройки → проверенная конфигурация → composition root → client. Укажите проверки для отсутствующего, пустого и состоящего только из пробелов значения, enum, URL и положительного числа. Почему client не должен самостоятельно читать `process.env`?

## 2. Fixture scope
Выберите test или worker scope для изменяемой корзины, неизменяемого config и database pool. Обоснуйте каждый выбор.

## 3. Предскажите порядок
Для fixtures `config → apiClient → scenario` предскажите порядок setup, `use()` и teardown независимо от порядка объявления полей. Что произойдёт с teardown после падения теста?

## 4. Ошибка конфигурации
Исправьте composition fixture, который заменяет отсутствующий обязательный token пустой строкой и продолжает запуск.

## 5. Automation QA-задача
Спроектируйте option fixture для `local` и `preview` без environment dump и передачи secret в attachments.

## 6. Мини-проект: composition fixture
Создайте `test.extend()` с проверенной конфигурацией, test-scoped context и гарантированным teardown. Сохраните исходную test error при успешном cleanup и обе ошибки при падении cleanup. Не спутайте `throw undefined` с отсутствием ошибки и не выполняйте network request при import.
