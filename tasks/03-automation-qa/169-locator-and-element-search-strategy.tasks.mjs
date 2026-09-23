export default [
  {
    id: 'qa-169-find-login-form',
    title: 'Найти поля формы входа',
    difficulty: 'easy',
    lang: 'playwright',
    prompt:
      'Откройте страницу входа стенда (`/login`) и найдите поля логина и пароля ' +
      'по их подписям, а кнопку отправки — по роли и доступному имени. Верните ' +
      'объект `{ loginVisible, passwordVisible, buttonName }`, где первые два — ' +
      'результаты проверки видимости, третий — текст кнопки.',
    starter: `/**
 * Решение получает { page, baseUrl, api }.
 * page — обычная страница Playwright.
 */
export default async function solve({ page }) {
  // 1. Перейдите на /login
  // 2. Найдите поля по подписям, кнопку — по роли

  return { loginVisible: false, passwordVisible: false, buttonName: '' };
}`,
    hints: [
      'Поля с подписями удобно искать через getByLabel.',
      'Кнопку находят через getByRole с доступным именем.',
      'Видимость проверяется методом isVisible, текст — innerText или textContent.'
    ],
    tests: [
      {
        name: 'поле логина найдено и видимо',
        code: `expect(result.loginVisible).toBe(true);`
      },
      {
        name: 'поле пароля найдено и видимо',
        code: `expect(result.passwordVisible).toBe(true);`
      },
      {
        name: 'кнопка отправки называется «Войти»',
        code: `expect(result.buttonName.trim()).toBe('Войти');`
      },
      {
        name: 'страница входа действительно открыта',
        code: `expect(page.url()).toContain('/login');`
      }
    ],
    solution: `export default async function solve({ page }) {
  await page.goto('/login');

  const login = page.getByLabel('Логин');
  const password = page.getByLabel('Пароль');
  const button = page.getByRole('button', { name: 'Войти' });

  return {
    loginVisible: await login.isVisible(),
    passwordVisible: await password.isVisible(),
    buttonName: await button.innerText()
  };
}`
  },

  {
    id: 'qa-169-count-list-items',
    title: 'Сузить набор совпадений',
    difficulty: 'medium',
    lang: 'playwright',
    prompt:
      'Войдите на стенд как `educational_tester` с паролем ' +
      '`educational-tester-password`, откройте список задач и верните объект ' +
      '`{ rowsTotal, filteredTotal }`: количество строк списка без фильтра и после ' +
      'применения фильтра по статусу `NEW` через адрес `/work-items?status=NEW`. ' +
      'Записи создавать не нужно.',
    starter: `export default async function solve({ page }) {
  // 1. Войдите через форму на /login
  // 2. Откройте /work-items и посчитайте строки
  // 3. Откройте /work-items?status=NEW и посчитайте снова

  return { rowsTotal: 0, filteredTotal: 0 };
}`,
    hints: [
      'После заполнения формы вход выполняется нажатием кнопки.',
      'Количество совпадений локатора даёт метод count.',
      'Фильтр можно применить прямо через адрес страницы.'
    ],
    tests: [
      {
        name: 'без фильтра строки найдены',
        code: `expect(result.rowsTotal > 0).toBe(true);`
      },
      {
        name: 'фильтр сокращает набор или оставляет его равным',
        code: `expect(result.filteredTotal <= result.rowsTotal).toBe(true);`
      },
      {
        name: 'после фильтра строки остались',
        code: `expect(result.filteredTotal > 0).toBe(true);`
      },
      {
        name: 'страница осталась на списке задач',
        code: `expect(page.url()).toContain('/work-items');`
      }
    ],
    solution: `export default async function solve({ page }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/work-items');
  const rowsTotal = await page.getByRole('row').count();

  await page.goto('/work-items?status=NEW');
  const filteredTotal = await page.getByRole('row').count();

  return { rowsTotal, filteredTotal };
}`
  }
]
