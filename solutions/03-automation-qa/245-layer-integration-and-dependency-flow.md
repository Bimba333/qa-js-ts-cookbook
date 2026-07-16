# Решения: Интеграция слоёв и dependency flow

## 1. Направление зависимостей
### Ответ
Направление imports: test → fixture → composition root; composition root → service и adapters; service и adapters → contracts. Runtime-вызов может идти от теста к adapter, а результат — обратно, но это не меняет направление зависимости исходного кода. API client не должен импортировать fixture.
### Объяснение
Низкоуровневая реализация получает зависимости через constructor и не знает, кто её создал. Контракт также не импортирует adapter, который его реализует.
### Типичная ошибка
Искать fixture через service locator внутри client.
### Связь с Automation QA
API client можно использовать вне Playwright и независимо тестировать.

## 2. Public API слоя
### Ответ
```typescript
interface TaskCreator { create(title: string): Promise<{ id: string }> }
interface TaskReader {
  get(id: string): Promise<Readonly<{ id: string; status: "open" | "closed" }>>;
}
interface TaskRepository {
  find(id: string): Promise<Readonly<{ id: string; status: "open" | "closed" }> | null>;
}
```
### Объяснение
Контракты выражают только поведение текущего сценария. `get()` сообщает ошибкой об обязательной записи, а `find()` возвращает `null` только при ожидаемом отсутствии. `readonly` ограничивает запись на этапе TypeScript, но не заменяет runtime-заморозку объекта.
### Типичная ошибка
Копировать в interface весь transport SDK или превращать любую неожиданную ошибку `find()` в `null`.
### Связь с Automation QA
Fake реализует тот же узкий контракт без public network.

## 3. Composition root
### Ответ
Сначала создаются low-level adapters, затем orchestration service получает их через constructor.
### Объяснение
Объект нельзя построить раньше его dependencies.
### Типичная ошибка
Создать service без dependencies и заполнить изменяемые поля позже.
### Связь с Automation QA
Initialization failure возникает до начала test scenario.

## 4. Циклическая зависимость
### Ответ
Цикл: `fixtures → composition-root → service → fixtures`. Service должен зависеть от contracts, а fixture передаваться ему не должен.
### Объяснение
Удаление reverse import разрывает цикл и сохраняет направление construction.
### Типичная ошибка
Перенести import в функцию и считать цикл устранённым.
### Связь с Automation QA
Fixture graph остаётся читаемым и детерминированным.

## 5. Automation QA-задача
### Ответ
Нужны UI для действия и API для проверки публичного результата. Database verification нужна только при отдельном требовании проверить persistence, не видимую через API.
### Объяснение
Каждый дополнительный слой должен отвечать на отдельный вопрос.
### Типичная ошибка
Добавлять database assertion «для надёжности».
### Связь с Automation QA
Сценарий проверяет интеграцию без ненужной связности.

## 6. Мини-проект: dependency graph
### Ответ
Создайте `TaskCreator` и `TaskReader`, adapters, которые их реализуют, и composition root, передающий adapters сервису. Validator должен учитывать обычные и type-only imports, отклонять неизвестную локальную зависимость, обратный import и цикл.
### Объяснение
Контракты отделяют необходимость теста от инфраструктурной реализации. Зелёная проверка подтверждает только объявленный граф файлов: она не доказывает корректность runtime-поведения или всей архитектуры.
### Типичная ошибка
Разрешить validator сканировать весь репозиторий и получить unrelated false positives.
### Связь с Automation QA
Локальная проверка графа модуля защищает границы framework без изменения frozen layers.
