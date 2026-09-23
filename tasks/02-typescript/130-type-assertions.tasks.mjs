export default [
  {
    id: 'ts-130-assertion-checks-nothing',
    title: 'Утверждение типа ничего не проверяет',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Напишите две функции разбора ответа. `readVersionUnsafe(payload: unknown)` ' +
      'использует утверждение `as` и возвращает `payload.version * 2` без ' +
      'проверок. `readVersionSafe(payload: unknown)` сначала проверяет форму и ' +
      'возвращает то же значение, а при неверной форме — ошибку ' +
      '`ответ не содержит версию`. Проверки подадут обеим функциям неверные ' +
      'данные: первая должна вернуть `NaN` или упасть, вторая — предсказуемо ' +
      'сообщить о проблеме.',
    starter: `type Payload = { version: number };

function readVersionUnsafe(payload: unknown): number {
  const typed = payload as Payload;

  return typed.version * 2;
}

function readVersionSafe(payload: unknown): number {
  // Здесь нужна настоящая проверка, а не утверждение.
  return 0;
}`,
    hints: [
      'Утверждение типа влияет только на проверку до запуска.',
      'Строка, умноженная на число, даёт NaN, а не ошибку.',
      'Проверять надо и тип значения, и тип его поля.'
    ],
    tests: [
      {
        name: 'на корректных данных обе функции равны',
        code: `expect(readVersionUnsafe({ version: 3 })).toBe(6);
expect(readVersionSafe({ version: 3 })).toBe(6);`
      },
      {
        name: 'утверждение пропускает неверный тип поля',
        code: `expect(Number.isNaN(readVersionUnsafe({ version: 'три' }))).toBe(true);`
      },
      {
        name: 'проверка отвергает неверный тип поля',
        code: `let message = '';
try { readVersionSafe({ version: 'три' }); } catch (error) { message = error.message; }
expect(message).toBe('ответ не содержит версию');`
      },
      {
        name: 'проверка отвергает отсутствие поля',
        code: `let missing = '';
try { readVersionSafe({}); } catch (error) { missing = error.message; }
expect(missing).toBe('ответ не содержит версию');`
      },
      {
        name: 'проверка отвергает null',
        code: `let nullMessage = '';
try { readVersionSafe(null); } catch (error) { nullMessage = error.message; }
expect(nullMessage).toBe('ответ не содержит версию');`
      },
      {
        name: 'ноль остаётся допустимой версией',
        code: `expect(readVersionSafe({ version: 0 })).toBe(0);`
      }
    ],
    solution: `type Payload = { version: number };

function readVersionUnsafe(payload: unknown): number {
  const typed = payload as Payload;

  return typed.version * 2;
}

function isPayload(value: unknown): value is Payload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return typeof (value as Record<string, unknown>).version === 'number';
}

function readVersionSafe(payload: unknown): number {
  if (!isPayload(payload)) {
    throw new Error('ответ не содержит версию');
  }

  return payload.version * 2;
}`
  }
]
