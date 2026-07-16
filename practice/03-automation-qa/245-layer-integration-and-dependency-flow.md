# Практика: Интеграция слоёв и dependency flow

## 1. Направление зависимостей
Постройте направление imports для test → fixture → composition root → service/adapters → contracts. Затем отдельно опишите runtime-вызов API adapter и найдите ошибку в ситуации, где API client импортирует Playwright fixture.

## 2. Public API слоя
Спроектируйте минимальные `TaskCreator`, `TaskReader` и `TaskRepository` для сценария создания и чтения task. Используйте `get()` для обязательной записи и `find()` для ожидаемого отсутствия. Объясните различие ошибок и роль `readonly`.

## 3. Composition root
Предскажите, какие объекты будут созданы раньше: low-level adapters или orchestration service. Объясните порядок.

## 4. Циклическая зависимость
Разберите граф `fixtures → composition-root → service → fixtures`. Укажите цикл и минимальное изменение, которое его устраняет.

## 5. Automation QA-задача
Выберите необходимые слои для проверки: пользователь закрывает task в UI, а публичный API должен вернуть `closed`. Обоснуйте, нужна ли database verification.

## 6. Мини-проект: dependency graph
Создайте module-owned contracts, два adapters и composition root. Добавьте локальную проверку обычного и type-only import, обратного import, прямого цикла и неизвестной локальной зависимости. Укажите границы того, что эта проверка способна доказать.
