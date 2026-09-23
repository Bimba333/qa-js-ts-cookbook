export default [
  {
    id: 'js-34-extract-response-parts',
    title: 'Извлечь части ответа',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `describeResponse(response)`, которая через деструктуризацию ' +
      'извлекает `status` и `body` и возвращает строку вида `200: ok`. Если `status` ' +
      'отсутствует, использовать значение `0`.',
    starter: `function describeResponse(response) {
  // Деструктуризация поддерживает значения по умолчанию.
}`,
    hints: [
      'Значение по умолчанию задаётся прямо в деструктуризации.',
      'Оно срабатывает только при undefined.',
      'Строку удобно собрать шаблонным литералом.'
    ],
    tests: [
      {
        name: 'извлекает поля',
        code: `expect(describeResponse({ status: 200, body: 'ok' })).toBe('200: ok');`
      },
      {
        name: 'подставляет ноль при отсутствии статуса',
        code: `expect(describeResponse({ body: 'ok' })).toBe('0: ok');`
      },
      {
        name: 'не изменяет исходный объект',
        code: `const source = { status: 200, body: 'ok' };
describeResponse(source);
expect(source).toEqual({ status: 200, body: 'ok' });`
      },
      {
        name: 'работает с пустым телом',
        code: `expect(describeResponse({ status: 204, body: '' })).toBe('204: ');`
      }
    ],
    solution: `function describeResponse(response) {
  const { status = 0, body } = response;

  return \`\${status}: \${body}\`;
}`
  },

  {
    id: 'js-34-rename-and-default',
    title: 'Переименование с значением по умолчанию',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `toTestCase(raw)`, которая из объекта `{ name, prio }` ' +
      'возвращает `{ title, priority }`: `title` берётся из `name`, `priority` — из ' +
      '`prio` со значением по умолчанию `LOW`. Используйте деструктуризацию с ' +
      'переименованием.',
    starter: `function toTestCase(raw) {
  // Переименование и значение по умолчанию задаются вместе.
}`,
    hints: [
      'Синтаксис переименования: { name: title }.',
      'Значение по умолчанию ставится после нового имени.',
      'Значение по умолчанию срабатывает только при undefined, но не при null.'
    ],
    tests: [
      {
        name: 'переименовывает поля',
        code: `expect(toTestCase({ name: 'login', prio: 'HIGH' }))
  .toEqual({ title: 'login', priority: 'HIGH' });`
      },
      {
        name: 'подставляет LOW при отсутствии приоритета',
        code: `expect(toTestCase({ name: 'login' }))
  .toEqual({ title: 'login', priority: 'LOW' });`
      },
      {
        name: 'null приоритет остаётся null',
        code: `expect(toTestCase({ name: 'login', prio: null }).priority).toBe(null);`
      },
      {
        name: 'не изменяет исходный объект',
        code: `const source = { name: 'login', prio: 'HIGH' };
toTestCase(source);
expect(source).toEqual({ name: 'login', prio: 'HIGH' });`
      }
    ],
    solution: `function toTestCase(raw) {
  const { name: title, prio: priority = 'LOW' } = raw;

  return { title, priority };
}`
  }
]
