export default [
  {
    id: 'js-37-object-entries-report',
    title: 'Отчёт из объекта через entries',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `countsToLines(counts)`, которая принимает объект вида ' +
      '`{ passed: 2, failed: 1 }` и возвращает массив строк `"passed: 2"`, ' +
      'отсортированный по ключу. Для пустого объекта вернуть пустой массив.',
    starter: `function countsToLines(counts) {
  // Объект нельзя обойти циклом for...of напрямую.
}`,
    hints: [
      'Пары «ключ — значение» даёт Object.entries.',
      'Результат entries — обычный массив, его можно сортировать и преобразовывать.',
      'Сортировка строк выполняется компаратором или localeCompare.'
    ],
    tests: [
      {
        name: 'собирает строки',
        code: `expect(countsToLines({ passed: 2, failed: 1 })).toEqual(['failed: 1', 'passed: 2']);`
      },
      {
        name: 'для пустого объекта возвращает пустой массив',
        code: `expect(countsToLines({})).toEqual([]);`
      },
      {
        name: 'сортирует по ключу независимо от порядка полей',
        code: `expect(countsToLines({ z: 1, a: 2 })).toEqual(['a: 2', 'z: 1']);`
      },
      {
        name: 'не изменяет исходный объект',
        code: `const source = { passed: 1 };
countsToLines(source);
expect(source).toEqual({ passed: 1 });`
      }
    ],
    solution: `function countsToLines(counts) {
  return Object.entries(counts)
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([key, value]) => key + ': ' + value);
}`
  },

  {
    id: 'js-37-own-property-check',
    title: 'Проверка собственного свойства',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `hasOwnField(item, field)`, которая возвращает `true`, только ' +
      'если свойство принадлежит **самому объекту**, а не унаследовано. Свойства ' +
      'из прототипа учитываться не должны.',
    starter: `function hasOwnField(item, field) {
  // Оператор in находит и унаследованные свойства.
}`,
    hints: [
      'Оператор in проверяет всю цепочку прототипов.',
      'Для собственных свойств есть отдельная проверка.',
      'Значение undefined у собственного свойства всё равно считается своим.'
    ],
    tests: [
      {
        name: 'находит собственное свойство',
        code: `expect(hasOwnField({ name: 'login' }, 'name')).toBe(true);`
      },
      {
        name: 'унаследованное свойство не считается своим',
        code: `const parent = { shared: 1 };
const child = Object.create(parent);
expect(hasOwnField(child, 'shared')).toBe(false);`
      },
      {
        name: 'отсутствующее свойство',
        code: `expect(hasOwnField({ name: 'login' }, 'status')).toBe(false);`
      },
      {
        name: 'собственное свойство со значением undefined считается своим',
        code: `expect(hasOwnField({ name: undefined }, 'name')).toBe(true);`
      },
      {
        name: 'оператор in дал бы другой ответ',
        code: `const parent = { shared: 1 };
const child = Object.create(parent);
expect(('shared' in child) === hasOwnField(child, 'shared')).toBe(false);`
      }
    ],
    solution: `function hasOwnField(item, field) {
  return Object.hasOwn(item, field);
}`
  }
]
