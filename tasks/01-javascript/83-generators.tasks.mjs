export default [
  {
    id: 'js-83-lazy-ids',
    title: 'Ленивый генератор идентификаторов',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию-генератор `idSequence(prefix)`, которая бесконечно выдаёт ' +
      'строки `<prefix>-1`, `<prefix>-2` и так далее. Затем напишите функцию ' +
      '`takeIds(generator, count)`, которая берёт из него указанное число значений.',
    starter: `function* idSequence(prefix) {
  // Бесконечный цикл безопасен: значения вычисляются по требованию.
}

function takeIds(generator, count) {
  // Возьмите ровно count значений.
}`,
    hints: [
      'Функция-генератор объявляется через function*.',
      'Бесконечный цикл в генераторе не зависает: значения выдаются по запросу.',
      'Значения берутся вызовами next() или обходом с ограничением.'
    ],
    tests: [
      {
        name: 'выдаёт последовательные идентификаторы',
        code: `expect(takeIds(idSequence('task'), 3)).toEqual(['task-1', 'task-2', 'task-3']);`
      },
      {
        name: 'нулевое количество даёт пустой массив',
        code: `expect(takeIds(idSequence('task'), 0)).toEqual([]);`
      },
      {
        name: 'два генератора независимы',
        code: `const first = idSequence('a');
takeIds(first, 2);
expect(takeIds(idSequence('b'), 1)).toEqual(['b-1']);`
      },
      {
        name: 'продолжает с места остановки',
        code: `const generator = idSequence('task');
takeIds(generator, 2);
expect(takeIds(generator, 1)).toEqual(['task-3']);`
      }
    ],
    solution: `function* idSequence(prefix) {
  let number = 1;

  while (true) {
    yield prefix + '-' + number;
    number += 1;
  }
}

function takeIds(generator, count) {
  const values = [];

  for (let index = 0; index < count; index += 1) {
    values.push(generator.next().value);
  }

  return values;
}`
  },

  {
    id: 'js-83-return-not-in-spread',
    title: 'Что попадает в результат обхода',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию-генератор `steps()`, которая выдаёт `"first"` и `"second"`, ' +
      'а затем возвращает через `return` значение `"done"`. Напишите функции ' +
      '`collectBySpread()` и `collectByNext()`: первая собирает значения через spread, ' +
      'вторая — ручным обходом, включая значение из `return`.',
    starter: `function* steps() {
  // Два yield и один return.
}

function collectBySpread() {
  // Spread берёт только значения с done: false.
}

function collectByNext() {
  // Ручной обход видит и значение из return.
}`,
    hints: [
      'Значение из return приходит вместе с done: true.',
      'Spread и for...of такие значения игнорируют.',
      'Ручной обход через next() позволяет их получить.'
    ],
    tests: [
      {
        name: 'spread не включает значение из return',
        code: `expect(collectBySpread()).toEqual(['first', 'second']);`
      },
      {
        name: 'ручной обход включает значение из return',
        code: `expect(collectByNext()).toEqual(['first', 'second', 'done']);`
      },
      {
        name: 'генератор сам является iterable',
        code: `expect(typeof steps()[Symbol.iterator]).toBe('function');`
      },
      {
        name: 'повторный обход начинается сначала',
        code: `expect(collectBySpread()).toEqual(collectBySpread());`
      }
    ],
    solution: `function* steps() {
  yield 'first';
  yield 'second';

  return 'done';
}

function collectBySpread() {
  return [...steps()];
}

function collectByNext() {
  const generator = steps();
  const values = [];

  while (true) {
    const step = generator.next();
    values.push(step.value);

    if (step.done) {
      return values;
    }
  }
}`
  }
]
