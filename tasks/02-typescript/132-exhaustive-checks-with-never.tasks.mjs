export default [
  {
    id: 'ts-132-exhaustive-status',
    title: 'Проверка полноты разбора',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите тип `Status` как `"passed" | "failed" | "skipped"` и функцию ' +
      '`weight(status: Status): number`, возвращающую `0`, `1` и `2`. В ветке по ' +
      'умолчанию бросьте ошибку `неизвестный статус: <значение>` — так нераспознанное ' +
      'значение обнаружится во время выполнения, а не пройдёт молча.',
    starter: `type Status = 'passed' | 'failed' | 'skipped';

function weight(status: Status): number {
  // Ветка по умолчанию должна сообщать о неизвестном значении.
  return 0;
}`,
    hints: [
      'Все объявленные варианты нужно разобрать явно.',
      'Ветка по умолчанию не возвращает значение, а бросает ошибку.',
      'Сообщение собирается из текста и самого значения.'
    ],
    tests: [
      {
        name: 'известные значения',
        code: `expect([weight('passed'), weight('failed'), weight('skipped')]).toEqual([0, 1, 2]);`
      },
      {
        name: 'неизвестное значение бросает ошибку',
        code: `let message = '';
try { weight('broken' as never); } catch (error) { message = (error as Error).message; }
expect(message).toBe('неизвестный статус: broken');`
      },
      {
        name: 'ошибка является объектом Error',
        code: `let isError = false;
try { weight('x' as never); } catch (error) { isError = error instanceof Error; }
expect(isError).toBe(true);`
      },
      {
        name: 'подходит для сортировки',
        code: `const sorted: Status[] = ['skipped', 'passed', 'failed'];
expect(sorted.sort((a, b) => weight(a) - weight(b))).toEqual(['passed', 'failed', 'skipped']);`
      }
    ],
    solution: `type Status = 'passed' | 'failed' | 'skipped';

function weight(status: Status): number {
  switch (status) {
    case 'passed':
      return 0;
    case 'failed':
      return 1;
    case 'skipped':
      return 2;
    default: {
      const unknownStatus: never = status;

      throw new Error('неизвестный статус: ' + String(unknownStatus));
    }
  }
}`
  },

  {
    id: 'ts-132-exhaustive-outcome',
    title: 'Полный разбор размеченного объединения',
    difficulty: 'hard',
    lang: 'ts',
    prompt:
      'Объявите тип `Event` как объединение `{ kind: "start" }`, ' +
      '`{ kind: "finish"; durationMs: number }` и `{ kind: "error"; message: string }`. ' +
      'Напишите функцию `render(event: Event): string`, возвращающую `"старт"`, ' +
      '`"финиш за <мс> мс"` или `"ошибка: <сообщение>"`. Неизвестный вид события ' +
      'должен приводить к ошибке.',
    starter: `type Event =
  | { kind: 'start' }
  | { kind: 'finish'; durationMs: number }
  | { kind: 'error'; message: string };

function render(event: Event): string {
  // Поле kind является различителем.
  return '';
}`,
    hints: [
      'Сужение выполняется по полю kind.',
      'В каждой ветке доступны только её собственные поля.',
      'Ветка по умолчанию бросает ошибку с указанием вида события.'
    ],
    tests: [
      {
        name: 'событие старта',
        code: `expect(render({ kind: 'start' })).toBe('старт');`
      },
      {
        name: 'событие завершения',
        code: `expect(render({ kind: 'finish', durationMs: 120 })).toBe('финиш за 120 мс');`
      },
      {
        name: 'событие ошибки',
        code: `expect(render({ kind: 'error', message: 'нет доступа' })).toBe('ошибка: нет доступа');`
      },
      {
        name: 'неизвестный вид бросает ошибку',
        code: `let thrown = false;
try { render({ kind: 'unknown' } as never); } catch (error) { thrown = true; }
expect(thrown).toBe(true);`
      }
    ],
    solution: `type Event =
  | { kind: 'start' }
  | { kind: 'finish'; durationMs: number }
  | { kind: 'error'; message: string };

function render(event: Event): string {
  switch (event.kind) {
    case 'start':
      return 'старт';
    case 'finish':
      return 'финиш за ' + event.durationMs + ' мс';
    case 'error':
      return 'ошибка: ' + event.message;
    default: {
      const unknownEvent: never = event;

      throw new Error('неизвестное событие: ' + JSON.stringify(unknownEvent));
    }
  }
}`
  }
]
