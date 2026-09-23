export default [
  {
    id: 'qa-196-api-setup-ui-check',
    title: 'Подготовка через API, проверка в интерфейсе',
    difficulty: 'hard',
    lang: 'playwright',
    prompt:
      'Соберите комбинированный сценарий. Создайте запись через `api.post` с ' +
      'заголовком `Комбинированный сценарий` и приоритетом `HIGH`, войдите как ' +
      '`educational_tester` с паролем `educational-tester-password` и откройте ' +
      'карточку этой записи по адресу `/work-items/<id>`. Верните ' +
      '`{ id, heading, bodyText, url }`: идентификатор, текст заголовка карточки, ' +
      'видимый текст страницы и её адрес. Через интерфейс ничего не создавайте.',
    starter: `export default async function solve({ page, api }) {
  // Подготовка через API быстрее и надёжнее, чем те же шаги через форму.

  return { id: '', heading: '', bodyText: '', url: '' };
}`,
    hints: [
      'Идентификатор созданной записи приходит в ответе на создание.',
      'Карточка открывается по адресу со вставленным идентификатором.',
      'Видимый текст страницы можно прочитать целиком.'
    ],
    tests: [
      {
        name: 'открыта карточка созданной записи',
        code: `expect(result.url).toContain('/work-items/' + result.id);`
      },
      {
        name: 'заголовок карточки — заголовок записи',
        code: `expect(result.heading.trim()).toContain('Комбинированный сценарий');`
      },
      {
        name: 'приоритет виден на странице',
        code: `expect(result.bodyText).toContain('HIGH');`
      },
      {
        name: 'запись существует и в API',
        code: `const response = await api.get('/work-items/' + result.id);
expect(response.status).toBe(200);
expect(response.body.title).toBe('Комбинированный сценарий');`
      },
      {
        name: 'состояние записи не изменилось интерфейсом',
        code: `const stored = await api.get('/work-items/' + result.id);
expect(stored.body.status).toBe('NEW');
expect(stored.body.version).toBe(1);`
      }
    ],
    solution: `export default async function solve({ page, api }) {
  const created = await api.post('/work-items', {
    title: 'Комбинированный сценарий',
    description: 'Создано через API, проверено в интерфейсе',
    priority: 'HIGH'
  });

  const id = created.body.id;

  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/work-items/' + id);

  const heading = await page.getByRole('heading').first().innerText();
  const bodyText = await page.locator('body').innerText();

  return { id, heading, bodyText, url: page.url() };
}`
  }
]
