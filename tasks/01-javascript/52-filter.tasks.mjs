export default [
  {
    id: 'js-52-only-failed',
    title: 'Отобрать упавшие тесты',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `onlyFailed(results)`, которая принимает массив ' +
      '`{ name, status }` и возвращает новый массив только с теми элементами, ' +
      'у которых `status` равен `"failed"`. Сами объекты преобразовывать не нужно.',
    starter: `function onlyFailed(results) {
  // Отберите подходящие элементы.
}`,
    hints: [
      'Нужен метод, который оставляет элементы по условию.',
      'Предикат должен вернуть значение, истинное для подходящих элементов.',
      'Количество элементов может уменьшиться, но сами элементы остаются прежними.'
    ],
    tests: [
      {
        name: 'оставляет только упавшие',
        code: `expect(onlyFailed([
  { name: 'login', status: 'passed' },
  { name: 'order', status: 'failed' }
])).toEqual([{ name: 'order', status: 'failed' }]);`
      },
      {
        name: 'если подходящих нет, возвращает пустой массив',
        code: `expect(onlyFailed([{ name: 'login', status: 'passed' }])).toEqual([]);`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(onlyFailed([])).toEqual([]);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = [
  { name: 'login', status: 'passed' },
  { name: 'order', status: 'failed' }
];
onlyFailed(source);
expect(source.length).toBe(2);`
      }
    ],
    solution: `function onlyFailed(results) {
  return results.filter((result) => result.status === 'failed');
}`
  },

  {
    id: 'js-52-drop-empty-titles',
    title: 'Убрать записи без названия',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `withTitle(items)`, которая принимает массив объектов ' +
      '`{ title }` и оставляет только те, у которых `title` — непустая строка. ' +
      'Значения `null`, `undefined`, пустая строка и строка из пробелов не подходят.',
    starter: `function withTitle(items) {
  // Проверьте каждое значение title явно.
}`,
    hints: [
      'Предикат filter() проверяет истинность, поэтому 0 и пустая строка отсеются сами — но этого мало.',
      'Строка из пробелов истинна: нужна проверка после trim().',
      'Значение может оказаться не строкой — учтите это в условии.'
    ],
    tests: [
      {
        name: 'оставляет записи с названием',
        code: `expect(withTitle([{ title: 'login' }, { title: '' }]))
  .toEqual([{ title: 'login' }]);`
      },
      {
        name: 'отсеивает строку из пробелов',
        code: `expect(withTitle([{ title: '   ' }])).toEqual([]);`
      },
      {
        name: 'отсеивает null и undefined',
        code: `expect(withTitle([{ title: null }, { title: undefined }])).toEqual([]);`
      },
      {
        name: 'отсеивает значения, не являющиеся строкой',
        code: `expect(withTitle([{ title: 42 }])).toEqual([]);`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(withTitle([])).toEqual([]);`
      }
    ],
    solution: `function withTitle(items) {
  return items.filter((item) => typeof item.title === 'string' && item.title.trim() !== '');
}`
  }
]
