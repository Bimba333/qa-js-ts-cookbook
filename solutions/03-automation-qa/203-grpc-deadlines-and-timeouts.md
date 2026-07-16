# Решения: Deadlines и timeouts gRPC

## Задача 1. Концептуальные вопросы
### Ответ
Deadline задаёт предельный момент завершения RPC. Длительность на стороне client — измеренное время call. Cancellation явно прекращает call. Playwright timeout ограничивает весь тест и не заменяет deadline протокола.
### Объяснение
Эти границы действуют на разных уровнях жизненного цикла.
### Типичная ошибка
Полагаться только на длинный timeout теста.
### Связь с Automation QA
Отдельный deadline позволяет точно диагностировать и быстро завершить зависший RPC.

## Задача 2. Анализ времени
### Ответ
Наиболее вероятна неверная временная граница client: deadline 50 ms при допустимых 300 ms. Timeout теста 30 s лишь долго удерживает уже неправильно настроенный сценарий.
### Объяснение
Deadline должен учитывать нормальную задержку и разумный запас.
### Типичная ошибка
Устранять `DEADLINE_EXCEEDED` увеличением общего timeout теста.
### Связь с Automation QA
Раздельные budgets уменьшают flaky failures.

## Задача 3. Предскажите результат
### Ответ
Client должен получить `DEADLINE_EXCEEDED` до ответа service.
### Объяснение
Истёкший deadline завершает наблюдаемый call на стороне client, даже если работа server уже началась.
### Типичная ошибка
Ожидать успешный callback через 100 ms.
### Связь с Automation QA
Тест проверяет именно временной контракт RPC.

## Задача 4. Поиск ошибки
### Ответ
Call нужно обернуть в Promise и передать deadline через `CallOptions`, затем дождаться Promise через `await` и проверить его отклонение.
### Объяснение
Фиксированная задержка не синхронизирована с реальным завершением RPC.
### Типичная ошибка
Использовать `setTimeout` как механизм ожидания сетевой операции.
### Связь с Automation QA
Последовательность на основе Promise корректно интегрируется с жизненным циклом Playwright.

## Задача 5. Automation QA
### Ответ
Быстрый RPC чтения получает короткий deadline с запасом относительно предусмотренной контрактом задержки. Медленный RPC отчёта получает отдельный более длинный deadline. Playwright timeout должен быть больше deadline RPC и оставлять время на проверки и освобождение ресурсов.
### Объяснение
Один timeout не отражает разные ожидания от методов service.
### Типичная ошибка
Назначать всем RPC methods одинаковый минимальный deadline.
### Связь с Automation QA
Отдельные правила для RPC methods делают временные отказы осмысленными.

## Задача 6. Мини-проект
### Ответ
```ts
await expect(callUnary((callback) => client.slowTask(
  { delayMs: 100 },
  deadlineAfter(10),
  callback,
))).rejects.toMatchObject({ code: status.DEADLINE_EXCEEDED });

const cancelled = new Promise<never>((_resolve, reject) => {
  const call = client.slowTask(
    { delayMs: 100 },
    deadlineAfter(500),
    (error: ServiceError | null) => {
      if (error !== null) reject(error);
    },
  );
  call.cancel();
});

await expect(cancelled).rejects.toMatchObject({ code: status.CANCELLED });
```
### Объяснение
Первый сценарий проверяет deadline, второй — явную cancellation. После теста client и server закрываются в `finally`.
### Типичная ошибка
Оставлять timer server активным после отменённого call.
### Связь с Automation QA
Контролируемый локальный service позволяет детерминированно проверять оба завершения.
