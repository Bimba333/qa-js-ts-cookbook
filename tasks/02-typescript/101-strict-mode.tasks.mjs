export default [
  {
    id: 'ts-101-strict-null-handling',
    title: 'Что меняет строгая проверка на `null`',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите функцию `readTitle(task: { title?: string | null } | null): string`, ' +
      'которая возвращает заголовок, а при его отсутствии — строку `без названия`. ' +
      'Пустая строка и строка из пробелов считаются отсутствием названия, а вот ' +
      'строка `0` — нормальное название. Дополнительно напишите ' +
      '`countPresent(tasks: Array<{ title?: string | null }>): number` — сколько ' +
      'записей имеет непустое название.',
    starter: `function readTitle(task: { title?: string | null } | null): string {
  // Отсутствие объекта, отсутствие поля и пустая строка — разные случаи.
  return '';
}

function countPresent(tasks: Array<{ title?: string | null }>): number {
  return 0;
}`,
    hints: [
      'Строгий режим требует обработать и `null`, и `undefined` — одной проверки на истинность мало, если важна строка `0`.',
      'Нулевое слияние `??` реагирует только на `null` и `undefined`, а `||` испортит и строку `0`.',
      'Пустоту строки проверяют после удаления пробелов по краям.'
    ],
    tests: [
      {
        name: 'обычное название возвращается',
        code: `expect(readTitle({ title: 'Проверить вход' })).toBe('Проверить вход');`
      },
      {
        name: 'строка `0` является названием',
        code: `expect(readTitle({ title: '0' })).toBe('0');`
      },
      {
        name: 'отсутствие объекта обрабатывается',
        code: `expect(readTitle(null)).toBe('без названия');`
      },
      {
        name: 'отсутствие поля и `null` обрабатываются',
        code: `expect(readTitle({})).toBe('без названия');
expect(readTitle({ title: null })).toBe('без названия');`
      },
      {
        name: 'пустая строка и пробелы не считаются названием',
        code: `expect(readTitle({ title: '' })).toBe('без названия');
expect(readTitle({ title: '   ' })).toBe('без названия');`
      },
      {
        name: 'подсчёт непустых названий',
        code: `expect(countPresent([
  { title: 'a' },
  { title: '' },
  { title: null },
  {},
  { title: '0' }
])).toBe(2);`
      }
    ],
    solution: `function readTitle(task: { title?: string | null } | null): string {
  const title = task?.title ?? '';

  return title.trim() === '' ? 'без названия' : title;
}

function countPresent(tasks: Array<{ title?: string | null }>): number {
  return tasks.filter(task => (task.title ?? '').trim() !== '').length;
}`
  }
]
