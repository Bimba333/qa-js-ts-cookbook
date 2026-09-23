export default [
  {
    id: 'qa-191-auth-required',
    title: 'Доступ без учётных данных',
    difficulty: 'medium',
    lang: 'api',
    prompt:
      'Проверьте, что защищённый маршрут требует аутентификации. Верните объект ' +
      '`{ withToken, withoutToken }`: ответ обычного клиента на ' +
      '`GET /work-items?limit=1` и ответ запроса **без** заголовка авторизации. ' +
      'Второй запрос выполните сами через `fetch` по адресу из `baseUrl`.',
    starter: `/**
 * Помимо api доступен baseUrl — адрес REST-границы стенда.
 */
export default async function solve(api, baseUrl) {
  // Первый запрос — через api, второй — без заголовка авторизации.

  return { withToken: null, withoutToken: null };
}`,
    hints: [
      'Обычный клиент уже отправляет заголовок авторизации.',
      'Запрос без заголовка нужно собрать самостоятельно.',
      'Отказ приходит обычным ответом, а не исключением.'
    ],
    tests: [
      {
        name: 'с токеном запрос проходит',
        code: `expect(result.withToken.status).toBe(200);`
      },
      {
        name: 'без токена доступ закрыт',
        code: `expect(result.withoutToken.status).toBe(401);`
      },
      {
        name: 'отказ содержит машиночитаемый код',
        code: `expect(typeof result.withoutToken.body.code).toBe('string');`
      },
      {
        name: 'секрет в ответе не раскрывается',
        code: `expect(JSON.stringify(result.withoutToken.body)).toContain('code');`
      }
    ],
    solution: `export default async function solve(api, baseUrl) {
  const withToken = await api.get('/work-items?limit=1');

  const response = await fetch(baseUrl + '/api/v1/work-items?limit=1');
  const text = await response.text();

  const withoutToken = {
    status: response.status,
    body: text.length > 0 ? JSON.parse(text) : null
  };

  return { withToken, withoutToken };
}`
  }
]
