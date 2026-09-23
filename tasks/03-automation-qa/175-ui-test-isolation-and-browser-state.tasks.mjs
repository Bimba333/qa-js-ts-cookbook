export default [
  {
    id: 'qa-175-fresh-context-is-anonymous',
    title: 'Новый контекст не знает о входе',
    difficulty: 'hard',
    lang: 'playwright',
    prompt:
      'Покажите, что состояние браузера принадлежит контексту, а не приложению. ' +
      'Войдите как `educational_tester` с паролем `educational-tester-password` в ' +
      'текущей странице, затем создайте **новый контекст** того же браузера и ' +
      'откройте в нём `/work-items`. Верните `{ authorizedUrl, freshUrl, ' +
      'cookiesAuthorized, cookiesFresh }`: адрес списка в текущей странице, адрес ' +
      'после перехода в новом контексте и число cookie в каждом контексте. ' +
      'Созданный контекст закройте сами. Записи не создавайте.',
    starter: `export default async function solve({ page, baseUrl }) {
  // Новый контекст получается из браузера: page.context().browser().

  return { authorizedUrl: '', freshUrl: '', cookiesAuthorized: 0, cookiesFresh: 0 };
}`,
    hints: [
      'Контекст хранит cookie и данные сайта отдельно от других контекстов.',
      'Новому контексту нужно указать адрес стенда: baseURL у него свой.',
      'Незалогиненного посетителя приложение отправляет на страницу входа.'
    ],
    tests: [
      {
        name: 'в текущей странице список открыт',
        code: `expect(result.authorizedUrl).toContain('/work-items');`
      },
      {
        name: 'новый контекст отправлен на вход',
        code: `expect(result.freshUrl).toContain('/login');`
      },
      {
        name: 'в авторизованном контексте есть cookie',
        code: `expect(result.cookiesAuthorized > 0).toBe(true);`
      },
      {
        name: 'новый контекст начинает без cookie сессии',
        code: `expect(result.cookiesFresh < result.cookiesAuthorized).toBe(true);`
      },
      {
        name: 'исходная страница осталась авторизованной',
        code: `await page.goto('/work-items');
expect(page.url()).toContain('/work-items');
expect(await page.getByRole('heading', { name: 'Задачи' }).isVisible()).toBe(true);`
      }
    ],
    solution: `export default async function solve({ page, baseUrl }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/work-items');
  const authorizedUrl = page.url();
  const cookiesAuthorized = (await page.context().cookies()).length;

  // Новый контекст — чистое состояние браузера: cookie не наследуются.
  const browser = page.context().browser();
  const fresh = await browser.newContext({ baseURL: baseUrl });

  try {
    const freshPage = await fresh.newPage();
    await freshPage.goto('/work-items');

    return {
      authorizedUrl,
      freshUrl: freshPage.url(),
      cookiesAuthorized,
      cookiesFresh: (await fresh.cookies()).length
    };
  } finally {
    await fresh.close();
  }
}`
  }
]
