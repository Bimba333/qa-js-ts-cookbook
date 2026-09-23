export default [
  {
    id: 'qa-215-unique-data-per-run',
    title: 'Своя запись среди чужих',
    difficulty: 'hard',
    lang: 'api',
    prompt:
      'На стенде уже есть записи с заголовком `Параллельный прогон` — их создала ' +
      'подготовка задачи, как будто рядом работают другие тесты. ' +
      'Создайте **свою** запись так, чтобы её можно было отличить от чужих, и ' +
      'найдите её в общей выборке. Записи отсортированы по времени создания, ' +
      'а страница вмещает не больше 100 штук — ваша окажется на последней. ' +
      'Верните `{ marker, id, matches, neighbours }`: признак, по которому запись ' +
      'опознаётся, её идентификатор, число записей выборки, подходящих под признак, ' +
      'и число записей с заголовком `Параллельный прогон`. ' +
      'Искать по заголовку `Параллельный прогон` нельзя — он не ваш.',
    standSetup: `for (const index of [1, 2, 3]) {
  await api.post('/work-items', {
    title: 'Параллельный прогон',
    description: 'Запись соседнего теста номер ' + index,
    priority: 'LOW'
  });
}`,
    starter: `export default async function solve(api) {
  // Признак должен быть уникальным: одинаковый заголовок ничего не различает.

  return { marker: '', id: '', matches: 0, neighbours: 0 };
}`,
    hints: [
      'Отличать записи должен сам тест, а не порядок их создания.',
      'Уникальность даёт значение, которое не повторится в другом прогоне.',
      'Соседние записи считаются по заголовку, своя — по признаку.',
      'Поле total в ответе выборки подсказывает, какой нужен offset.'
    ],
    tests: [
      {
        name: 'признак не пуст и не совпадает с чужим заголовком',
        code: `expect(result.marker.length > 0).toBe(true);
expect(result.marker).toBeTruthy();
expect(result.marker === 'Параллельный прогон').toBe(false);`
      },
      {
        name: 'по признаку находится ровно одна запись',
        code: `expect(result.matches).toBe(1);`
      },
      {
        name: 'соседние записи существуют и не мешают',
        code: `expect(result.neighbours >= 3).toBe(true);`
      },
      {
        name: 'найденная запись действительно своя',
        code: `const response = await api.get('/work-items/' + result.id);
expect(response.status).toBe(200);
expect(JSON.stringify(response.body)).toContain(result.marker);`
      },
      {
        name: 'признак выдержал бы второй прогон',
        code: `const probe = await api.get('/work-items?limit=100');
const tail = await api.get('/work-items?limit=100&offset=' + Math.max(0, probe.body.total - 100));
const found = tail.body.items.filter(item => JSON.stringify(item).includes(result.marker));
expect(found).toHaveLength(1);`
      }
    ],
    solution: `export default async function solve(api) {
  // Метка живёт в заголовке: она уникальна, поэтому чужие записи под неё не попадут.
  const marker = 'run-' + Date.now() + '-' + Math.floor(Math.random() * 100000);

  const created = await api.post('/work-items', {
    title: 'Параллельный прогон ' + marker,
    description: 'Запись этого теста',
    priority: 'LOW'
  });

  // Своя запись создана последней, поэтому нужна последняя страница.
  const first = await api.get('/work-items?limit=100');
  const offset = Math.max(0, first.body.total - 100);
  const lastPage = await api.get('/work-items?limit=100&offset=' + offset);
  const items = lastPage.body.items;

  const matches = items.filter(item => item.title.includes(marker)).length;
  const neighbours = items.filter(item => item.title === 'Параллельный прогон').length;

  return { marker, id: created.body.id, matches, neighbours };
}`
  }
]
