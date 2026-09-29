export default [
  {
    id: 'fp-255-call-unary',
    title: 'Обратный вызов в промис',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Унарный вызов gRPC сообщает результат обратным вызовом ровно один раз. ' +
      'Напишите `callUnary(client, method, request)`: вызовите ' +
      '`client[method](request, callback)` и верните промис. Промис ' +
      'разрешается ответом, если ошибки нет, и отклоняется ошибкой, если она ' +
      'есть. Повторное срабатывание обратного вызова не должно приводить ко ' +
      'второму разрешению.',
    starter: `function callUnary(client, method, request) {
  // Один вызов — один результат: либо ответ, либо ошибка.

  return new Promise(resolve => {
    client[method](request, (error, response) => resolve(response));
  });
}`,
    hints: [
      'Промису нужны оба исхода: resolve и reject.',
      'Ошибка приходит первым аргументом обратного вызова.',
      'Отклонение промиса — это reject(error), а не возврат ошибки.'
    ],
    tests: [
      {
        name: 'успешный вызов разрешает промис ответом',
        code: `const okClient = {
  GetWorkItem(request, callback) { callback(null, { id: request.id }); }
};
expect(await callUnary(okClient, 'GetWorkItem', { id: 'T-1' })).toEqual({ id: 'T-1' });`
      },
      {
        name: 'ошибка вызова отклоняет промис',
        code: `const failingClient = {
  GetWorkItem(request, callback) {
    const error = new Error('запись не найдена');
    error.code = 5;
    callback(error);
  }
};
let failure = null;
try {
  await callUnary(failingClient, 'GetWorkItem', { id: 'нет' });
} catch (error) {
  failure = error;
}
expect(failure.code).toBe(5);`
      },
      {
        name: 'запрос передаётся методу без изменений',
        code: `let seenRequest = null;
const echoClient = {
  SearchWorkItems(request, callback) {
    seenRequest = request;
    callback(null, { items: [], total: 0 });
  }
};
await callUnary(echoClient, 'SearchWorkItems', { limit: 50, offset: 0 });
expect(seenRequest).toEqual({ limit: 50, offset: 0 });`
      },
      {
        name: 'повторный обратный вызов не меняет результат',
        code: `const noisyClient = {
  GetWorkItem(request, callback) {
    callback(null, { id: 'первый' });
    callback(new Error('второй раз'));
  }
};
expect(await callUnary(noisyClient, 'GetWorkItem', {})).toEqual({ id: 'первый' });`
      }
    ],
    solution: `function callUnary(client, method, request) {
  return new Promise((resolve, reject) => {
    client[method](request, (error, response) => {
      if (error) reject(error);
      else resolve(response);
    });
  });
}`
  },
  {
    id: 'fp-255-status-code-name',
    title: 'Код состояния читается по имени',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'У gRPC собственная нумерация состояний, и в отчёте полезно видеть имя, ' +
      'а не число. Напишите `codeName(code)`: для известных кодов верните имя ' +
      '(`0` → `OK`, `1` → `CANCELLED`, `3` → `INVALID_ARGUMENT`, ' +
      '`4` → `DEADLINE_EXCEEDED`, `5` → `NOT_FOUND`, `6` → `ALREADY_EXISTS`, ' +
      '`7` → `PERMISSION_DENIED`, `9` → `FAILED_PRECONDITION`, ' +
      '`14` → `UNAVAILABLE`, `16` → `UNAUTHENTICATED`). Для неизвестного кода ' +
      'верните строку вида `UNKNOWN(42)` — с самим числом внутри.',
    starter: `function codeName(code) {
  // Неизвестный код тоже должен читаться в отчёте.

  return String(code);
}`,
    hints: [
      'Соответствие удобно хранить объектом или Map.',
      'Код 0 существует — проверка на истинность здесь не подходит.',
      'Для неизвестного кода в строку подставляется само число.'
    ],
    tests: [
      {
        name: 'известные коды переводятся в имена',
        code: `expect(codeName(0)).toBe('OK');
expect(codeName(5)).toBe('NOT_FOUND');
expect(codeName(16)).toBe('UNAUTHENTICATED');`
      },
      {
        name: 'нулевой код не теряется',
        code: `expect(codeName(0)).toBe('OK');`
      },
      {
        name: 'неизвестный код читается вместе с числом',
        code: `expect(codeName(42)).toBe('UNKNOWN(42)');`
      },
      {
        name: 'предусловие и неверный аргумент различаются',
        code: `expect(codeName(3)).toBe('INVALID_ARGUMENT');
expect(codeName(9)).toBe('FAILED_PRECONDITION');`
      }
    ],
    solution: `const CODE_NAMES = {
  0: 'OK',
  1: 'CANCELLED',
  3: 'INVALID_ARGUMENT',
  4: 'DEADLINE_EXCEEDED',
  5: 'NOT_FOUND',
  6: 'ALREADY_EXISTS',
  7: 'PERMISSION_DENIED',
  9: 'FAILED_PRECONDITION',
  14: 'UNAVAILABLE',
  16: 'UNAUTHENTICATED'
};

function codeName(code) {
  // Object.hasOwn различает отсутствие ключа и значение по умолчанию.
  return Object.hasOwn(CODE_NAMES, code) ? CODE_NAMES[code] : 'UNKNOWN(' + code + ')';
}`
  }
];
