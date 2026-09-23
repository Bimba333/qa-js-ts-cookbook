export default [
  {
    id: 'qa-226-event-record',
    title: 'Запись события с известными полями',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `createLogger(sink, options)`, где `sink` — функция, принимающая ' +
      'готовую запись, а `options` содержит `testId` и `secrets` (массив строк). ' +
      'У логгера есть методы `info(message, context)` и `error(message, context)`. ' +
      'Каждая запись — объект `{ level, message, testId, ...context }`. ' +
      'Любое строковое значение, совпадающее с секретом, заменяется на `***`. ' +
      'Значение `undefined` в контексте в запись не попадает. ' +
      'Если контекст не сериализуется в JSON, вместо записи уходит ' +
      '`{ level, message, testId, contextError: "контекст не сериализуется" }`.',
    starter: `function createLogger(sink, options) {
  return {
    info(message, context) {},
    error(message, context) {}
  };
}`,
    hints: [
      'Уровень и сообщение — обязательные поля, остальное приходит из контекста.',
      'Циклическую ссылку обнаруживает JSON.stringify — он бросает ошибку.',
      'Замена секретов выполняется по значению, а не по имени поля.'
    ],
    tests: [
      {
        name: 'запись содержит обязательные поля',
        code: `const written = [];
const logger = createLogger(record => written.push(record), { testId: 'T-1', secrets: [] });
logger.info('запрос отправлен', { method: 'GET' });
expect(written[0]).toEqual({
  level: 'info',
  message: 'запрос отправлен',
  testId: 'T-1',
  method: 'GET'
});`
      },
      {
        name: 'уровень ошибки отличается',
        code: `const errors = [];
const errorLogger = createLogger(record => errors.push(record), { testId: 'T-2', secrets: [] });
errorLogger.error('запрос не прошёл', {});
expect(errors[0].level).toBe('error');`
      },
      {
        name: 'секрет заменяется в любом поле',
        code: `const masked = [];
const secretLogger = createLogger(record => masked.push(record), {
  testId: 'T-3',
  secrets: ['s3cret']
});
secretLogger.info('вход', { password: 's3cret', note: 'ok' });
expect(masked[0].password).toBe('***');
expect(masked[0].note).toBe('ok');`
      },
      {
        name: 'undefined в запись не попадает',
        code: `const sparse = [];
const sparseLogger = createLogger(record => sparse.push(record), { testId: 'T-4', secrets: [] });
sparseLogger.info('шаг', { known: 1, unknown: undefined });
expect(Object.keys(sparse[0])).toEqual(['level', 'message', 'testId', 'known']);`
      },
      {
        name: 'несериализуемый контекст не ломает запись',
        code: `const broken = [];
const brokenLogger = createLogger(record => broken.push(record), { testId: 'T-5', secrets: [] });
const cyclic = { name: 'узел' };
cyclic.self = cyclic;
brokenLogger.info('шаг', cyclic);
expect(broken[0]).toEqual({
  level: 'info',
  message: 'шаг',
  testId: 'T-5',
  contextError: 'контекст не сериализуется'
});`
      },
      {
        name: 'контекст можно не передавать',
        code: `const bare = [];
const bareLogger = createLogger(record => bare.push(record), { testId: 'T-6', secrets: [] });
bareLogger.info('без контекста');
expect(bare[0]).toEqual({ level: 'info', message: 'без контекста', testId: 'T-6' });`
      },
      {
        name: 'каждый вызов отдаёт отдельную запись',
        code: `const many = [];
const manyLogger = createLogger(record => many.push(record), { testId: 'T-7', secrets: [] });
manyLogger.info('первый', { step: 1 });
manyLogger.info('второй', { step: 2 });
expect(many).toHaveLength(2);
expect(many[0].step).toBe(1);
expect(many[1].step).toBe(2);`
      }
    ],
    solution: `function createLogger(sink, options) {
  const { testId, secrets } = options;

  const mask = value =>
    typeof value === 'string' && secrets.includes(value) ? '***' : value;

  const write = (level, message, context) => {
    const base = { level, message, testId };

    if (context === undefined) {
      sink(base);
      return;
    }

    try {
      JSON.stringify(context);
    } catch {
      sink({ ...base, contextError: 'контекст не сериализуется' });
      return;
    }

    const record = { ...base };

    for (const [key, value] of Object.entries(context)) {
      if (value !== undefined) {
        record[key] = mask(value);
      }
    }

    sink(record);
  };

  return {
    info(message, context) {
      write('info', message, context);
    },
    error(message, context) {
      write('error', message, context);
    }
  };
}`
  }
]
