export default [
  {
    id: 'qa-194-empty-title-rejected',
    title: 'Отказ при пустом обязательном поле',
    difficulty: 'medium',
    lang: 'api',
    prompt:
      'Попробуйте создать задачу с пустым `title` и верните объект ' +
      '`{ rejected, listBefore, listAfter }`: ответ стенда на отказ, а также ответы ' +
      '`GET /work-items?limit=1` до и после попытки. Проверки убедятся, что отказ ' +
      'произошёл по правильной причине и не создал запись.',
    starter: `export default async function solve(api) {
  // 1. Прочитайте состояние до попытки
  // 2. Отправьте POST с пустым title
  // 3. Прочитайте состояние после

  return { rejected: null, listBefore: null, listAfter: null };
}`,
    hints: [
      'Отказ приходит обычным ответом: исключения ждать не нужно.',
      'Стенд сообщает машиночитаемый код ошибки в теле.',
      'Отсутствие побочного эффекта проверяется сравнением состояния до и после.'
    ],
    tests: [
      {
        name: 'отказ имеет код состояния 4xx',
        code: `expect(result.rejected.status >= 400 && result.rejected.status < 500).toBe(true);`
      },
      {
        name: 'в теле отказа есть машиночитаемый код',
        code: `expect(typeof result.rejected.body.code).toBe('string');`
      },
      {
        name: 'общее количество записей не изменилось',
        code: `expect(result.listAfter.body.total).toBe(result.listBefore.body.total);`
      },
      {
        name: 'оба чтения прошли успешно',
        code: `expect(result.listBefore.status).toBe(200);
expect(result.listAfter.status).toBe(200);`
      }
    ],
    solution: `export default async function solve(api) {
  const listBefore = await api.get('/work-items?limit=1');

  const rejected = await api.post('/work-items', {
    title: '',
    description: 'Пустой заголовок недопустим',
    priority: 'LOW'
  });

  const listAfter = await api.get('/work-items?limit=1');

  return { rejected, listBefore, listAfter };
}`
  },

  {
    id: 'qa-194-unknown-priority',
    title: 'Недопустимое значение приоритета',
    difficulty: 'medium',
    lang: 'api',
    prompt:
      'Отправьте создание задачи с приоритетом `URGENT`, которого нет в контракте, и ' +
      'верните объект `{ rejected, valid }`: ответ на недопустимое значение и ответ ' +
      'на корректное создание с приоритетом `HIGH`. Так проверка отличит отказ по ' +
      'значению от общей неработоспособности стенда.',
    starter: `export default async function solve(api) {
  // Сначала недопустимое значение, затем корректное.

  return { rejected: null, valid: null };
}`,
    hints: [
      'Недопустимое значение поля — это отказ по семантике, а не по разбору запроса.',
      'Второй запрос нужен, чтобы показать: стенд работает, отказ относится к значению.',
      'Корректное создание возвращает код 201.'
    ],
    tests: [
      {
        name: 'недопустимый приоритет отклонён',
        code: `expect(result.rejected.status >= 400 && result.rejected.status < 500).toBe(true);`
      },
      {
        name: 'в отказе есть код ошибки',
        code: `expect(typeof result.rejected.body.code).toBe('string');`
      },
      {
        name: 'корректное создание проходит',
        code: `expect(result.valid.status).toBe(201);
expect(result.valid.body.priority).toBe('HIGH');`
      },
      {
        name: 'созданная запись доступна для чтения',
        code: `const current = await api.get('/work-items/' + result.valid.body.id);
expect(current.status).toBe(200);`
      }
    ],
    solution: `export default async function solve(api) {
  const rejected = await api.post('/work-items', {
    title: 'Недопустимый приоритет',
    description: 'Значение URGENT отсутствует в контракте',
    priority: 'URGENT'
  });

  const valid = await api.post('/work-items', {
    title: 'Корректный приоритет',
    description: 'Значение HIGH допустимо',
    priority: 'HIGH'
  });

  return { rejected, valid };
}`
  }
]
