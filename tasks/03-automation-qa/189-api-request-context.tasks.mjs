export default [
  {
    id: 'qa-189-context-has-own-session',
    title: 'Сессия браузера не авторизует API',
    difficulty: 'hard',
    lang: 'playwright',
    prompt:
      'Контекст браузера и клиент API — разные сессии. Войдите как ' +
      '`educational_tester` с паролем `educational-tester-password`, затем ' +
      'выполните два запроса к `/api/v1/work-items?limit=1`: первый через ' +
      '`page.request` (он наследует cookie контекста), второй через переданный ' +
      '`api`. Верните `{ viaBrowser, viaApi, cookies, uiWorks }`: код состояния ' +
      'первого запроса, код второго, число cookie контекста и признак того, что ' +
      'страница `/work-items` в браузере при этом открывается.',
    starter: `export default async function solve({ page, api }) {
  // page.request отправляет cookie контекста, но не токен API.

  return { viaBrowser: 0, viaApi: 0, cookies: 0, uiWorks: false };
}`,
    hints: [
      'У page.request те же методы, что у обычного HTTP-клиента.',
      'Код состояния ответа даёт метод status().',
      'Интерфейс и REST-граница проверяют доступ по-разному.'
    ],
    tests: [
      {
        name: 'через контекст браузера REST отвечает отказом',
        code: `expect(result.viaBrowser).toBe(401);`
      },
      {
        name: 'через клиент API запрос проходит',
        code: `expect(result.viaApi).toBe(200);`
      },
      {
        name: 'cookie сессии у контекста есть',
        code: `expect(result.cookies > 0).toBe(true);`
      },
      {
        name: 'интерфейс той же сессией пользуется успешно',
        code: `expect(result.uiWorks).toBe(true);`
      },
      {
        name: 'страница списка действительно открыта',
        code: `expect(page.url()).toContain('/work-items');
expect(await page.getByRole('heading', { name: 'Задачи' }).isVisible()).toBe(true);`
      }
    ],
    solution: `export default async function solve({ page, api }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  const browserResponse = await page.request.get('/api/v1/work-items?limit=1');
  const apiResponse = await api.get('/work-items?limit=1');

  await page.goto('/work-items');
  const uiWorks = await page.getByRole('heading', { name: 'Задачи' }).isVisible();

  return {
    viaBrowser: browserResponse.status(),
    viaApi: apiResponse.status,
    cookies: (await page.context().cookies()).length,
    uiWorks
  };
}`
  }
]
