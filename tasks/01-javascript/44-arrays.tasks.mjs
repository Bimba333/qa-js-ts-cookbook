export default [
  {
    id: 'js-44-last-item',
    title: 'Последний элемент плана',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `lastStep(plan)`, которая возвращает последний элемент ' +
      'массива. Для пустого массива функция возвращает `null`. Индекс вычислите ' +
      'через длину массива.',
    starter: `function lastStep(plan) {
  // Последний индекс не равен length.
}`,
    hints: [
      'length — это количество элементов, а не последний индекс.',
      'Последний индекс на единицу меньше длины.',
      'Пустой массив нужно обработать отдельно, иначе индекс станет -1.'
    ],
    tests: [
      {
        name: 'возвращает последний элемент',
        code: `expect(lastStep(['login', 'order', 'logout'])).toBe('logout');`
      },
      {
        name: 'для пустого массива возвращает null',
        code: `expect(lastStep([])).toBe(null);`
      },
      {
        name: 'работает с одним элементом',
        code: `expect(lastStep(['solo'])).toBe('solo');`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = ['a', 'b'];
lastStep(source);
expect(source).toEqual(['a', 'b']);`
      }
    ],
    solution: `function lastStep(plan) {
  if (plan.length === 0) {
    return null;
  }

  return plan[plan.length - 1];
}`
  },

  {
    id: 'js-44-step-positions',
    title: 'Позиции шагов для отчёта',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `stepPositions(plan)`, которая принимает массив строк и ' +
      'возвращает массив объектов `{ position, step }`, где `position` — номер шага ' +
      'начиная с единицы. Порядок сохраняется.',
    starter: `function stepPositions(plan) {
  // Индекс начинается с нуля, а номер шага — с единицы.
}`,
    hints: [
      'Длина результата совпадает с длиной исходного массива.',
      'Колбэк получает второй аргумент — индекс.',
      'Возвращайте новый объект на каждый элемент.'
    ],
    tests: [
      {
        name: 'нумерует шаги с единицы',
        code: `expect(stepPositions(['login', 'order'])).toEqual([
  { position: 1, step: 'login' },
  { position: 2, step: 'order' }
]);`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(stepPositions([])).toEqual([]);`
      },
      {
        name: 'сохраняет длину',
        code: `expect(stepPositions(['a', 'b', 'c']).length).toBe(3);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = ['a'];
stepPositions(source);
expect(source).toEqual(['a']);`
      }
    ],
    solution: `function stepPositions(plan) {
  return plan.map((step, index) => ({ position: index + 1, step }));
}`
  }
]
