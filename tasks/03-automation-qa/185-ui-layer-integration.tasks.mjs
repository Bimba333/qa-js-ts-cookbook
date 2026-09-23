export default [
  {
    id: 'qa-185-composed-ui-layer',
    title: 'Слой интерфейса собирается из частей',
    difficulty: 'hard',
    lang: 'playwright',
    prompt:
      'Соберите слой интерфейса как граф объектов. Напишите фабрику ' +
      '`createUiLayer(page)`, которая возвращает `{ login, workItems, card }` — ' +
      'три page object. `login` умеет `open()` и `signIn(user, password)`; ' +
      '`workItems` — `open()`, `firstTitle()` и `openFirst()` (переходит в ' +
      'карточку первой записи); `card` — `heading()` и `url()`. Объекты ' +
      'создаются один раз на вызов фабрики и используют одну и ту же `page`. ' +
      'Выполните сценарий: вход как `educational_tester` с паролем ' +
      '`educational-tester-password`, открытие списка, переход в первую карточку. ' +
      'Верните `{ listTitle, cardHeading, url, sameLayer }`, где `sameLayer` — ' +
      'признак того, что повторный доступ к `workItems` даёт тот же объект.',
    starter: `function createUiLayer(page) {
  // Объекты слоя делят одну page и создаются один раз.

  return { login: null, workItems: null, card: null };
}

export default async function solve({ page }) {
  const ui = createUiLayer(page);

  return { listTitle: '', cardHeading: '', url: '', sameLayer: false };
}`,
    hints: [
      'Фабрика возвращает уже созданные объекты, а не функции их создания.',
      'Заголовок задачи в таблице — это ссылка на карточку.',
      'Сравнение объектов по ссылке показывает, что они не пересоздаются.'
    ],
    tests: [
      {
        name: 'сценарий дошёл до карточки',
        code: `expect(/\\/work-items\\/[^/]+$/.test(result.url)).toBe(true);`
      },
      {
        name: 'заголовок из списка совпадает с заголовком карточки',
        code: `expect(result.cardHeading.trim()).toContain(result.listTitle.trim());`
      },
      {
        name: 'объекты слоя не пересоздаются',
        code: `expect(result.sameLayer).toBe(true);`
      },
      {
        name: 'карточка принадлежит существующей записи',
        code: `const id = result.url.split('/').pop();
const response = await api.get('/work-items/' + id);
expect(response.status).toBe(200);`
      },
      {
        name: 'селекторы живут в объектах слоя, а не в сценарии',
        code: `const body = source.slice(source.indexOf('export default'));
expect(/getByRole|getByLabel|page\\.locator/.test(body)).toBe(false);`
      }
    ],
    solution: `class LoginPage {
  constructor(page) {
    this.page = page;
  }

  async open() {
    await this.page.goto('/login');
  }

  async signIn(user, password) {
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

  firstLink() {
    return this.page.getByRole('table').getByRole('link').first();
  }

  async firstTitle() {
    return (await this.firstLink().innerText()).trim();
  }

  async openFirst() {
    await this.firstLink().click();
    await this.page.waitForURL(/\\/work-items\\/[^/]+$/);
  }
}

class CardPage {
  constructor(page) {
    this.page = page;
  }

  async heading() {
    return (await this.page.getByRole('heading').first().innerText()).trim();
  }

  url() {
    return this.page.url();
  }
}

function createUiLayer(page) {
  return {
    login: new LoginPage(page),
    workItems: new WorkItemsPage(page),
    card: new CardPage(page)
  };
}

export default async function solve({ page }) {
  const ui = createUiLayer(page);

  await ui.login.open();
  await ui.login.signIn('educational_tester', 'educational-tester-password');

  await ui.workItems.open();
  const listTitle = await ui.workItems.firstTitle();

  await ui.workItems.openFirst();

  return {
    listTitle,
    cardHeading: await ui.card.heading(),
    url: ui.card.url(),
    sameLayer: ui.workItems === ui.workItems
  };
}`
  }
]
