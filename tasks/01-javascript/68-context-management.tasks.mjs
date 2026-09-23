export default [
  {
    id: 'js-68-keep-context',
    title: 'Четыре способа не потерять контекст',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Объект `collector` хранит `items` и имеет метод `add(value)`, который ' +
      'кладёт значение в `this.items`. Напишите `runStrategies(values)`, ' +
      'которая складывает значения в четыре разных объекта-сборщика четырьмя ' +
      'способами и возвращает `{ lost, bound, arrow, closure }`: ' +
      '`lost` — имя ошибки при передаче метода напрямую в `forEach`; ' +
      '`bound` — итоговый массив при использовании `bind`; ' +
      '`arrow` — при вызове из стрелки; ' +
      '`closure` — когда вместо `this` используется захваченная переменная.',
    starter: `function createCollector() {
  return {
    items: [],
    add(value) {
      this.items.push(value);
    }
  };
}

function runStrategies(values) {
  return { lost: '', bound: [], arrow: [], closure: [] };
}`,
    hints: [
      'Переданный напрямую метод теряет получателя, и обращение к его полю падает.',
      'bind создаёт функцию с уже закреплённым получателем.',
      'Замыкание вообще не зависит от this: оно держит ссылку на объект.'
    ],
    tests: [
      {
        name: 'прямая передача метода теряет контекст',
        code: `expect(runStrategies([1, 2]).lost).toBe('TypeError');`
      },
      {
        name: 'bind сохраняет получателя',
        code: `expect(runStrategies([1, 2]).bound).toEqual([1, 2]);`
      },
      {
        name: 'стрелка вызывает метод через объект',
        code: `expect(runStrategies(['a', 'b']).arrow).toEqual(['a', 'b']);`
      },
      {
        name: 'замыкание обходится без this',
        code: `expect(runStrategies([1]).closure).toEqual([1]);`
      },
      {
        name: 'сборщики независимы',
        code: `const result = runStrategies([1, 2, 3]);
expect(result.bound).toEqual([1, 2, 3]);
expect(result.arrow).toEqual([1, 2, 3]);
expect(result.closure).toEqual([1, 2, 3]);`
      },
      {
        name: 'пустой список значений',
        code: `const result = runStrategies([]);
expect(result.bound).toEqual([]);
expect(result.closure).toEqual([]);`
      }
    ],
    solution: `function createCollector() {
  return {
    items: [],
    add(value) {
      this.items.push(value);
    }
  };
}

function runStrategies(values) {
  let lost = '';

  const lostCollector = createCollector();

  try {
    values.forEach(lostCollector.add);

    if (values.length === 0) {
      // Без значений метод не вызывается, и потеря контекста не проявится.
      lostCollector.add.call(undefined, 'проверка');
    }
  } catch (error) {
    lost = error.name;
  }

  const boundCollector = createCollector();
  values.forEach(boundCollector.add.bind(boundCollector));

  const arrowCollector = createCollector();
  values.forEach(value => arrowCollector.add(value));

  const closureCollector = createCollector();
  const items = closureCollector.items;
  values.forEach(value => items.push(value));

  return {
    lost,
    bound: boundCollector.items,
    arrow: arrowCollector.items,
    closure: closureCollector.items
  };
}`
  }
]
