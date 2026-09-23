export default [
  {
    id: 'js-89-memoize-counts-calls',
    title: 'Лишняя работа видна по числу вызовов',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Оптимизация начинается с измерения. Напишите `memoize(fn)` — обёртку, ' +
      'которая кеширует результат по первому аргументу: повторный вызов с тем ' +
      'же аргументом не должен вызывать `fn`. Возвращаемая функция имеет ' +
      'свойства `calls` (число вызовов исходной функции) и `hits` (число ' +
      'попаданий в кеш). Значение `undefined`, возвращённое `fn`, тоже ' +
      'кешируется. Ошибка не кешируется: следующий вызов снова обращается к `fn`.',
    starter: `function memoize(fn) {
  const wrapped = argument => fn(argument);

  wrapped.calls = 0;
  wrapped.hits = 0;

  return wrapped;
}`,
    hints: [
      'Кеш по ключу удобно держать в Map: она различает undefined и отсутствие ключа.',
      'Счётчики обновляются в обёртке, а не в исходной функции.',
      'Ошибку кешировать нельзя: иначе временный сбой станет постоянным.'
    ],
    tests: [
      {
        name: 'повторный вызов не трогает исходную функцию',
        code: `let calls = 0;
const slow = value => { calls += 1; return value * 2; };
const fast = memoize(slow);
expect(fast(2)).toBe(4);
expect(fast(2)).toBe(4);
expect(calls).toBe(1);`
      },
      {
        name: 'счётчики отражают работу',
        code: `const fast = memoize(value => value);
fast('a');
fast('a');
fast('b');
expect(fast.calls).toBe(2);
expect(fast.hits).toBe(1);`
      },
      {
        name: 'разные аргументы считаются отдельно',
        code: `let calls = 0;
const fast = memoize(value => { calls += 1; return value; });
fast(1);
fast(2);
expect(calls).toBe(2);`
      },
      {
        name: 'undefined кешируется',
        code: `let calls = 0;
const fast = memoize(() => { calls += 1; return undefined; });
expect(fast('x')).toBeUndefined();
expect(fast('x')).toBeUndefined();
expect(calls).toBe(1);`
      },
      {
        name: 'ошибка не кешируется',
        code: `let attempts = 0;
const flaky = memoize(() => {
  attempts += 1;
  if (attempts === 1) throw new Error('временный сбой');
  return 'готово';
});
let failed = false;
try { flaky('x'); } catch { failed = true; }
expect(failed).toBe(true);
expect(flaky('x')).toBe('готово');
expect(attempts).toBe(2);`
      },
      {
        name: 'обёртки независимы',
        code: `const first = memoize(value => value);
const second = memoize(value => value);
first('a');
expect(second.calls).toBe(0);`
      }
    ],
    solution: `function memoize(fn) {
  const cache = new Map();

  const wrapped = argument => {
    if (cache.has(argument)) {
      wrapped.hits += 1;

      return cache.get(argument);
    }

    // Счётчик увеличивается до вызова: упавший вызов тоже был вызовом.
    wrapped.calls += 1;

    const result = fn(argument);

    cache.set(argument, result);

    return result;
  };

  wrapped.calls = 0;
  wrapped.hits = 0;

  return wrapped;
}`
  }
]
