export default [
  {
    id: 'qa-231-diagnostic-policy',
    title: 'Политика диагностики по классу падения',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите `planDiagnostics(failure, options)`. `failure` — ' +
      '`{ testId, kind, message, attempt }`, где `kind` — один из ' +
      '`assertion`, `timeout`, `network`, `setup`. `options` содержит ' +
      '`secrets` (массив строк) и `maxMessage` (предельная длина сообщения). ' +
      'Верните `{ testId, artifacts, keepRun, message }`. Набор артефактов по ' +
      'классу: `assertion` — `screenshot`, `trace`; `timeout` — `screenshot`, ' +
      '`trace`, `video`; `network` — `trace`, `har`; `setup` — `logs`. ' +
      '`keepRun` истинно для `network` и `setup`. Сообщение сначала очищается от ' +
      'секретов (замена на `***`), потом обрезается до `maxMessage` символов. ' +
      'Неизвестный класс — ошибка `неизвестный класс падения`.',
    starter: `function planDiagnostics(failure, options) {
  // Маскирование выполняется до обрезки, иначе секрет может уцелеть.

  return { testId: '', artifacts: [], keepRun: false, message: '' };
}`,
    hints: [
      'Соответствие класса и набора артефактов удобно задать таблицей.',
      'Порядок операций над сообщением задан условием и важен.',
      'Идентификатор теста связывает артефакты между собой.'
    ],
    tests: [
      {
        name: 'падение проверки',
        code: `expect(planDiagnostics(
  { testId: 'T-1', kind: 'assertion', message: 'ожидалось 1', attempt: 1 },
  { secrets: [], maxMessage: 100 }
)).toEqual({ testId: 'T-1', artifacts: ['screenshot', 'trace'], keepRun: false, message: 'ожидалось 1' });`
      },
      {
        name: 'таймаут добавляет запись экрана',
        code: `expect(planDiagnostics(
  { testId: 'T-2', kind: 'timeout', message: 'не дождались', attempt: 2 },
  { secrets: [], maxMessage: 100 }
).artifacts).toEqual(['screenshot', 'trace', 'video']);`
      },
      {
        name: 'сетевое падение сохраняет прогон',
        code: `const network = planDiagnostics(
  { testId: 'T-3', kind: 'network', message: 'соединение сброшено', attempt: 1 },
  { secrets: [], maxMessage: 100 }
);
expect(network.artifacts).toEqual(['trace', 'har']);
expect(network.keepRun).toBe(true);`
      },
      {
        name: 'секрет не попадает в сообщение',
        code: `expect(planDiagnostics(
  { testId: 'T-4', kind: 'setup', message: 'token=s3cret отклонён', attempt: 1 },
  { secrets: ['s3cret'], maxMessage: 100 }
).message).toBe('token=*** отклонён');`
      },
      {
        name: 'маскирование выполняется до обрезки',
        code: `const masked = planDiagnostics(
  { testId: 'T-5', kind: 'setup', message: 's3cret и ещё много текста', attempt: 1 },
  { secrets: ['s3cret'], maxMessage: 5 }
);
expect(masked.message).toBe('*** и');
expect(masked.message.includes('s3cret')).toBe(false);`
      },
      {
        name: 'сообщение обрезается до предела',
        code: `expect(planDiagnostics(
  { testId: 'T-6', kind: 'assertion', message: 'a'.repeat(50), attempt: 1 },
  { secrets: [], maxMessage: 10 }
).message).toBe('a'.repeat(10));`
      },
      {
        name: 'неизвестный класс отвергается',
        code: `let message = '';
try {
  planDiagnostics({ testId: 'T-7', kind: 'странный', message: '', attempt: 1 },
    { secrets: [], maxMessage: 10 });
} catch (error) { message = error.message; }
expect(message).toBe('неизвестный класс падения');`
      }
    ],
    solution: `const ARTIFACTS = {
  assertion: ['screenshot', 'trace'],
  timeout: ['screenshot', 'trace', 'video'],
  network: ['trace', 'har'],
  setup: ['logs']
};

const KEEP_RUN = new Set(['network', 'setup']);

function planDiagnostics(failure, options) {
  const artifacts = ARTIFACTS[failure.kind];

  if (artifacts === undefined) {
    throw new Error('неизвестный класс падения');
  }

  let message = failure.message;

  for (const secret of options.secrets) {
    if (secret !== '') {
      message = message.split(secret).join('***');
    }
  }

  return {
    testId: failure.testId,
    artifacts: [...artifacts],
    keepRun: KEEP_RUN.has(failure.kind),
    message: message.slice(0, options.maxMessage)
  };
}`
  }
]
