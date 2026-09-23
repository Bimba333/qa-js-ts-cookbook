export default [
  {
    id: 'js-81-make-iterable',
    title: 'Сделать объект пригодным для for...of',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `createRange(from, to)`, которая возвращает объект, ' +
      'пригодный для `for...of` и spread: он выдаёт числа от `from` до `to` ' +
      'включительно. Обход должен быть повторяемым — второй проход даёт те же ' +
      'значения.',
    starter: `function createRange(from, to) {
  // Объекту нужен метод с ключом Symbol.iterator.
}`,
    hints: [
      'Пригодность для for...of даёт метод с ключом Symbol.iterator.',
      'Проще всего объявить его методом-генератором.',
      'Метод вызывается на каждый обход, поэтому повторяемость получается сама.'
    ],
    tests: [
      {
        name: 'работает со spread',
        code: `expect([...createRange(1, 3)]).toEqual([1, 2, 3]);`
      },
      {
        name: 'обход повторяем',
        code: `const range = createRange(1, 2);
expect([[...range], [...range]]).toEqual([[1, 2], [1, 2]]);`
      },
      {
        name: 'пустой диапазон',
        code: `expect([...createRange(3, 1)]).toEqual([]);`
      },
      {
        name: 'работает в for...of',
        code: `const seen = [];
for (const value of createRange(5, 7)) seen.push(value);
expect(seen).toEqual([5, 6, 7]);`
      }
    ],
    solution: `function createRange(from, to) {
  return {
    *[Symbol.iterator]() {
      for (let value = from; value <= to; value += 1) {
        yield value;
      }
    }
  };
}`
  },

  {
    id: 'js-81-is-iterable',
    title: 'Проверка пригодности к обходу',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `isIterable(value)`, которая возвращает `true`, если значение ' +
      'можно обойти через `for...of`. Строка и массив пригодны, обычный объект, ' +
      '`null` и число — нет.',
    starter: `function isIterable(value) {
  // Пригодность определяется наличием метода с известным ключом.
}`,
    hints: [
      'Проверять нужно наличие метода с ключом Symbol.iterator.',
      'Обращение к свойству у null выбрасывает ошибку.',
      'Проверка типа значения надёжнее проверки истинности.'
    ],
    tests: [
      {
        name: 'массив и строка пригодны',
        code: `expect([isIterable([]), isIterable('qa')]).toEqual([true, true]);`
      },
      {
        name: 'обычный объект непригоден',
        code: `expect(isIterable({ a: 1 })).toBe(false);`
      },
      {
        name: 'null и число непригодны',
        code: `expect([isIterable(null), isIterable(42)]).toEqual([false, false]);`
      },
      {
        name: 'Map и Set пригодны',
        code: `expect([isIterable(new Map()), isIterable(new Set())]).toEqual([true, true]);`
      },
      {
        name: 'ошибки не возникает',
        code: `let thrown = false;
try { isIterable(undefined); } catch (error) { thrown = true; }
expect(thrown).toBe(false);`
      }
    ],
    solution: `function isIterable(value) {
  return value !== null
    && value !== undefined
    && typeof value[Symbol.iterator] === 'function';
}`
  }
]
