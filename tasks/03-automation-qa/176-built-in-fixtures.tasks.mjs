export default [
  {
    id: 'qa-176-who-closes-what',
    title: 'Кто создал, тот и закрывает',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `auditOwnership(events)`, которая по журналу событий ' +
      'находит нарушения владения. Событие — ' +
      '`{ action, resource, by }`, где `action` — `create` или `close`, ' +
      '`by` — `runner` или `test`. Верните отсортированный список проблем: ' +
      '`тест закрыл чужое: <ресурс>` — тест закрыл ресурс, созданный раннером; ' +
      '`не закрыт: <ресурс>` — ресурс, созданный тестом и не закрытый к концу; ' +
      '`закрыт дважды: <ресурс>` — повторное закрытие. Ресурсы раннера тест ' +
      'закрывать не обязан, и их незакрытость проблемой не является.',
    starter: `function auditOwnership(events) {
  // У каждого ресурса есть создатель, и именно он отвечает за закрытие.

  return [];
}`,
    hints: [
      'Для каждого ресурса достаточно помнить, кто его создал и закрыт ли он.',
      'Незакрытые ресурсы проверяются после обхода всех событий, а не по ходу.',
      'Проблемы копятся в список и сортируются один раз в конце.'
    ],
    tests: [
      {
        name: 'обычный прогон без нарушений',
        code: `expect(auditOwnership([
  { action: 'create', resource: 'page', by: 'runner' },
  { action: 'close', resource: 'page', by: 'runner' }
])).toEqual([]);`
      },
      {
        name: 'тест закрыл ресурс раннера',
        code: `expect(auditOwnership([
  { action: 'create', resource: 'page', by: 'runner' },
  { action: 'close', resource: 'page', by: 'test' }
])).toEqual(['тест закрыл чужое: page']);`
      },
      {
        name: 'созданный тестом ресурс не закрыт',
        code: `expect(auditOwnership([
  { action: 'create', resource: 'extraContext', by: 'test' }
])).toEqual(['не закрыт: extraContext']);`
      },
      {
        name: 'ресурс раннера можно не закрывать',
        code: `expect(auditOwnership([
  { action: 'create', resource: 'page', by: 'runner' }
])).toEqual([]);`
      },
      {
        name: 'повторное закрытие отмечается',
        code: `expect(auditOwnership([
  { action: 'create', resource: 'ctx', by: 'test' },
  { action: 'close', resource: 'ctx', by: 'test' },
  { action: 'close', resource: 'ctx', by: 'test' }
])).toEqual(['закрыт дважды: ctx']);`
      },
      {
        name: 'несколько проблем сортируются',
        code: `expect(auditOwnership([
  { action: 'create', resource: 'page', by: 'runner' },
  { action: 'close', resource: 'page', by: 'test' },
  { action: 'create', resource: 'ctx', by: 'test' }
])).toEqual(['не закрыт: ctx', 'тест закрыл чужое: page']);`
      },
      {
        name: 'пустой журнал',
        code: `expect(auditOwnership([])).toEqual([]);`
      }
    ],
    solution: `function auditOwnership(events) {
  const resources = new Map();
  const problems = [];

  for (const event of events) {
    if (event.action === 'create') {
      resources.set(event.resource, { owner: event.by, closed: false });
      continue;
    }

    const resource = resources.get(event.resource);

    if (!resource) continue;

    if (resource.closed) {
      problems.push(\`закрыт дважды: \${event.resource}\`);
      continue;
    }

    if (resource.owner === 'runner' && event.by === 'test') {
      problems.push(\`тест закрыл чужое: \${event.resource}\`);
    }

    resource.closed = true;
  }

  for (const [name, resource] of resources) {
    if (resource.owner === 'test' && !resource.closed) {
      problems.push(\`не закрыт: \${name}\`);
    }
  }

  return problems.sort();
}`
  }
]
