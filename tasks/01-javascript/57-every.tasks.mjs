export default [
  {
    id: 'js-57-all-passed',
    title: 'Все тесты прошли',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `allPassed(results)`, которая принимает массив ' +
      '`{ name, status }` и возвращает `true`, только если прогон непустой ' +
      'и все тесты имеют статус `"passed"`. Пустой прогон успешным не считается.',
    starter: `function allPassed(results) {
  // Учтите, что на пустом массиве every() возвращает true.
}`,
    hints: [
      'Есть метод, проверяющий условие для всех элементов.',
      'На пустом массиве он возвращает true — это нужно обработать отдельно.',
      'Сначала убедитесь, что элементы вообще есть.'
    ],
    tests: [
      {
        name: 'все прошли',
        code: `expect(allPassed([
  { name: 'login', status: 'passed' },
  { name: 'order', status: 'passed' }
])).toBe(true);`
      },
      {
        name: 'одно падение делает результат ложным',
        code: `expect(allPassed([
  { name: 'login', status: 'passed' },
  { name: 'order', status: 'failed' }
])).toBe(false);`
      },
      {
        name: 'пустой прогон успешным не считается',
        code: `expect(allPassed([])).toBe(false);`
      },
      {
        name: 'результат строго логический',
        code: `expect(typeof allPassed([{ name: 'a', status: 'passed' }])).toBe('boolean');`
      }
    ],
    solution: `function allPassed(results) {
  return results.length > 0 && results.every((result) => result.status === 'passed');
}`
  },

  {
    id: 'js-57-required-fields-present',
    title: 'Все записи заполнены',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `allHaveFields(items, fields)`, которая принимает массив ' +
      'объектов и массив обязательных имён полей. Функция возвращает `true`, если ' +
      'у каждого объекта присутствуют все указанные поля со значением, отличным от ' +
      '`undefined` и `null`. Пустой массив объектов считается допустимым.',
    starter: `function allHaveFields(items, fields) {
  // Проверка нужна по каждому объекту и по каждому полю.
}`,
    hints: [
      'Здесь нужны две вложенные проверки «для всех».',
      'Значение 0 и пустая строка являются допустимыми — проверяйте только undefined и null.',
      'Для пустого массива объектов ответ — true.'
    ],
    tests: [
      {
        name: 'все поля на месте',
        code: `expect(allHaveFields([{ id: 1, name: 'a' }], ['id', 'name'])).toBe(true);`
      },
      {
        name: 'отсутствующее поле даёт false',
        code: `expect(allHaveFields([{ id: 1 }], ['id', 'name'])).toBe(false);`
      },
      {
        name: 'null и undefined не считаются заполненными',
        code: `expect(allHaveFields([{ id: null, name: 'a' }], ['id', 'name'])).toBe(false);`
      },
      {
        name: 'ноль и пустая строка считаются заполненными',
        code: `expect(allHaveFields([{ id: 0, name: '' }], ['id', 'name'])).toBe(true);`
      },
      {
        name: 'пустой массив объектов допустим',
        code: `expect(allHaveFields([], ['id'])).toBe(true);`
      }
    ],
    solution: `function allHaveFields(items, fields) {
  return items.every((item) =>
    fields.every((field) => item[field] !== undefined && item[field] !== null));
}`
  }
]
