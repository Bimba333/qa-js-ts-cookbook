export default [
  {
    id: 'js-51-titles-from-results',
    title: 'Список названий тестов',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `testTitles(results)`, которая принимает массив ' +
      '`{ name, durationMs }` и возвращает массив названий в верхнем регистре. ' +
      'Длина результата должна совпадать с длиной исходного массива.',
    starter: `function testTitles(results) {
  // Преобразуйте каждый элемент в строку названия.
}`,
    hints: [
      'Нужен метод, который собирает возвращённые значения в новый массив.',
      'У строк есть метод toUpperCase().',
      'Не забудьте вернуть значение из колбэка: без return получится массив undefined.'
    ],
    tests: [
      {
        name: 'преобразует названия',
        code: `expect(testTitles([
  { name: 'login', durationMs: 10 },
  { name: 'order', durationMs: 20 }
])).toEqual(['LOGIN', 'ORDER']);`
      },
      {
        name: 'сохраняет длину массива',
        code: `expect(testTitles([
  { name: 'a', durationMs: 1 },
  { name: 'b', durationMs: 2 },
  { name: 'c', durationMs: 3 }
]).length).toBe(3);`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(testTitles([])).toEqual([]);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = [{ name: 'login', durationMs: 10 }];
testTitles(source);
expect(source).toEqual([{ name: 'login', durationMs: 10 }]);`
      }
    ],
    solution: `function testTitles(results) {
  return results.map((result) => result.name.toUpperCase());
}`
  },

  {
    id: 'js-51-mark-slow-tests',
    title: 'Пометить медленные тесты',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `markSlow(results, limitMs)`, которая принимает массив ' +
      '`{ name, durationMs }` и возвращает новый массив, где у каждого элемента ' +
      'добавлено поле `isSlow`: `true`, если `durationMs` строго больше `limitMs`. ' +
      'Исходные объекты изменяться не должны.',
    starter: `function markSlow(results, limitMs) {
  // Верните НОВЫЕ объекты, а не изменённые исходные.
}`,
    hints: [
      'map() создаёт новый массив, но объекты внутри остаются теми же — если вернуть исходную ссылку.',
      'Копию объекта с дополнительным полем удобно собрать через spread.',
      'Сравнение строгое: ровно limitMs медленным не считается.'
    ],
    tests: [
      {
        name: 'помечает медленные тесты',
        code: `expect(markSlow([
  { name: 'fast', durationMs: 10 },
  { name: 'slow', durationMs: 300 }
], 100)).toEqual([
  { name: 'fast', durationMs: 10, isSlow: false },
  { name: 'slow', durationMs: 300, isSlow: true }
]);`
      },
      {
        name: 'граничное значение медленным не считается',
        code: `expect(markSlow([{ name: 'edge', durationMs: 100 }], 100)[0].isSlow).toBe(false);`
      },
      {
        name: 'не изменяет исходные объекты',
        code: `const source = [{ name: 'slow', durationMs: 300 }];
markSlow(source, 100);
expect(source).toEqual([{ name: 'slow', durationMs: 300 }]);`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(markSlow([], 100)).toEqual([]);`
      }
    ],
    solution: `function markSlow(results, limitMs) {
  return results.map((result) => ({
    ...result,
    isSlow: result.durationMs > limitMs
  }));
}`
  }
]
