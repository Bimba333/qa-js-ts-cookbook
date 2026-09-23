export default [
  {
    id: 'qa-180-scoped-component',
    title: 'Компонент ограничивает область поиска',
    difficulty: 'hard',
    lang: 'playwright',
    prompt:
      'Опишите компонент фильтра над его корневым локатором. Класс ' +
      '`FilterComponent` принимает корневой локатор и имеет методы ' +
      '`selectStatus(value)`, `apply()` и `controlsCount()` (число элементов ' +
      'управления внутри компонента). Все поиски должны идти **от корня**, а не ' +
      'от страницы. Войдите как `educational_tester` с паролем ' +
      '`educational-tester-password`, откройте `/work-items`, отфильтруйте по ' +
      'статусу `NEW` и верните `{ controls, linksInside, linksOnPage, rows, url }`: ' +
      'число элементов управления компонента, число ссылок внутри его корня, ' +
      'число ссылок на всей странице и число строк таблицы после фильтра.',
    starter: `class FilterComponent {
  constructor(root) {
    this.root = root;
  }

  async selectStatus(value) {}

  async apply() {}

  async controlsCount() { return 0; }
}

export default async function solve({ page }) {
  // Корень компонента — форма фильтра, у неё есть доступное имя.

  return { controls: 0, linksInside: 0, linksOnPage: 0, rows: 0, url: '' };
}`,
    hints: [
      'Корневой локатор формы можно получить по её доступному имени.',
      'Поиск внутри компонента — это поиск от корневого локатора.',
      'Ссылок в форме фильтра нет, а на странице они есть — это и показывает границу.'
    ],
    tests: [
      {
        name: 'фильтр применён',
        code: `expect(result.url).toContain('status=NEW');`
      },
      {
        name: 'компонент нашёл свои элементы управления',
        code: `expect(result.controls >= 3).toBe(true);`
      },
      {
        name: 'внутри компонента ссылок нет',
        code: `expect(result.linksInside).toBe(0);`
      },
      {
        name: 'на странице ссылки есть: область поиска действительно сужена',
        code: `expect(result.linksOnPage > 0).toBe(true);`
      },
      {
        name: 'после фильтра строки остались',
        code: `expect(result.rows > 0).toBe(true);`
      },
      {
        name: 'в таблице только задачи со статусом NEW',
        code: `const statuses = await page.locator('tbody tr td:nth-child(2)').allInnerTexts();
expect(statuses.every(value => value.trim() === 'NEW')).toBe(true);`
      }
    ],
    solution: `class FilterComponent {
  constructor(root) {
    this.root = root;
  }

  async selectStatus(value) {
    await this.root.getByLabel('Статус').selectOption(value);
  }

  async apply() {
    await this.root.getByRole('button', { name: 'Применить фильтр' }).click();
  }

  async controlsCount() {
    return this.root.locator('select, button, input').count();
  }

  linksCount() {
    return this.root.getByRole('link').count();
  }
}

export default async function solve({ page }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/work-items');

  const filter = new FilterComponent(page.getByRole('form', { name: 'Фильтр задач' }));

  const controls = await filter.controlsCount();
  const linksInside = await filter.linksCount();
  const linksOnPage = await page.getByRole('link').count();

  await filter.selectStatus('NEW');
  await filter.apply();
  await page.waitForURL(/status=NEW/);

  return {
    controls,
    linksInside,
    linksOnPage,
    rows: await page.locator('tbody tr').count(),
    url: page.url()
  };
}`
  }
]
