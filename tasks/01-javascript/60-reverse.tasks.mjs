export default [
  {
    id: 'js-60-reversed-copy',
    title: 'Обратный порядок без изменения исходного',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `reversedPlan(plan)`, которая возвращает новый массив с ' +
      'элементами в обратном порядке. Исходный массив изменяться не должен.',
    starter: `function reversedPlan(plan) {
  // reverse() переворачивает массив на месте.
}`,
    hints: [
      'reverse() изменяет исходный массив и возвращает его же.',
      'Чтобы сохранить исходный порядок, работайте с копией.',
      'Копию массива можно получить через spread.'
    ],
    tests: [
      {
        name: 'переворачивает порядок',
        code: `expect(reversedPlan(['login', 'order', 'logout']))
  .toEqual(['logout', 'order', 'login']);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = ['a', 'b', 'c'];
reversedPlan(source);
expect(source).toEqual(['a', 'b', 'c']);`
      },
      {
        name: 'возвращает новый массив',
        code: `const source = ['a', 'b'];
expect(reversedPlan(source) === source).toBe(false);`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(reversedPlan([])).toEqual([]);`
      }
    ],
    solution: `function reversedPlan(plan) {
  return [...plan].reverse();
}`
  },

  {
    id: 'js-60-last-events-first',
    title: 'Последние события в начале',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `latestEvents(events, limit)`, которая принимает массив ' +
      'строк в порядке появления и возвращает не более `limit` последних событий, ' +
      'начиная с самого нового. Исходный массив изменяться не должен.',
    starter: `function latestEvents(events, limit) {
  // Сначала возьмите нужный хвост, затем переверните копию.
}`,
    hints: [
      'Последние N элементов можно взять отрицательным индексом в slice().',
      'slice() уже возвращает новый массив — его можно переворачивать безопасно.',
      'Если элементов меньше лимита, вернуть нужно все.',
      'Отдельно проверьте нулевой лимит: slice(-0) вернёт весь массив.'
    ],
    tests: [
      {
        name: 'возвращает последние события первыми',
        code: `expect(latestEvents(['a', 'b', 'c', 'd'], 2)).toEqual(['d', 'c']);`
      },
      {
        name: 'если элементов меньше лимита, возвращает все',
        code: `expect(latestEvents(['a', 'b'], 5)).toEqual(['b', 'a']);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = ['a', 'b', 'c'];
latestEvents(source, 2);
expect(source).toEqual(['a', 'b', 'c']);`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(latestEvents([], 3)).toEqual([]);`
      },
      {
        name: 'нулевой лимит даёт пустой результат',
        code: `expect(latestEvents(['a', 'b', 'c'], 0)).toEqual([]);`
      }
    ],
    solution: `function latestEvents(events, limit) {
  if (limit <= 0) {
    return [];
  }

  return events.slice(-limit).reverse();
}`
  }
]
