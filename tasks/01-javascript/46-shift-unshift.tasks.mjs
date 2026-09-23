export default [
  {
    id: 'js-46-take-next-task',
    title: 'Взять следующую задачу из очереди',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `takeNext(queue)`, которая забирает первый элемент очереди ' +
      'и возвращает его. Для пустой очереди вернуть `null`. Очередь изменяется.',
    starter: `function takeNext(queue) {
  // Метод удаления с начала возвращает удалённый элемент.
}`,
    hints: [
      'Для удаления с начала есть отдельный метод.',
      'Он возвращает удалённый элемент, а не массив.',
      'На пустом массиве результат — undefined, его нужно превратить в null.'
    ],
    tests: [
      {
        name: 'возвращает первый элемент',
        code: `expect(takeNext(['login', 'order'])).toBe('login');`
      },
      {
        name: 'сдвигает остальные элементы',
        code: `const queue = ['login', 'order', 'pay'];
takeNext(queue);
expect(queue).toEqual(['order', 'pay']);`
      },
      {
        name: 'для пустой очереди возвращает null',
        code: `expect(takeNext([])).toBe(null);`
      },
      {
        name: 'после изъятия индексы смещаются',
        code: `const queue = ['a', 'b'];
takeNext(queue);
expect(queue[0]).toBe('b');`
      }
    ],
    solution: `function takeNext(queue) {
  if (queue.length === 0) {
    return null;
  }

  return queue.shift();
}`
  },

  {
    id: 'js-46-priority-first',
    title: 'Приоритетная задача в начало',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `addPriority(queue, task)`, которая ставит задачу в начало ' +
      'очереди и возвращает объект `{ total, firstChanged }`. Поле `total` — новая ' +
      'длина очереди, `firstChanged` — `true`, если первый элемент изменился ' +
      '(для пустой очереди это тоже считается изменением).',
    starter: `function addPriority(queue, task) {
  // Сравните первый элемент до и после вставки.
}`,
    hints: [
      'Метод вставки в начало возвращает новую длину массива.',
      'Первый элемент нужно запомнить до вставки.',
      'Для пустой очереди прежнего первого элемента не было — считайте это изменением.'
    ],
    tests: [
      {
        name: 'ставит задачу в начало',
        code: `const queue = ['order'];
addPriority(queue, 'login');
expect(queue).toEqual(['login', 'order']);`
      },
      {
        name: 'возвращает новую длину',
        code: `expect(addPriority(['order'], 'login').total).toBe(2);`
      },
      {
        name: 'сообщает об изменении первого элемента',
        code: `expect(addPriority(['order'], 'login').firstChanged).toBe(true);`
      },
      {
        name: 'для пустой очереди тоже считается изменением',
        code: `expect(addPriority([], 'login')).toEqual({ total: 1, firstChanged: true });`
      }
    ],
    solution: `function addPriority(queue, task) {
  const previousFirst = queue.length === 0 ? null : queue[0];
  const total = queue.unshift(task);

  return { total, firstChanged: queue[0] !== previousFirst };
}`
  }
]
