export default [
  {
    id: 'js-53-sum-durations',
    title: 'Суммарная длительность прогона',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `totalDuration(results)`, которая принимает массив результатов ' +
      'тестов вида `{ name, durationMs }` и возвращает суммарную длительность. ' +
      'Для пустого массива функция возвращает 0.',
    starter: `function totalDuration(results) {
  // Сверните массив в одно число.
}`,
    hints: [
      'Свёртка массива в одно значение — это reduce.',
      'У reduce есть второй аргумент: начальное значение аккумулятора.',
      'Без начального значения reduce на пустом массиве выбрасывает ошибку.'
    ],
    tests: [
      {
        name: 'суммирует длительности',
        code: `expect(totalDuration([
  { name: 'a', durationMs: 120 },
  { name: 'b', durationMs: 80 }
])).toBe(200);`
      },
      {
        name: 'для пустого массива возвращает 0',
        code: `expect(totalDuration([])).toBe(0);`
      },
      {
        name: 'работает с одним элементом',
        code: `expect(totalDuration([{ name: 'a', durationMs: 42 }])).toBe(42);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = [{ name: 'a', durationMs: 10 }];
totalDuration(source);
expect(source).toEqual([{ name: 'a', durationMs: 10 }]);`
      }
    ],
    solution: `function totalDuration(results) {
  return results.reduce((sum, result) => sum + result.durationMs, 0);
}`
  },

  {
    id: 'js-53-group-by-status',
    title: 'Группировка результатов по статусу',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `groupByStatus(results)`, которая принимает массив ' +
      '`{ name, status }` и возвращает объект, где ключ — статус, а значение — ' +
      'массив имён тестов с этим статусом. Порядок имён должен совпадать с исходным.',
    starter: `function groupByStatus(results) {
  // Соберите объект вида { passed: ['a'], failed: ['b'] }.
}`,
    hints: [
      'Аккумулятором reduce может быть не только число, но и объект.',
      'Перед добавлением имени нужно убедиться, что массив для этого статуса уже создан.',
      'Возвращайте аккумулятор на каждом шаге, иначе следующая итерация получит undefined.'
    ],
    tests: [
      {
        name: 'группирует по статусу',
        code: `expect(groupByStatus([
  { name: 'a', status: 'passed' },
  { name: 'b', status: 'failed' },
  { name: 'c', status: 'passed' }
])).toEqual({ passed: ['a', 'c'], failed: ['b'] });`
      },
      {
        name: 'для пустого массива возвращает пустой объект',
        code: `expect(groupByStatus([])).toEqual({});`
      },
      {
        name: 'сохраняет исходный порядок имён',
        code: `const grouped = groupByStatus([
  { name: 'z', status: 'passed' },
  { name: 'a', status: 'passed' }
]);
expect(grouped.passed).toEqual(['z', 'a']);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = [{ name: 'a', status: 'passed' }];
groupByStatus(source);
expect(source).toEqual([{ name: 'a', status: 'passed' }]);`
      }
    ],
    solution: `function groupByStatus(results) {
  return results.reduce((groups, result) => {
    if (!groups[result.status]) {
      groups[result.status] = [];
    }

    groups[result.status].push(result.name);
    return groups;
  }, {});
}`
  }
]
