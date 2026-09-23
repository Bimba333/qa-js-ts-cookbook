export default [
  {
    id: 'js-56-has-failure',
    title: 'Есть ли хотя бы одно падение',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `hasFailure(results)`, которая принимает массив ' +
      '`{ name, status }` и возвращает `true`, если хотя бы один тест имеет ' +
      'статус `"failed"`. Результат должен быть строго логическим значением.',
    starter: `function hasFailure(results) {
  // Нужен ответ «да или нет», а не список.
}`,
    hints: [
      'Есть метод, отвечающий на вопрос «есть ли хотя бы один подходящий».',
      'Он возвращает Boolean независимо от того, что вернул предикат.',
      'На пустом массиве ответ — false.'
    ],
    tests: [
      {
        name: 'находит падение',
        code: `expect(hasFailure([
  { name: 'login', status: 'passed' },
  { name: 'order', status: 'failed' }
])).toBe(true);`
      },
      {
        name: 'если падений нет, возвращает false',
        code: `expect(hasFailure([{ name: 'login', status: 'passed' }])).toBe(false);`
      },
      {
        name: 'для пустого массива возвращает false',
        code: `expect(hasFailure([])).toBe(false);`
      },
      {
        name: 'результат строго логический',
        code: `expect(typeof hasFailure([{ name: 'a', status: 'failed' }])).toBe('boolean');`
      }
    ],
    solution: `function hasFailure(results) {
  return results.some((result) => result.status === 'failed');
}`
  },

  {
    id: 'js-56-no-duplicate-names',
    title: 'Проверить отсутствие дубликатов',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `hasDuplicateNames(results)`, которая принимает массив ' +
      '`{ name }` и возвращает `true`, если какое-то имя встречается более одного ' +
      'раза. Используйте индекс элемента и сравнение с позицией первого вхождения.',
    starter: `function hasDuplicateNames(results) {
  // Предикат получает не только элемент, но и его индекс.
}`,
    hints: [
      'Предикат принимает второй аргумент — индекс текущего элемента.',
      'У массива есть метод поиска позиции первого вхождения значения.',
      'Если позиция первого вхождения не совпадает с текущим индексом, это дубликат.'
    ],
    tests: [
      {
        name: 'находит дубликат',
        code: `expect(hasDuplicateNames([{ name: 'login' }, { name: 'login' }])).toBe(true);`
      },
      {
        name: 'если дубликатов нет, возвращает false',
        code: `expect(hasDuplicateNames([{ name: 'login' }, { name: 'order' }])).toBe(false);`
      },
      {
        name: 'для пустого массива возвращает false',
        code: `expect(hasDuplicateNames([])).toBe(false);`
      },
      {
        name: 'один элемент дубликатом не является',
        code: `expect(hasDuplicateNames([{ name: 'solo' }])).toBe(false);`
      },
      {
        name: 'находит дубликат не подряд',
        code: `expect(hasDuplicateNames([
  { name: 'a' }, { name: 'b' }, { name: 'a' }
])).toBe(true);`
      }
    ],
    solution: `function hasDuplicateNames(results) {
  const names = results.map((result) => result.name);

  return names.some((name, index) => names.indexOf(name) !== index);
}`
  }
]
