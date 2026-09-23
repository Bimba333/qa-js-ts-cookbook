export default [
  {
    id: 'js-95-normalize-to-utc',
    title: 'Нормализация даты в UTC',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `toUtcString(value)`, которая принимает строку или объект ' +
      '`Date` и возвращает строку ISO в UTC. Для некорректной даты вернуть `null`, ' +
      'не выбрасывая ошибку.',
    starter: `function toUtcString(value) {
  // new Date('не дата') не бросает — он даёт Invalid Date.
}`,
    hints: [
      'Некорректная дата не выбрасывает ошибку, а даёт Invalid Date.',
      'Проверить её можно через Number.isNaN(date.getTime()).',
      'Строку в UTC даёт toISOString.'
    ],
    tests: [
      {
        name: 'строка приводится к UTC',
        code: `expect(toUtcString('2026-09-22T10:00:00Z')).toBe('2026-09-22T10:00:00.000Z');`
      },
      {
        name: 'смещение учитывается',
        code: `expect(toUtcString('2026-09-22T13:00:00+03:00')).toBe('2026-09-22T10:00:00.000Z');`
      },
      {
        name: 'объект Date тоже принимается',
        code: `expect(toUtcString(new Date('2026-09-22T10:00:00Z'))).toBe('2026-09-22T10:00:00.000Z');`
      },
      {
        name: 'некорректная дата даёт null',
        code: `expect(toUtcString('не дата')).toBe(null);`
      },
      {
        name: 'ошибки не возникает',
        code: `let thrown = false;
try { toUtcString('мусор'); } catch (error) { thrown = true; }
expect(thrown).toBe(false);`
      }
    ],
    solution: `function toUtcString(value) {
  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}`
  },

  {
    id: 'js-95-duration-between',
    title: 'Длительность между двумя моментами',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `durationMs(start, end)`, которая возвращает длительность в ' +
      'миллисекундах между двумя датами. Порядок аргументов не важен: результат ' +
      'всегда неотрицательный. Для некорректных дат вернуть `null`.',
    starter: `function durationMs(start, end) {
  // Вычитание дат даёт разницу в миллисекундах.
}`,
    hints: [
      'Вычитание объектов Date даёт число миллисекунд.',
      'Абсолютное значение даёт Math.abs.',
      'Некорректную дату нужно отсечь до вычисления.'
    ],
    tests: [
      {
        name: 'считает разницу',
        code: `expect(durationMs(new Date('2026-09-22T10:00:00Z'), new Date('2026-09-23T10:00:00Z')))
  .toBe(86400000);`
      },
      {
        name: 'порядок аргументов не важен',
        code: `expect(durationMs(new Date('2026-09-23T10:00:00Z'), new Date('2026-09-22T10:00:00Z')))
  .toBe(86400000);`
      },
      {
        name: 'одинаковые моменты дают ноль',
        code: `const moment = new Date('2026-09-22T10:00:00Z');
expect(durationMs(moment, moment)).toBe(0);`
      },
      {
        name: 'некорректная дата даёт null',
        code: `expect(durationMs(new Date('не дата'), new Date())).toBe(null);`
      }
    ],
    solution: `function durationMs(start, end) {
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  return Math.abs(end.getTime() - start.getTime());
}`
  }
]
