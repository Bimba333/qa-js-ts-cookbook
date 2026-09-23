export default [
  {
    id: 'qa-178-reuse-storage-state',
    title: 'Повторное использование состояния входа',
    difficulty: 'hard',
    lang: 'playwright',
    prompt:
      'Вход не обязан повторяться в каждом тесте. Войдите как ' +
      '`educational_tester` с паролем `educational-tester-password`, снимите ' +
      'состояние контекста (`context.storageState()`), создайте **новый** ' +
      'контекст с этим состоянием и откройте в нём `/work-items` **без входа**. ' +
      'Для сравнения откройте `/work-items` ещё и в третьем контексте — без ' +
      'состояния. Верните `{ cookieNames, restoredUrl, anonymousUrl, restoredRows }`: ' +
      'имена cookie из снятого состояния, адрес в контексте с состоянием, адрес ' +
      'в контексте без него и число строк таблицы в восстановленном контексте. ' +
      'Созданные контексты закройте.',
    starter: `export default async function solve({ page, baseUrl }) {
  // Состояние входа — это данные контекста, их можно перенести.

  return { cookieNames: [], restoredUrl: '', anonymousUrl: '', restoredRows: 0 };
}`,
    hints: [
      'storageState возвращает объект с cookie и данными хранилищ.',
      'Новый контекст принимает это состояние параметром storageState.',
      'Третий контекст нужен, чтобы показать разницу.'
    ],
    tests: [
      {
        name: 'в состоянии есть cookie сессии',
        code: `expect(result.cookieNames.length > 0).toBe(true);`
      },
      {
        name: 'контекст с состоянием открывает список без входа',
        code: `expect(result.restoredUrl).toContain('/work-items');
expect(result.restoredUrl.includes('/login')).toBe(false);`
      },
      {
        name: 'контекст без состояния отправлен на вход',
        code: `expect(result.anonymousUrl).toContain('/login');`
      },
      {
        name: 'в восстановленном контексте данные видны',
        code: `expect(result.restoredRows > 0).toBe(true);`
      },
      {
        name: 'исходная страница по-прежнему авторизована',
        code: `await page.goto('/work-items');
expect(await page.getByRole('heading', { name: 'Задачи' }).isVisible()).toBe(true);`
      }
    ],
    solution: `export default async function solve({ page, baseUrl }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  const state = await page.context().storageState();
  const browser = page.context().browser();

  const restored = await browser.newContext({ baseURL: baseUrl, storageState: state });
  const anonymous = await browser.newContext({ baseURL: baseUrl });

  try {
    const restoredPage = await restored.newPage();
    await restoredPage.goto('/work-items');

    const anonymousPage = await anonymous.newPage();
    await anonymousPage.goto('/work-items');

    return {
      cookieNames: state.cookies.map(cookie => cookie.name),
      restoredUrl: restoredPage.url(),
      anonymousUrl: anonymousPage.url(),
      restoredRows: await restoredPage.locator('tbody tr').count()
    };
  } finally {
    await restored.close();
    await anonymous.close();
  }
}`
  }
]
