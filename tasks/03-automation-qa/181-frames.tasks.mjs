export default [
  {
    id: 'qa-181-frame-is-separate-document',
    title: 'Содержимое фрейма недоступно со страницы',
    difficulty: 'hard',
    lang: 'playwright',
    prompt:
      'Войдите как `educational_tester` с паролем `educational-tester-password`, ' +
      'откройте `/playground` и поработайте с фреймом `[data-testid="training-frame"]`. ' +
      'Верните `{ onPage, inFrame, heading, before, after }`: число совпадений ' +
      'локатора `[data-testid="frame-heading"]` **на странице** и **во фрейме**, ' +
      'текст заголовка внутри фрейма, а также текст ' +
      '`[data-testid="frame-result"]` до и после нажатия кнопки ' +
      '`[data-testid="frame-button"]` внутри фрейма.',
    starter: `export default async function solve({ page }) {
  // Сначала выбирается документ, потом элемент внутри него.

  return { onPage: 0, inFrame: 0, heading: '', before: '', after: '' };
}`,
    hints: [
      'Обычный локатор страницы ищет только в главном документе.',
      'Контекст фрейма выбирается отдельным методом, принимающим селектор фрейма.',
      'Действия внутри фрейма выполняются через локаторы этого контекста.'
    ],
    tests: [
      {
        name: 'со страницы содержимое фрейма не видно',
        code: `expect(result.onPage).toBe(0);`
      },
      {
        name: 'во фрейме элемент находится',
        code: `expect(result.inFrame).toBe(1);`
      },
      {
        name: 'заголовок фрейма прочитан',
        code: `expect(result.heading.trim()).toBe('Содержимое фрейма');`
      },
      {
        name: 'состояние до нажатия',
        code: `expect(result.before.trim()).toBe('Не отмечено');`
      },
      {
        name: 'нажатие внутри фрейма сработало',
        code: `expect(result.after.trim()).toBe('Отмечено');`
      },
      {
        name: 'главный документ остался прежним',
        code: `expect(await page.getByRole('heading', { name: 'Учебная площадка' }).isVisible()).toBe(true);`
      }
    ],
    solution: `export default async function solve({ page }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/playground');

  const onPage = await page.locator('[data-testid="frame-heading"]').count();

  const frame = page.frameLocator('[data-testid="training-frame"]');
  const heading = frame.locator('[data-testid="frame-heading"]');

  const inFrame = await heading.count();
  const before = await frame.locator('[data-testid="frame-result"]').innerText();

  await frame.locator('[data-testid="frame-button"]').click();

  const after = await frame.locator('[data-testid="frame-result"]').innerText();

  return { onPage, inFrame, heading: await heading.innerText(), before, after };
}`
  }
]
