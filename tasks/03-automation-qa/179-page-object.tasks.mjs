export default [
  {
    id: 'qa-179-login-page-object',
    title: 'Page Object для входа и списка',
    difficulty: 'hard',
    lang: 'playwright',
    prompt:
      'Опишите два page object. `LoginPage` с методами `open()` и ' +
      '`login(user, password)`. `WorkItemsPage` с методами `open()`, ' +
      '`rowCount()` и `titles()`. Селекторы должны жить внутри классов: в теле ' +
      '`solve` не должно быть ни одного обращения к `page.locator`, `getByRole` ' +
      'или `getByLabel`. Войдите как `educational_tester` с паролем ' +
      '`educational-tester-password`, откройте список и верните ' +
      '`{ rows, titles, url }`.',
    starter: `class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async open() {}

  async login(user, password) {}
}

class WorkItemsPage {
  constructor(page) {
    this.page = page;
  }

  async open() {}

  async rowCount() { return 0; }

  async titles() { return []; }
}

export default async function solve({ page }) {
  // Здесь должны быть только шаги сценария.

  return { rows: 0, titles: [], url: '' };
}`,
    hints: [
      'Page object скрывает селекторы: наружу видны только шаги.',
      'Заголовок задачи в таблице — это ссылка на карточку.',
      'Сценарий читается как последовательность действий, а не как поиск элементов.'
    ],
    tests: [
      {
        name: 'список открыт и строки найдены',
        code: `expect(result.url).toContain('/work-items');
expect(result.rows > 0).toBe(true);`
      },
      {
        name: 'заголовки прочитаны по числу строк',
        code: `expect(result.titles).toHaveLength(result.rows);`
      },
      {
        name: 'заголовки непустые',
        code: `expect(result.titles.every(title => title.trim().length > 0)).toBe(true);`
      },
      {
        name: 'вход выполнен: список доступен',
        code: `expect(await page.getByRole('heading', { name: 'Задачи' }).isVisible()).toBe(true);`
      },
      {
        name: 'число строк не больше размера страницы',
        code: `expect(result.rows <= 100).toBe(true);`
      },
      {
        name: 'в сценарии нет поиска элементов',
        code: `const body = source.slice(source.indexOf('export default'));
expect(/page\\.locator|getByRole|getByLabel|getByText/.test(body)).toBe(false);`
      },
      {
        name: 'селекторы объявлены в классах',
        code: `const classes = source.slice(0, source.indexOf('export default'));
expect(/getByLabel|getByRole/.test(classes)).toBe(true);`
      }
    ],
    solution: `class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('/login');
  }

  async login(user, password) {
    await this.page.getByLabel('Логин').fill(user);
    await this.page.getByLabel('Пароль').fill(password);
    await this.page.getByRole('button', { name: 'Войти' }).click();
  }
}

class WorkItemsPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('/work-items');
  }

  rows() {
    return this.page.locator('tbody tr');
  }

  async rowCount() {
    return this.rows().count();
  }

  async titles() {
    const cells = await this.page.locator('tbody tr td:nth-child(1)').allInnerTexts();

    return cells.map(value => value.trim());
  }
}

export default async function solve({ page }) {
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login('educational_tester', 'educational-tester-password');

  const workItemsPage = new WorkItemsPage(page);
  await workItemsPage.open();

  return {
    rows: await workItemsPage.rowCount(),
    titles: await workItemsPage.titles(),
    url: page.url()
  };
}`
  }
]
