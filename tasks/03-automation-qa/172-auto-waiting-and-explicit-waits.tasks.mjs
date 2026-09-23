export default [
  {
    id: 'qa-172-wait-for-navigation',
    title: 'Ожидание вместо паузы',
    difficulty: 'medium',
    lang: 'playwright',
    prompt:
      'Войдите как `educational_tester` с паролем `educational-tester-password` и ' +
      'откройте карточку первой задачи из списка `/work-items`. Переход должен ' +
      'дождаться загрузки страницы без фиксированной паузы: `waitForTimeout` и ' +
      '`setTimeout` использовать нельзя. Верните объект ' +
      '`{ url, heading }`: адрес карточки и текст её заголовка.',
    starter: `export default async function solve({ page }) {
  // Ссылка в списке ведёт на карточку. Переход надо дождаться, а не переждать.

  return { url: '', heading: '' };
}`,
    hints: [
      'Автоожидание встроено в действия: click ждёт, пока элемент станет доступен.',
      'Ожидание конкретного элемента надёжнее ожидания времени.',
      'Ссылка на карточку — это заголовок задачи в таблице.'
    ],
    tests: [
      {
        name: 'открыта карточка задачи',
        code: `expect(/\\/work-items\\/[^/]+$/.test(result.url)).toBe(true);`
      },
      {
        name: 'заголовок карточки прочитан',
        code: `expect(result.heading.trim().length > 0).toBe(true);`
      },
      {
        name: 'браузер остался на той же карточке',
        code: `expect(page.url()).toBe(result.url);`
      },
      {
        name: 'карточка отображает ту же задачу',
        code: `const id = result.url.split('/').pop();
const response = await api.get('/work-items/' + id);
expect(response.status).toBe(200);`
      }
    ],
    solution: `export default async function solve({ page }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/work-items');

  // click ждёт доступности ссылки, waitForURL — завершения перехода.
  await page.getByRole('table').getByRole('link').first().click();
  await page.waitForURL(/\\/work-items\\/[^/]+$/);

  const heading = page.getByRole('heading').first();

  return { url: page.url(), heading: await heading.innerText() };
}`
  }
]
