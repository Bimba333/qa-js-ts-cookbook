export default [
  {
    id: 'qa-192-setup-through-api',
    title: 'Подготовка данных через API',
    difficulty: 'hard',
    lang: 'api',
    prompt:
      'Подготовьте данные для сценария через API, а не через интерфейс. ' +
      'Напишите builder с умолчаниями `description: "Подготовка сценария"` и ' +
      '`priority: "MEDIUM"`, где заголовок собирается как ' +
      '`Подготовка <marker> <n>` (`n` — номер сборки с единицы), затем создайте ' +
      'через него **три** записи: две с приоритетом `HIGH` и одну со значением по ' +
      'умолчанию. Верните `{ marker, ids, high, created }`: метку прогона, ' +
      'идентификаторы в порядке создания, число созданных записей с приоритетом ' +
      '`HIGH` и тела ответов на создание.',
    starter: `export default async function solve(api) {
  // Builder задаёт форму, API создаёт ресурс, тест владеет идентификаторами.

  return { marker: '', ids: [], high: 0, created: [] };
}`,
    hints: [
      'Метка должна отличать записи этого прогона от чужих.',
      'Умолчания builder не должны нести смысла сценария.',
      'Номер сборки увеличивается только при вызове build.'
    ],
    tests: [
      {
        name: 'создано три записи',
        code: `expect(result.ids).toHaveLength(3);
expect(result.created).toHaveLength(3);`
      },
      {
        name: 'приоритет по умолчанию применился к одной записи',
        code: `expect(result.high).toBe(2);
expect(result.created.filter(item => item.priority === 'MEDIUM')).toHaveLength(1);`
      },
      {
        name: 'заголовки пронумерованы и содержат метку',
        code: `const titles = result.created.map(item => item.title);
expect(titles).toEqual([
  'Подготовка ' + result.marker + ' 1',
  'Подготовка ' + result.marker + ' 2',
  'Подготовка ' + result.marker + ' 3'
]);`
      },
      {
        name: 'описание взято из умолчаний',
        code: `expect(result.created.every(item => item.description === 'Подготовка сценария')).toBe(true);`
      },
      {
        name: 'записи существуют на стенде',
        code: `for (const id of result.ids) {
  const response = await api.get('/work-items/' + id);
  expect(response.status).toBe(200);
}`
      },
      {
        name: 'метка отличает записи этого прогона',
        code: `const listed = await api.get('/work-items?limit=100&offset=' +
  Math.max(0, (await api.get('/work-items?limit=1')).body.total - 100));
const mine = listed.body.items.filter(item => item.title.includes(result.marker));
expect(mine).toHaveLength(3);`
      }
    ],
    solution: `function createWorkItemBuilder(marker) {
  let priority = 'MEDIUM';
  let built = 0;

  const builder = {
    withPriority(value) {
      priority = value;
      return builder;
    },
    build() {
      built += 1;

      return {
        title: 'Подготовка ' + marker + ' ' + built,
        description: 'Подготовка сценария',
        priority
      };
    }
  };

  return builder;
}

export default async function solve(api) {
  const marker = 'run-' + Math.floor(Math.random() * 1000000);
  const builder = createWorkItemBuilder(marker);

  const created = [];

  const first = await api.post('/work-items', builder.withPriority('HIGH').build());
  created.push(first.body);

  const second = await api.post('/work-items', builder.build());
  created.push(second.body);

  const third = await api.post('/work-items', builder.withPriority('MEDIUM').build());
  created.push(third.body);

  return {
    marker,
    ids: created.map(item => item.id),
    high: created.filter(item => item.priority === 'HIGH').length,
    created
  };
}`
  }
]
