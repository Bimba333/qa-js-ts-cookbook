export default [
  {
    id: 'js-58-status-allowed',
    title: 'Статус входит в допустимый набор',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `isAllowedStatus(status)`, которая возвращает `true`, ' +
      'если переданное значение входит в набор `"passed"`, `"failed"`, `"skipped"`. ' +
      'Сравнение должно учитывать тип: число или строка в другом регистре не подходят.',
    starter: `const ALLOWED = ['passed', 'failed', 'skipped'];

function isAllowedStatus(status) {
  // Проверьте наличие значения в наборе.
}`,
    hints: [
      'Для проверки наличия значения есть метод, не требующий предиката.',
      'Он сравнивает строго: тип тоже должен совпадать.',
      'Возвращать нужно результат проверки, а не сам набор.'
    ],
    tests: [
      {
        name: 'допустимый статус',
        code: `expect(isAllowedStatus('failed')).toBe(true);`
      },
      {
        name: 'недопустимый статус',
        code: `expect(isAllowedStatus('broken')).toBe(false);`
      },
      {
        name: 'другой регистр не подходит',
        code: `expect(isAllowedStatus('Passed')).toBe(false);`
      },
      {
        name: 'значение другого типа не подходит',
        code: `expect(isAllowedStatus(0)).toBe(false);`
      }
    ],
    solution: `const ALLOWED = ['passed', 'failed', 'skipped'];

function isAllowedStatus(status) {
  return ALLOWED.includes(status);
}`
  },

  {
    id: 'js-58-find-item-by-field',
    title: 'Наличие записи по полю',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `hasItemWithName(items, name)`, которая проверяет, есть ли ' +
      'в массиве объектов `{ name }` запись с указанным именем. Учтите, что ' +
      '`includes()` для объектов сравнивает ссылки и здесь не подходит.',
    starter: `function hasItemWithName(items, name) {
  // includes() сравнит ссылки, а не поля.
}`,
    hints: [
      'Для объектов includes() проверяет идентичность ссылки, а не содержимое.',
      'Нужен метод, принимающий предикат и отвечающий «да или нет».',
      'Сравнивать нужно конкретное поле объекта.'
    ],
    tests: [
      {
        name: 'находит запись по имени',
        code: `expect(hasItemWithName([{ name: 'login' }, { name: 'order' }], 'order')).toBe(true);`
      },
      {
        name: 'если записи нет, возвращает false',
        code: `expect(hasItemWithName([{ name: 'login' }], 'order')).toBe(false);`
      },
      {
        name: 'для пустого массива возвращает false',
        code: `expect(hasItemWithName([], 'login')).toBe(false);`
      },
      {
        name: 'сравнение учитывает регистр',
        code: `expect(hasItemWithName([{ name: 'login' }], 'Login')).toBe(false);`
      }
    ],
    solution: `function hasItemWithName(items, name) {
  return items.some((item) => item.name === name);
}`
  }
]
