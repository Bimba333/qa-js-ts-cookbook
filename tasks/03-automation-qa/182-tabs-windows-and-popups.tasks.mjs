export default [
  {
    id: 'qa-182-popup-is-new-page',
    title: 'Всплывающее окно — это новая страница',
    difficulty: 'hard',
    lang: 'playwright',
    prompt:
      'Войдите как `educational_tester` с паролем `educational-tester-password`, ' +
      'откройте `/playground` и нажмите ссылку `[data-testid="popup-link"]`, ' +
      'которая открывает вкладку. Наблюдение за событием нужно установить ' +
      '**до** нажатия. Верните `{ popupUrl, popupHeading, originUrl, pagesInContext, ' +
      'sameContext, headingOnOrigin }`: адрес и заголовок новой страницы, адрес ' +
      'исходной, число страниц в контексте после открытия, признак того, что ' +
      'обе страницы принадлежат одному контексту, и число совпадений локатора ' +
      '`[data-testid="popup-heading"]` на исходной странице.',
    starter: `export default async function solve({ page }) {
  // Событие появляется в момент нажатия: подписка после клика его не застанет.

  return {
    popupUrl: '', popupHeading: '', originUrl: '',
    pagesInContext: 0, sameContext: false, headingOnOrigin: 0
  };
}`,
    hints: [
      'Ожидание события и действие запускаются вместе, а не последовательно.',
      'Новая страница — полноценный объект Page со своими локаторами.',
      'Список страниц контекста доступен через сам контекст.'
    ],
    tests: [
      {
        name: 'вкладка открылась на своей странице',
        code: `expect(result.popupUrl).toContain('/playground/popup');`
      },
      {
        name: 'заголовок новой страницы прочитан',
        code: `expect(result.popupHeading.trim()).toBe('Отчёт прогона');`
      },
      {
        name: 'исходная страница осталась на площадке',
        code: `expect(result.originUrl).toContain('/playground');
expect(result.originUrl.includes('/playground/popup')).toBe(false);`
      },
      {
        name: 'в контексте стало две страницы',
        code: `expect(result.pagesInContext).toBe(2);`
      },
      {
        name: 'обе страницы в одном контексте',
        code: `expect(result.sameContext).toBe(true);`
      },
      {
        name: 'содержимое новой страницы на исходной не видно',
        code: `expect(result.headingOnOrigin).toBe(0);`
      }
    ],
    solution: `export default async function solve({ page }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/playground');

  // Наблюдение ставится раньше действия и ждёт вместе с ним.
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.locator('[data-testid="popup-link"]').click()
  ]);

  await popup.waitForLoadState();

  const context = page.context();

  return {
    popupUrl: popup.url(),
    popupHeading: await popup.locator('[data-testid="popup-heading"]').innerText(),
    originUrl: page.url(),
    pagesInContext: context.pages().length,
    sameContext: popup.context() === context,
    headingOnOrigin: await page.locator('[data-testid="popup-heading"]').count()
  };
}`
  }
]
