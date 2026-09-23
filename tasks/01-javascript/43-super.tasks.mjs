export default [
  {
    id: 'js-43-extend-with-super-call',
    title: 'Расширение родительского метода',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Дан класс `Client` с методом `describe()`, возвращающим `<baseUrl>`. ' +
      'Напишите класс `AuthClient`, который принимает второй аргумент `role`, ' +
      'переиспользует родительский конструктор и метод, а `describe()` возвращает ' +
      '`<baseUrl> как <role>`.',
    starter: `class Client {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  describe() {
    return this.baseUrl;
  }
}

class AuthClient extends Client {
  // Конструктор и метод должны переиспользовать родительские.
}`,
    hints: [
      'Родительский конструктор вызывается через super перед обращением к this.',
      'Родительская реализация метода доступна через super.',
      'Дополнение приписывается к результату родительского метода.'
    ],
    tests: [
      {
        name: 'расширяет родительский результат',
        code: `expect(new AuthClient('http://a', 'admin').describe()).toBe('http://a как admin');`
      },
      {
        name: 'остаётся экземпляром родителя',
        code: `expect(new AuthClient('http://a', 'admin') instanceof Client).toBe(true);`
      },
      {
        name: 'родительский класс не изменился',
        code: `expect(new Client('http://a').describe()).toBe('http://a');`
      },
      {
        name: 'baseUrl сохранён родительским конструктором',
        code: `expect(new AuthClient('http://a', 'qa').baseUrl).toBe('http://a');`
      }
    ],
    solution: `class Client {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  describe() {
    return this.baseUrl;
  }
}

class AuthClient extends Client {
  constructor(baseUrl, role) {
    super(baseUrl);
    this.role = role;
  }

  describe() {
    return super.describe() + ' как ' + this.role;
  }
}`
  },

  {
    id: 'js-43-super-in-static',
    title: 'Цепочка из трёх уровней',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Постройте три класса: `Base` с методом `steps()`, возвращающим `["base"]`; ' +
      '`Middle`, который добавляет `"middle"`; и `Top`, который добавляет `"top"`. ' +
      'Каждый уровень должен переиспользовать результат предыдущего через `super`, ' +
      'а не перечислять шаги заново.',
    starter: `class Base {
  steps() {
    return ['base'];
  }
}

class Middle extends Base {
  // Добавьте свой шаг к результату родителя.
}

class Top extends Middle {
  // И ещё один уровень.
}`,
    hints: [
      'Каждый уровень вызывает super.steps() и дополняет результат.',
      'Новый массив удобно собрать через spread.',
      'Исходный массив родителя изменять не нужно.'
    ],
    tests: [
      {
        name: 'полная цепочка',
        code: `expect(new Top().steps()).toEqual(['base', 'middle', 'top']);`
      },
      {
        name: 'средний уровень',
        code: `expect(new Middle().steps()).toEqual(['base', 'middle']);`
      },
      {
        name: 'базовый уровень не изменился',
        code: `expect(new Base().steps()).toEqual(['base']);`
      },
      {
        name: 'повторные вызовы дают тот же результат',
        code: `const top = new Top();
top.steps();
expect(top.steps()).toEqual(['base', 'middle', 'top']);`
      }
    ],
    solution: `class Base {
  steps() {
    return ['base'];
  }
}

class Middle extends Base {
  steps() {
    return [...super.steps(), 'middle'];
  }
}

class Top extends Middle {
  steps() {
    return [...super.steps(), 'top'];
  }
}`
  }
]
