export default [
  {
    id: 'js-28-run-counter',
    title: 'Счётчик прогонов',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `createRunCounter()`, которая возвращает функцию. ' +
      'Каждый её вызов увеличивает внутренний счётчик и возвращает новое значение, ' +
      'начиная с `1`. Два счётчика, созданных отдельно, не должны влиять друг на друга.',
    starter: `function createRunCounter() {
  // Переменная счётчика должна остаться недоступной снаружи.
}`,
    hints: [
      'Переменную объявляют во внешней функции, а изменяет её внутренняя.',
      'Возвращать нужно саму функцию, а не результат её вызова.',
      'Каждый вызов фабрики создаёт своё окружение — значит, свой счётчик.'
    ],
    tests: [
      {
        name: 'первый вызов возвращает 1',
        code: `const next = createRunCounter();
expect(next()).toBe(1);`
      },
      {
        name: 'счётчик растёт',
        code: `const next = createRunCounter();
next();
next();
expect(next()).toBe(3);`
      },
      {
        name: 'два счётчика независимы',
        code: `const first = createRunCounter();
const second = createRunCounter();
first();
first();
expect(second()).toBe(1);`
      },
      {
        name: 'внутренняя переменная недоступна снаружи',
        code: `const next = createRunCounter();
next();
expect(typeof next.count).toBe('undefined');`
      }
    ],
    solution: `function createRunCounter() {
  let count = 0;

  return () => {
    count += 1;
    return count;
  };
}`
  },

  {
    id: 'js-28-logger-factory',
    title: 'Фабрика логгеров с окружением',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `createLogger(config)`, которая принимает объект ' +
      '`{ environment }` и возвращает функцию `log(message)`. Она возвращает строку ' +
      'вида `[preview] старт`. Важно: логгер должен читать **актуальное** значение ' +
      '`config.environment` в момент вызова, а не то, что было при создании.',
    starter: `function createLogger(config) {
  // Замыкание хранит доступ к объекту, а не копию его полей.
}`,
    hints: [
      'Замыкание сохраняет доступ к окружению, а не снимок значений.',
      'Если скопировать environment в отдельную переменную при создании, актуальность потеряется.',
      'Обращайтесь к полю объекта внутри возвращаемой функции.'
    ],
    tests: [
      {
        name: 'подставляет окружение',
        code: `const log = createLogger({ environment: 'local' });
expect(log('старт')).toBe('[local] старт');`
      },
      {
        name: 'видит изменение конфигурации после создания',
        code: `const config = { environment: 'local' };
const log = createLogger(config);
config.environment = 'preview';
expect(log('старт')).toBe('[preview] старт');`
      },
      {
        name: 'два логгера с разными конфигурациями независимы',
        code: `const first = createLogger({ environment: 'local' });
const second = createLogger({ environment: 'preview' });
expect(first('a') + ' | ' + second('b')).toBe('[local] a | [preview] b');`
      },
      {
        name: 'сообщение подставляется как есть',
        code: `const log = createLogger({ environment: 'ci' });
expect(log('')).toBe('[ci] ');`
      }
    ],
    solution: `function createLogger(config) {
  return (message) => \`[\${config.environment}] \${message}\`;
}`
  }
]
