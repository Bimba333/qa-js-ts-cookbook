export default [
  {
    id: 'ts-125-context-is-lost',
    title: 'Потеря получателя вызова',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите объект `reporter` с полем `prefix: "[отчёт]"` и методом ' +
      '`format(this: { prefix: string }, message: string): string`. Метод ' +
      'возвращает `<prefix> <message>`, но сначала убеждается, что получатель ' +
      'вызова есть: если `this` отсутствует или у него нет строкового `prefix`, ' +
      'выбрасывается ошибка `получатель вызова потерян`. ' +
      'Напишите `runCases()`, возвращающую ' +
      '`{ direct, detachedMessage, bound, arrowBound }`: результат обычного ' +
      'вызова, текст ошибки при вызове оторванного метода, результат вызова ' +
      'через `bind` и результат вызова обёртки-стрелки.',
    starter: `const reporter = {
  prefix: '[отчёт]',
  format(this: { prefix: string } | undefined, message: string): string {
    // this-параметр проверяется компилятором, но во время выполнения
    // получателя может не быть вовсе.
    return '';
  }
};

function runCases() {
  return { direct: '', detachedMessage: '', bound: '', arrowBound: '' };
}`,
    hints: [
      'Присваивание метода переменной не сохраняет объект вызова.',
      'Проверка получателя должна работать и когда this — совсем другой объект.',
      'Стрелка не имеет своего this и берёт его из окружающего кода.'
    ],
    tests: [
      {
        name: 'обычный вызов работает',
        code: `expect(runCases().direct).toBe('[отчёт] готово');`
      },
      {
        name: 'оторванный вызов сообщает о потере получателя',
        code: `expect(runCases().detachedMessage).toBe('получатель вызова потерян');`
      },
      {
        name: 'привязка восстанавливает получателя',
        code: `expect(runCases().bound).toBe('[отчёт] готово');`
      },
      {
        name: 'стрелка-обёртка тоже работает',
        code: `expect(runCases().arrowBound).toBe('[отчёт] готово');`
      },
      {
        name: 'чужой получатель тоже отвергается',
        code: `let message = '';
try { reporter.format.call({ other: 1 } as any, 'шаг'); }
catch (error) { message = error.message; }
expect(message).toBe('получатель вызова потерян');`
      },
      {
        name: 'подходящий получатель принимается',
        code: `expect(reporter.format.call({ prefix: '[тест]' }, 'шаг')).toBe('[тест] шаг');`
      }
    ],
    solution: `const reporter = {
  prefix: '[отчёт]',
  format(this: { prefix: string } | undefined, message: string): string {
    if (this === undefined || typeof this.prefix !== 'string') {
      throw new Error('получатель вызова потерян');
    }

    return this.prefix + ' ' + message;
  }
};

function runCases() {
  const direct = reporter.format('готово');

  const detached = reporter.format;
  let detachedMessage = '';

  try {
    detached('готово');
  } catch (error) {
    detachedMessage = (error as Error).message;
  }

  const bound = reporter.format.bind(reporter)('готово');
  const arrow = (message: string) => reporter.format(message);

  return { direct, detachedMessage, bound, arrowBound: arrow('готово') };
}`
  }
]
