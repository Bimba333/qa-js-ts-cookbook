export default [
  {
    id: 'ts-118-status-label',
    title: 'Разбор объединения статусов',
    difficulty: 'easy',
    lang: 'ts',
    prompt:
      'Объявите тип `Status` как объединение `"passed" | "failed" | "skipped"` и ' +
      'напишите функцию `label(status: Status): string`, возвращающую ' +
      '`"пройден"`, `"упал"` или `"пропущен"` соответственно.',
    starter: `type Status = // объединение трёх литералов
  string;

function label(status: Status): string {
  // Разберите все варианты.
  return '';
}`,
    hints: [
      'Объединение литеральных типов записывается через вертикальную черту.',
      'Разбор удобно сделать через switch или последовательность сравнений.',
      'Все три варианта должны быть покрыты.'
    ],
    tests: [
      {
        name: 'passed',
        code: `expect(label('passed')).toBe('пройден');`
      },
      {
        name: 'failed',
        code: `expect(label('failed')).toBe('упал');`
      },
      {
        name: 'skipped',
        code: `expect(label('skipped')).toBe('пропущен');`
      },
      {
        name: 'разные статусы дают разные подписи',
        code: `expect(new Set([label('passed'), label('failed'), label('skipped')]).size).toBe(3);`
      }
    ],
    solution: `type Status = 'passed' | 'failed' | 'skipped';

function label(status: Status): string {
  switch (status) {
    case 'passed':
      return 'пройден';
    case 'failed':
      return 'упал';
    default:
      return 'пропущен';
  }
}`
  },

  {
    id: 'ts-118-discriminated-result',
    title: 'Размеченное объединение результата',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите тип `Outcome` как объединение `{ ok: true; value: string }` и ' +
      '`{ ok: false; message: string }`. Напишите функцию ' +
      '`describeOutcome(outcome: Outcome): string`, которая возвращает значение при ' +
      'успехе и строку `"ошибка: <сообщение>"` при неудаче. Обращаться к полю, ' +
      'которого нет в текущей ветке, нельзя.',
    starter: `type Outcome =
  | { ok: true; value: string }
  | { ok: false; message: string };

function describeOutcome(outcome: Outcome): string {
  // Сузьте объединение по полю ok.
  return '';
}`,
    hints: [
      'Поле ok является различителем: по нему сужается объединение.',
      'После проверки ok === true доступно только поле value.',
      'В ветке else доступно только message.'
    ],
    tests: [
      {
        name: 'успешный результат',
        code: `expect(describeOutcome({ ok: true, value: 'готово' })).toBe('готово');`
      },
      {
        name: 'неуспешный результат',
        code: `expect(describeOutcome({ ok: false, message: 'нет доступа' }))
  .toBe('ошибка: нет доступа');`
      },
      {
        name: 'пустое значение сохраняется',
        code: `expect(describeOutcome({ ok: true, value: '' })).toBe('');`
      },
      {
        name: 'пустое сообщение обрабатывается',
        code: `expect(describeOutcome({ ok: false, message: '' })).toBe('ошибка: ');`
      }
    ],
    solution: `type Outcome =
  | { ok: true; value: string }
  | { ok: false; message: string };

function describeOutcome(outcome: Outcome): string {
  if (outcome.ok) {
    return outcome.value;
  }

  return 'ошибка: ' + outcome.message;
}`
  }
]
