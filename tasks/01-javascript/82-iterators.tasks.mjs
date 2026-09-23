export default [
  {
    id: 'js-82-iterator-is-single-use',
    title: 'Итератор одноразовый',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `createIterator(items)` — итератор по массиву: метод `next()` ' +
      'возвращает `{ value, done }`, после исчерпания всегда ' +
      '`{ value: undefined, done: true }`. Итератор должен сам быть итерируемым ' +
      '(метод `[Symbol.iterator]()` возвращает себя). Напишите ' +
      '`drain(iterator)` — собирает оставшиеся значения в массив через `next()`.',
    starter: `function createIterator(items) {
  return {
    next() { return { value: undefined, done: true }; }
  };
}

function drain(iterator) {
  return [];
}`,
    hints: [
      'Состояние обхода живёт в самом итераторе, а не в коллекции.',
      'Возврат себя из Symbol.iterator делает итератор пригодным для for...of.',
      'Обход останавливается, когда done становится истинным.'
    ],
    tests: [
      {
        name: 'значения выдаются по порядку',
        code: `const iterator = createIterator(['a', 'b']);
expect(iterator.next()).toEqual({ value: 'a', done: false });
expect(iterator.next()).toEqual({ value: 'b', done: false });
expect(iterator.next()).toEqual({ value: undefined, done: true });`
      },
      {
        name: 'после исчерпания состояние не меняется',
        code: `const iterator = createIterator(['a']);
iterator.next();
iterator.next();
expect(iterator.next()).toEqual({ value: undefined, done: true });`
      },
      {
        name: 'итератор годится для for...of',
        code: `const collected = [];
for (const value of createIterator([1, 2, 3])) {
  collected.push(value);
}
expect(collected).toEqual([1, 2, 3]);`
      },
      {
        name: 'повторный обход того же итератора пуст',
        code: `const iterator = createIterator([1, 2]);
expect([...iterator]).toEqual([1, 2]);
expect([...iterator]).toEqual([]);`
      },
      {
        name: 'drain собирает оставшееся',
        code: `const iterator = createIterator(['a', 'b', 'c']);
iterator.next();
expect(drain(iterator)).toEqual(['b', 'c']);`
      },
      {
        name: 'пустой источник',
        code: `expect(drain(createIterator([]))).toEqual([]);`
      },
      {
        name: 'разные итераторы независимы',
        code: `const source = [1, 2];
const first = createIterator(source);
first.next();
expect(drain(createIterator(source))).toEqual([1, 2]);`
      }
    ],
    solution: `function createIterator(items) {
  let index = 0;

  const iterator = {
    next() {
      if (index >= items.length) {
        return { value: undefined, done: true };
      }

      const value = items[index];
      index += 1;

      return { value, done: false };
    },
    [Symbol.iterator]() {
      return iterator;
    }
  };

  return iterator;
}

function drain(iterator) {
  const values = [];

  while (true) {
    const step = iterator.next();

    if (step.done) {
      return values;
    }

    values.push(step.value);
  }
}`
  }
]
