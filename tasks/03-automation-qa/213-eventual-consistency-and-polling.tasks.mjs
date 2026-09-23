export default [
  {
    id: 'qa-213-poll-until-visible',
    title: 'Опрос вместо паузы',
    difficulty: 'hard',
    lang: 'api',
    prompt:
      'Напишите опрос состояния. Создайте задачу с приоритетом `HIGH` и заголовком ' +
      '`Ожидание согласованности`, затем дождитесь её появления в выборке ' +
      '`GET /work-items?priority=HIGH&limit=100` — повторяя запрос, пока запись ' +
      'не найдётся, но не дольше 5 секунд и не чаще одного запроса в 100 мс. ' +
      'Верните `{ id, attempts, found }`: идентификатор созданной записи, число ' +
      'выполненных запросов выборки и признак успеха. Превышение времени — ошибка ' +
      'с сообщением `запись не появилась за отведённое время`.',
    starter: `export default async function solve(api) {
  const created = await api.post('/work-items', {
    title: 'Ожидание согласованности',
    description: 'Проверка опроса',
    priority: 'HIGH'
  });

  // Опрос: повторять запрос до условия, а не спать фиксированное время.

  return { id: created.body.id, attempts: 0, found: false };
}`,
    hints: [
      'Опрос — это цикл с условием выхода по успеху и по времени.',
      'Паузу между попытками даёт промис с setTimeout.',
      'Число попыток считается по запросам выборки, а не по паузам.'
    ],
    tests: [
      {
        name: 'запись найдена',
        code: `expect(result.found).toBe(true);`
      },
      {
        name: 'выполнен хотя бы один запрос выборки',
        code: `expect(result.attempts >= 1).toBe(true);`
      },
      {
        name: 'опрос не выродился в бесконечный цикл',
        code: `expect(result.attempts <= 50).toBe(true);`
      },
      {
        name: 'созданная запись существует на стенде',
        code: `const response = await api.get('/work-items/' + result.id);
expect(response.status).toBe(200);
expect(response.body.priority).toBe('HIGH');`
      },
      {
        name: 'запись видна в той же выборке',
        code: `const response = await api.get('/work-items?priority=HIGH&limit=100');
expect(response.body.items.some(item => item.id === result.id)).toBe(true);`
      }
    ],
    solution: `const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export default async function solve(api) {
  const created = await api.post('/work-items', {
    title: 'Ожидание согласованности',
    description: 'Проверка опроса',
    priority: 'HIGH'
  });

  const id = created.body.id;
  const deadline = Date.now() + 5000;
  let attempts = 0;

  while (Date.now() < deadline) {
    const response = await api.get('/work-items?priority=HIGH&limit=100');
    attempts += 1;

    if (response.body.items.some(item => item.id === id)) {
      return { id, attempts, found: true };
    }

    await sleep(100);
  }

  throw new Error('запись не появилась за отведённое время');
}`
  }
]
