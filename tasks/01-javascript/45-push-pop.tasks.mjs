export default [
  {
    id: 'js-45-append-step',
    title: 'Добавить шаг и вернуть длину',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `appendStep(plan, step)`, которая добавляет шаг в конец ' +
      'массива и возвращает новое количество шагов. Исходный массив изменяется — ' +
      'это ожидаемое поведение.',
    starter: `function appendStep(plan, step) {
  // Метод добавления в конец сам возвращает новую длину.
}`,
    hints: [
      'Для добавления в конец есть отдельный метод.',
      'Он возвращает новую длину массива, а не сам массив.',
      'Возвращать нужно именно длину.'
    ],
    tests: [
      {
        name: 'возвращает новую длину',
        code: `expect(appendStep(['login'], 'order')).toBe(2);`
      },
      {
        name: 'добавляет элемент в конец',
        code: `const plan = ['login'];
appendStep(plan, 'order');
expect(plan).toEqual(['login', 'order']);`
      },
      {
        name: 'работает с пустым массивом',
        code: `expect(appendStep([], 'first')).toBe(1);`
      },
      {
        name: 'возвращает число, а не массив',
        code: `expect(typeof appendStep(['a'], 'b')).toBe('number');`
      }
    ],
    solution: `function appendStep(plan, step) {
  return plan.push(step);
}`
  },

  {
    id: 'js-45-take-last',
    title: 'Забрать последний шаг',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `takeLast(plan)`, которая удаляет последний элемент массива ' +
      'и возвращает объект `{ removed, left }`, где `removed` — удалённый элемент ' +
      '(или `null` для пустого массива), а `left` — количество оставшихся шагов.',
    starter: `function takeLast(plan) {
  // Метод удаления с конца возвращает сам удалённый элемент.
}`,
    hints: [
      'Метод удаления с конца возвращает удалённый элемент, а не массив.',
      'На пустом массиве он возвращает undefined — это нужно превратить в null.',
      'Количество оставшихся элементов доступно после удаления.'
    ],
    tests: [
      {
        name: 'возвращает удалённый элемент и остаток',
        code: `expect(takeLast(['login', 'order'])).toEqual({ removed: 'order', left: 1 });`
      },
      {
        name: 'изменяет исходный массив',
        code: `const plan = ['login', 'order'];
takeLast(plan);
expect(plan).toEqual(['login']);`
      },
      {
        name: 'для пустого массива возвращает null',
        code: `expect(takeLast([])).toEqual({ removed: null, left: 0 });`
      },
      {
        name: 'работает с одним элементом',
        code: `expect(takeLast(['solo'])).toEqual({ removed: 'solo', left: 0 });`
      }
    ],
    solution: `function takeLast(plan) {
  const removed = plan.length === 0 ? null : plan.pop();

  return { removed, left: plan.length };
}`
  }
]
