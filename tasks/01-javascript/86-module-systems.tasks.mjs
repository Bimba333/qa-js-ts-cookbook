export default [
  {
    id: 'js-86-named-and-default',
    title: 'Именованный экспорт и экспорт по умолчанию',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `importFrom(moduleObject, request)`, которая повторяет ' +
      'правила импорта. `request` — объект вида `{ default: имя, named: [имена] }`, ' +
      'любое поле может отсутствовать. Функция возвращает объект с ' +
      'запрошенными именами. Экспорт по умолчанию лежит в свойстве `default`. ' +
      'Если запрошенного именованного экспорта нет, бросьте `SyntaxError` с ' +
      'сообщением `экспорт не найден`; если запрошен экспорт по умолчанию, а ' +
      'его нет, — то же сообщение.',
    starter: `function importFrom(moduleObject, request) {
  // Экспорт по умолчанию и именованные экспорты живут в одном объекте.

  return {};
}`,
    hints: [
      'Экспорт по умолчанию — обычное свойство `default`, просто с особым смыслом при импорте.',
      'Имя, под которым импортируется экспорт по умолчанию, выбирает импортирующая сторона, а именованные — нет.',
      'Отсутствие экспорта проверяется наличием свойства, а не значением: экспортированный `undefined` — это экспорт.'
    ],
    tests: [
      {
        name: 'именованные экспорты переносятся как есть',
        code: `expect(importFrom(
  { createClient: 'C', parse: 'P' },
  { named: ['parse'] }
)).toEqual({ parse: 'P' });`
      },
      {
        name: 'экспорт по умолчанию получает выбранное имя',
        code: `expect(importFrom(
  { default: 'главный' },
  { default: 'client' }
)).toEqual({ client: 'главный' });`
      },
      {
        name: 'можно запросить и то и другое',
        code: `expect(importFrom(
  { default: 'главный', parse: 'P' },
  { default: 'client', named: ['parse'] }
)).toEqual({ client: 'главный', parse: 'P' });`
      },
      {
        name: 'отсутствующий именованный экспорт — ошибка',
        code: `expect(() => importFrom({ parse: 'P' }, { named: ['нет'] }))
  .toThrow('экспорт не найден');`
      },
      {
        name: 'отсутствующий экспорт по умолчанию — ошибка',
        code: `expect(() => importFrom({ parse: 'P' }, { default: 'client' }))
  .toThrow('экспорт не найден');`
      },
      {
        name: 'экспортированный `undefined` является экспортом',
        code: `expect(importFrom({ nothing: undefined }, { named: ['nothing'] }))
  .toEqual({ nothing: undefined });`
      },
      {
        name: 'пустой запрос даёт пустой объект',
        code: `expect(importFrom({ parse: 'P' }, {})).toEqual({});`
      }
    ],
    solution: `function importFrom(moduleObject, request) {
  const result = {};

  if (request.default !== undefined) {
    if (!Object.hasOwn(moduleObject, 'default')) {
      throw new SyntaxError('экспорт не найден');
    }

    result[request.default] = moduleObject.default;
  }

  for (const name of request.named ?? []) {
    if (!Object.hasOwn(moduleObject, name)) {
      throw new SyntaxError('экспорт не найден');
    }

    result[name] = moduleObject[name];
  }

  return result;
}`
  }
]
