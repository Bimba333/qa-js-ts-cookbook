# Практика: Environments и secrets в CI

## 1. Variable и secret
Разделите `API_BASE_URL` и `API_TOKEN` между variable и secret. Объясните выбор.

## 2. Граница fork
Объясните, почему pull request из fork не должен рассчитывать на repository secrets и как это влияет на выбор тестов.

## 3. Masking и permissions
Сравните masking secret и управление доступом. Почему одно не заменяет другое?

## 4. Проверка runtime-конфигурации
Напишите shell-проверку `API_BASE_URL` и `API_TOKEN`, которая отклоняет отсутствующее, пустое и состоящее только из пробелов значение, ничего не печатает и сохраняет ненулевой код завершения.

## 5. Automation QA-задача
Выберите repository secret или environment secret для credentials тестового environment, требующих ручного подтверждения. Обоснуйте область доступа.

## 6. Мини-проект: защищённый контракт environment
Создайте неактивный workflow fixture с environment `qa-preview`, variable, secret, `contents: read` и ранней проверкой. Не используйте реальное значение credential.
