export default [
  {
    id: 'ts-110-unknown-key-lies',
    title: 'Обращение по неизвестному ключу',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Тип `Record<string, number>` обещает число по любому ключу, но во время ' +
      'выполнения отсутствующий ключ даёт `undefined`. Напишите ' +
      '`readTimeout(timeouts: Record<string, number>, key: string): number`, ' +
      'которая возвращает значение или `5000`, если ключа нет. Затем напишите ' +
      '`sumTimeouts(timeouts: Record<string, number>): number` — сумму всех ' +
      'значений; нечисловые значения пропускаются, пустая карта даёт `0`.',
    starter: `function readTimeout(timeouts: Record<string, number>, key: string): number {
  // Тип говорит «число». Значение может сказать иначе.
  return 0;
}

function sumTimeouts(timeouts: Record<string, number>): number {
  return 0;
}`,
    hints: [
      'Проверять надо полученное значение, а не только наличие ключа.',
      'Значение по умолчанию применяется и к отсутствующему ключу, и к undefined.',
      'Нечисловые значения могут прийти из внешних данных вопреки типу.'
    ],
    tests: [
      {
        name: 'известный ключ читается',
        code: `expect(readTimeout({ short: 1000 }, 'short')).toBe(1000);`
      },
      {
        name: 'неизвестный ключ даёт значение по умолчанию',
        code: `expect(readTimeout({ short: 1000 }, 'long')).toBe(5000);`
      },
      {
        name: 'ноль остаётся значением, а не подменяется',
        code: `expect(readTimeout({ instant: 0 }, 'instant')).toBe(0);`
      },
      {
        name: 'сумма считается',
        code: `expect(sumTimeouts({ a: 1000, b: 2000 })).toBe(3000);`
      },
      {
        name: 'пустая карта даёт ноль',
        code: `expect(sumTimeouts({})).toBe(0);`
      },
      {
        name: 'нечисловое значение пропускается',
        code: `const dirty = { a: 1000, b: 'быстро' } as unknown as Record<string, number>;
expect(sumTimeouts(dirty)).toBe(1000);`
      }
    ],
    solution: `function readTimeout(timeouts: Record<string, number>, key: string): number {
  const value = timeouts[key];

  return typeof value === 'number' ? value : 5000;
}

function sumTimeouts(timeouts: Record<string, number>): number {
  let total = 0;

  for (const value of Object.values(timeouts)) {
    if (typeof value === 'number') {
      total += value;
    }
  }

  return total;
}`
  }
]
