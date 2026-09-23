export default [
  {
    id: 'qa-184-stub-list-page',
    title: 'Подмена ответа сервера',
    difficulty: 'hard',
    lang: 'playwright',
    prompt:
      'Войдите как `educational_tester` с паролем `educational-tester-password`, ' +
      'перехватите запрос страницы `/work-items` и ответьте на него собственной ' +
      'разметкой с заголовком `Подменённый список` — так, чтобы настоящий сервер ' +
      'этот запрос не обработал. Верните `{ heading, intercepted }`: текст ' +
      'заголовка открытой страницы и число перехваченных запросов. ' +
      'Данные на стенде изменяться не должны.',
    starter: `export default async function solve({ page }) {
  // page.route перехватывает запрос до того, как он уйдёт на сервер.

  return { heading: '', intercepted: 0 };
}`,
    hints: [
      'Перехват задаётся до перехода на страницу.',
      'Обработчик может ответить сам, а может пропустить запрос дальше.',
      'Подменённый ответ должен быть разметкой, иначе браузер не покажет заголовок.'
    ],
    tests: [
      {
        name: 'страница показала подменённый заголовок',
        code: `expect(result.heading.trim()).toBe('Подменённый список');`
      },
      {
        name: 'перехват сработал ровно один раз',
        code: `expect(result.intercepted).toBe(1);`
      },
      {
        name: 'открыт адрес списка задач',
        code: `expect(page.url()).toContain('/work-items');`
      },
      {
        name: 'настоящий список на стенде не изменился',
        code: `const response = await api.get('/work-items?limit=5');
expect(response.status).toBe(200);
expect(response.body.items.length > 0).toBe(true);`
      },
      {
        name: 'подменённая разметка видна в браузере',
        code: `expect(await page.getByRole('heading', { name: 'Подменённый список' }).isVisible()).toBe(true);`
      }
    ],
    solution: `export default async function solve({ page }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  let intercepted = 0;

  await page.route('**/work-items', async route => {
    intercepted += 1;

    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: '<html><body><h1>Подменённый список</h1></body></html>'
    });
  });

  await page.goto('/work-items');

  const heading = page.getByRole('heading', { name: 'Подменённый список' });

  return { heading: await heading.innerText(), intercepted };
}`
  }
]
