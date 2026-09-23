export default [
  {
    id: 'js-16-same-value',
    title: 'Сравнение с учётом особых значений',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `sameValue(first, second)`, которая возвращает `true`, если ' +
      'значения считаются одинаковыми: обычные значения сравниваются строго, ' +
      '`NaN` равен `NaN`, а `+0` и `-0` считаются **разными**.',
    starter: `function sameValue(first, second) {
  // Оператор === не различает нули и не считает NaN равным себе.
}`,
    hints: [
      'Строгое равенство даёт false для пары NaN и true для +0 и -0.',
      'В языке есть встроенная функция сравнения с нужными правилами.',
      'Возвращать нужно строго логическое значение.'
    ],
    tests: [
      {
        name: 'одинаковые строки равны',
        code: `expect(sameValue('a', 'a')).toBe(true);`
      },
      {
        name: 'NaN равен NaN',
        code: `expect(sameValue(NaN, NaN)).toBe(true);`
      },
      {
        name: 'плюс ноль и минус ноль различаются',
        code: `expect(sameValue(0, -0)).toBe(false);`
      },
      {
        name: 'разные типы не равны',
        code: `expect(sameValue(1, '1')).toBe(false);`
      },
      {
        name: 'разные объекты не равны',
        code: `expect(sameValue({ a: 1 }, { a: 1 })).toBe(false);`
      }
    ],
    solution: `function sameValue(first, second) {
  return Object.is(first, second);
}`
  },

  {
    id: 'js-16-shallow-equal',
    title: 'Сравнение объектов по содержимому',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `shallowEqual(first, second)`, которая возвращает `true`, ' +
      'если у объектов одинаковый набор ключей и все значения строго равны. ' +
      'Вложенные объекты сравнивать по содержимому не нужно — только верхний уровень.',
    starter: `function shallowEqual(first, second) {
  // Оператор === сравнивает ссылки, а нужно содержимое.
}`,
    hints: [
      'Сначала сравните количество ключей.',
      'Затем проверьте каждое значение по ключу.',
      'Вложенный объект сравнивается по ссылке — это ожидаемо.'
    ],
    tests: [
      {
        name: 'одинаковое содержимое',
        code: `expect(shallowEqual({ a: 1, b: 'x' }, { a: 1, b: 'x' })).toBe(true);`
      },
      {
        name: 'разные значения',
        code: `expect(shallowEqual({ a: 1 }, { a: 2 })).toBe(false);`
      },
      {
        name: 'лишний ключ',
        code: `expect(shallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);`
      },
      {
        name: 'порядок ключей не важен',
        code: `expect(shallowEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);`
      },
      {
        name: 'вложенные объекты сравниваются по ссылке',
        code: `const nested = { n: 1 };
expect(shallowEqual({ a: nested }, { a: nested })).toBe(true);
expect(shallowEqual({ a: { n: 1 } }, { a: { n: 1 } })).toBe(false);`
      }
    ],
    solution: `function shallowEqual(first, second) {
  const firstKeys = Object.keys(first);
  const secondKeys = Object.keys(second);

  if (firstKeys.length !== secondKeys.length) {
    return false;
  }

  return firstKeys.every((key) => first[key] === second[key]);
}`
  }
]
