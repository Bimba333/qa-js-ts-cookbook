export default [
  {
    id: 'ts-157-typed-page-object',
    title: 'Page Object поверх типизированной страницы',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Опишите тип `PageLike` с методами `goto(path: string): Promise<void>`, ' +
      '`fill(selector: string, value: string): Promise<void>` и ' +
      '`click(selector: string): Promise<void>`. Напишите класс `LoginPage`, ' +
      'принимающий `PageLike` в конструкторе и имеющий метод ' +
      '`login(user: string, password: string): Promise<void>`, который открывает ' +
      '`/login`, заполняет `#username` и `#password` и нажимает `#submit` — ' +
      'именно в этом порядке.',
    starter: `type PageLike = {
  goto(path: string): Promise<void>;
  fill(selector: string, value: string): Promise<void>;
  click(selector: string): Promise<void>;
};

class LoginPage {
  constructor(private readonly page: PageLike) {}

  async login(user: string, password: string): Promise<void> {
    // Страница знает селекторы, тест знает только шаги.
  }
}`,
    hints: [
      'Page Object скрывает селекторы: наружу видны только шаги.',
      'Каждое действие асинхронно — его нужно дождаться.',
      'Проверки смотрят на порядок вызовов.'
    ],
    tests: [
      {
        name: 'шаги выполняются в нужном порядке',
        code: `const calls = [];
const page = {
  goto: async (path) => { calls.push('goto:' + path); },
  fill: async (selector, value) => { calls.push('fill:' + selector + '=' + value); },
  click: async (selector) => { calls.push('click:' + selector); }
};
await new LoginPage(page).login('tester', 'secret');
expect(calls).toEqual([
  'goto:/login',
  'fill:#username=tester',
  'fill:#password=secret',
  'click:#submit'
]);`
      },
      {
        name: 'значения не подставляются жёстко',
        code: `const filled = [];
const page = {
  goto: async () => {},
  fill: async (selector, value) => { filled.push(value); },
  click: async () => {}
};
await new LoginPage(page).login('admin', 'p@ss');
expect(filled).toEqual(['admin', 'p@ss']);`
      },
      {
        name: 'каждое действие дожидается предыдущего',
        code: `const order = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const page = {
  goto: async () => { await delay(5); order.push('goto'); },
  fill: async () => { order.push('fill'); },
  click: async () => { order.push('click'); }
};
await new LoginPage(page).login('a', 'b');
expect(order).toEqual(['goto', 'fill', 'fill', 'click']);`
      },
      {
        name: 'метод возвращает промис',
        code: `const page = { goto: async () => {}, fill: async () => {}, click: async () => {} };
const returned = new LoginPage(page).login('a', 'b');
expect(typeof returned.then).toBe('function');
await returned;`
      },
      {
        name: 'ошибка страницы не проглатывается',
        code: `const page = {
  goto: async () => { throw new Error('страница недоступна'); },
  fill: async () => {},
  click: async () => {}
};
let message = '';
try { await new LoginPage(page).login('a', 'b'); }
catch (error) { message = error.message; }
expect(message).toBe('страница недоступна');`
      }
    ],
    solution: `type PageLike = {
  goto(path: string): Promise<void>;
  fill(selector: string, value: string): Promise<void>;
  click(selector: string): Promise<void>;
};

class LoginPage {
  constructor(private readonly page: PageLike) {}

  async login(user: string, password: string): Promise<void> {
    await this.page.goto('/login');
    await this.page.fill('#username', user);
    await this.page.fill('#password', password);
    await this.page.click('#submit');
  }
}`
  }
]
