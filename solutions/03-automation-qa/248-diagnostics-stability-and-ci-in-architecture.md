# Решения: Диагностика, стабильность и CI в общей архитектуре

## 1. Идентификаторы
### Ответ
Domain identity обозначает entity, correlation id связывает события attempt, execution identity различает project, worker, shard, repeat и retry.
### Объяснение
Один identifier не может без потери смысла заменить три области.
### Типичная ошибка
Использовать worker index как id test data.
### Связь с Automation QA
Logs и artifacts связываются с точным запуском и entity.

## 2. Предскажите результат
### Ответ
Тест остаётся failed. Успешный attachment сохраняет evidence, но не меняет результат assertion.
### Объяснение
Diagnostics является побочным каналом наблюдения.
### Типичная ошибка
Ловить assertion error и завершать функцию без повторного throw.
### Связь с Automation QA
CI получает красный статус и полезный artifact одновременно.

## 3. Diagnostic failure
### Ответ
Assertion или scenario error остаётся исходной ошибкой и первым элементом `AggregateError`; diagnostic failure добавляется следующим. Если scenario error была обёрнута, её исходная причина остаётся в `cause`.
### Объяснение
Иначе расследование начнётся с ошибки сохранения файла вместо product symptom.
### Типичная ошибка
Заменить исходную ошибку исключением reporter.
### Связь с Automation QA
Failure propagation сохраняет исходную проверку.

## 4. Secret boundary
### Ответ
В attachment входят только имя environment, ограниченные URL metadata, correlation ID и redacted fields; token исключается или заменяется `[REDACTED]`, а частные абсолютные пути не добавляются без необходимости.
### Объяснение
Masking журнала не защищает содержимое artifact.
### Типичная ошибка
Сериализовать весь config object.
### Связь с Automation QA
Evidence остаётся пригодным для хранения в CI.

## 5. Automation QA-задача
### Ответ
Событие содержит commit/run id, project, `shard=2/4`, worker index, test id, entity id, operation, status и bounded error name/message.
### Объяснение
Эти поля локализуют attempt без sensitive payload.
### Типичная ошибка
Добавить authorization header и полный body.
### Связь с Automation QA
Shard можно расследовать отдельно от остальных jobs.

## 6. Мини-проект: correlated diagnostics
### Ответ
Сценарий ловит error, создаёт redacted event с фиксированным timestamp, пишет bounded JSON и выбрасывает новый `Error` с исходным `cause`; test проверяет rejected promise и отсутствие token. Если diagnostic sink падает, обе ошибки сохраняются в `AggregateError`. CI публикует полученный artifact, но не управляет сценарием.
### Объяснение
Diagnostic channel дополняет, но не подавляет failure.
### Типичная ошибка
Возвращать `false` после записи события.
### Связь с Automation QA
Local и CI execution используют одинаковый error contract.
