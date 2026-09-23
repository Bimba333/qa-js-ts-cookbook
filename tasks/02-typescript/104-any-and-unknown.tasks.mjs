export default [
  {
    id: 'ts-104-parse-unknown-status',
    title: 'Разбор неизвестного значения',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите функцию `readStatus(value: unknown): string`, которая возвращает ' +
      'строку статуса. Если `value` — непустая строка, вернуть её. Если это объект ' +
      'с полем `status` типа строка, вернуть это поле. Во всех остальных случаях ' +
      'вернуть `"unknown"`. Приведение через `as` использовать нельзя — только ' +
      'настоящие проверки.',
    starter: `function readStatus(value: unknown): string {
  // unknown нельзя использовать без проверки.
  return 'unknown';
}`,
    hints: [
      'Для примитивов подходит typeof.',
      'Перед обращением к полю нужно убедиться, что значение — объект и не null.',
      'Оператор in даёт доступ к свойству у суженного object.'
    ],
    tests: [
      {
        name: 'непустая строка возвращается как есть',
        code: `expect(readStatus('passed')).toBe('passed');`
      },
      {
        name: 'читает поле status у объекта',
        code: `expect(readStatus({ status: 'failed' })).toBe('failed');`
      },
      {
        name: 'пустая строка не считается статусом',
        code: `expect(readStatus('')).toBe('unknown');`
      },
      {
        name: 'null и число дают unknown',
        code: `expect(readStatus(null) + '|' + readStatus(42)).toBe('unknown|unknown');`
      },
      {
        name: 'объект без поля status даёт unknown',
        code: `expect(readStatus({ name: 'a' })).toBe('unknown');`
      }
    ],
    solution: `function readStatus(value: unknown): string {
  if (typeof value === 'string' && value !== '') {
    return value;
  }

  if (typeof value === 'object' && value !== null && 'status' in value) {
    const status = (value as { status: unknown }).status;

    if (typeof status === 'string') {
      return status;
    }
  }

  return 'unknown';
}`
  },

  {
    id: 'ts-104-safe-error-message',
    title: 'Сообщение из пойманного значения',
    difficulty: 'easy',
    lang: 'ts',
    prompt:
      'Напишите функцию `toMessage(error: unknown): string`, которая возвращает ' +
      'текст ошибки. Для объекта `Error` вернуть его `message`, для строки — саму ' +
      'строку, для остального — результат приведения к строке.',
    starter: `function toMessage(error: unknown): string {
  // В catch может прийти что угодно, не только Error.
  return '';
}`,
    hints: [
      'Принадлежность классу проверяется через instanceof.',
      'Строку можно отличить через typeof.',
      'Для остальных значений подойдёт String(...).'
    ],
    tests: [
      {
        name: 'достаёт message из Error',
        code: `expect(toMessage(new Error('упало'))).toBe('упало');`
      },
      {
        name: 'строку возвращает как есть',
        code: `expect(toMessage('строка')).toBe('строка');`
      },
      {
        name: 'число приводит к строке',
        code: `expect(toMessage(42)).toBe('42');`
      },
      {
        name: 'работает с подклассом Error',
        code: `class ConfigError extends Error {}
expect(toMessage(new ConfigError('нет конфигурации'))).toBe('нет конфигурации');`
      }
    ],
    solution: `function toMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return String(error);
}`
  }
]
