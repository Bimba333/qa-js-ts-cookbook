export default [
  {
    id: 'js-07-counter',
    title: 'Счётчик на замыкании',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `createCounter`, которая возвращает функцию-счётчик. ' +
      'Каждый вызов счётчика возвращает число на единицу больше предыдущего, ' +
      'начиная с единицы. Два независимо созданных счётчика не должны влиять друг на друга.',
    starter: `function createCounter() {
  // Верните функцию, которая при каждом вызове отдаёт следующее число.
}`,
    hints: [
      'Переменная, объявленная внутри createCounter, живёт дольше самого вызова, если на неё ссылается возвращённая функция.',
      'Счётчик нужно хранить в scope функции createCounter, а не в global scope.',
      'Возвращаемая функция может увеличивать переменную и сразу возвращать новое значение.'
    ],
    tests: [
      {
        name: 'первый вызов возвращает 1',
        code: `const next = createCounter();
expect(next()).toBe(1);`
      },
      {
        name: 'последовательные вызовы увеличивают значение',
        code: `const next = createCounter();
next();
next();
expect(next()).toBe(3);`
      },
      {
        name: 'счётчики независимы друг от друга',
        code: `const first = createCounter();
const second = createCounter();
first();
first();
expect(second()).toBe(1);`
      },
      {
        name: 'счётчик не создаёт глобальную переменную',
        code: `const next = createCounter();
next();
expect(typeof globalThis.count).toBe('undefined');`
      }
    ],
    solution: `function createCounter() {
  let count = 0;

  return function next() {
    count += 1;
    return count;
  };
}`
  },

  {
    id: 'js-07-shadowing',
    title: 'Затенение переменной',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Функция `describeScope` должна вернуть массив из трёх строк: значение `level` ' +
      'в global scope, в function scope и в block scope. Объявите переменные так, ' +
      'чтобы внутренние scope затеняли внешние, и соберите значения в правильном порядке.',
    starter: `const level = 'global';

function describeScope() {
  // Объявите level со значением 'function',
  // а внутри блока — со значением 'block'.
  // Верните [значение global, значение function, значение block].
}`,
    hints: [
      'Значение внешнего scope нужно сохранить до того, как его затенит внутреннее объявление.',
      'Внутри блока { } объявление через let создаёт отдельную переменную.',
      'Соберите значения по мере того, как они становятся видимыми: сначала внешнее, потом своё.'
    ],
    tests: [
      {
        name: 'возвращает три значения по порядку',
        code: `expect(describeScope()).toEqual(['global', 'function', 'block']);`
      },
      {
        name: 'внешняя переменная не изменилась',
        code: `describeScope();
expect(level).toBe('global');`
      }
    ],
    solution: `const level = 'global';

function describeScope() {
  const outer = level;
  const level2 = 'function';
  let blockValue;

  {
    const level = 'block';
    blockValue = level;
  }

  return [outer, level2, blockValue];
}`
  },

  {
    id: 'js-07-private-state',
    title: 'Приватное состояние без глобальных переменных',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `createStore`, которая возвращает объект с методами ' +
      '`add(item)`, `all()` и `size()`. Список элементов должен быть недоступен снаружи: ' +
      'изменить его можно только через `add`, а `all()` должен возвращать копию.',
    starter: `function createStore() {
  // Верните объект с методами add, all и size.
}`,
    hints: [
      'Массив, объявленный внутри createStore, виден только методам, созданным в том же scope.',
      'Если all() вернёт сам массив, вызывающий код сможет изменить внутреннее состояние.',
      'Копию массива можно получить через срез или расширение.'
    ],
    tests: [
      {
        name: 'новый store пуст',
        code: `const store = createStore();
expect(store.size()).toBe(0);
expect(store.all()).toEqual([]);`
      },
      {
        name: 'add добавляет элементы по порядку',
        code: `const store = createStore();
store.add('a');
store.add('b');
expect(store.all()).toEqual(['a', 'b']);
expect(store.size()).toBe(2);`
      },
      {
        name: 'all возвращает копию, а не внутренний массив',
        code: `const store = createStore();
store.add('a');
const items = store.all();
items.push('подделка');
expect(store.size()).toBe(1);`
      },
      {
        name: 'stores не делят состояние',
        code: `const first = createStore();
const second = createStore();
first.add('a');
expect(second.size()).toBe(0);`
      }
    ],
    solution: `function createStore() {
  const items = [];

  return {
    add(item) {
      items.push(item);
    },
    all() {
      return [...items];
    },
    size() {
      return items.length;
    }
  };
}`
  }
]
