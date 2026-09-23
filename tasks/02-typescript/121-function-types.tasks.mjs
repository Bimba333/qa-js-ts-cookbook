export default [
  {
    id: 'ts-121-function-as-contract',
    title: 'Тип функции — договор вызова',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите тип `Matcher = (value: string) => boolean` и напишите ' +
      '`filterBy(values: string[], matcher: Matcher): string[]`, ' +
      '`negate(matcher: Matcher): Matcher` — возвращает функцию с обратным ' +
      'результатом, и `all(matchers: Matcher[]): Matcher` — функцию, истинную, ' +
      'когда истинны все переданные (для пустого списка — всегда истинна). ' +
      'Исходный массив изменяться не должен.',
    starter: `type Matcher = (value: string) => boolean;

function filterBy(values: string[], matcher: Matcher): string[] {
  return [];
}

function negate(matcher: Matcher): Matcher {
  return () => false;
}

function all(matchers: Matcher[]): Matcher {
  return () => false;
}`,
    hints: [
      'Функция, возвращающая функцию, задаётся тем же типом Matcher.',
      'Пустой набор условий не должен никого отбрасывать.',
      'Проверка всех условий останавливается на первом ложном.'
    ],
    tests: [
      {
        name: 'фильтрация по условию',
        code: `expect(filterBy(['aa', 'b', 'ccc'], value => value.length > 1)).toEqual(['aa', 'ccc']);`
      },
      {
        name: 'исходный массив не меняется',
        code: `const values = ['aa', 'b'];
filterBy(values, value => value.length > 1);
expect(values).toEqual(['aa', 'b']);`
      },
      {
        name: 'отрицание переворачивает результат',
        code: `const isLong = (value: string) => value.length > 1;
expect(negate(isLong)('b')).toBe(true);
expect(negate(isLong)('aa')).toBe(false);`
      },
      {
        name: 'объединение условий',
        code: `const combined = all([
  value => value.length > 1,
  value => value.startsWith('a')
]);
expect(combined('aa')).toBe(true);
expect(combined('bb')).toBe(false);`
      },
      {
        name: 'пустой набор условий истинен',
        code: `expect(all([])('что угодно')).toBe(true);`
      },
      {
        name: 'функции сочетаются между собой',
        code: `const isLong = (value: string) => value.length > 1;
expect(filterBy(['aa', 'b'], negate(isLong))).toEqual(['b']);`
      }
    ],
    solution: `type Matcher = (value: string) => boolean;

function filterBy(values: string[], matcher: Matcher): string[] {
  return values.filter(value => matcher(value));
}

function negate(matcher: Matcher): Matcher {
  return value => !matcher(value);
}

function all(matchers: Matcher[]): Matcher {
  return value => matchers.every(matcher => matcher(value));
}`
  }
]
