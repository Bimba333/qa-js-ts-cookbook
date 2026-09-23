export default [
  {
    id: 'ts-127-narrow-config-value',
    title: 'Сужение значения из конфигурации',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Напишите функцию `readTimeout(value: unknown): number`, которая возвращает ' +
      'число таймаута. Допустимы число и строка, содержащая число. Отрицательные ' +
      'значения и всё остальное дают `5000`. Сужение выполняйте проверками, а не ' +
      'приведением через `as`.',
    starter: `function readTimeout(value: unknown): number {
  // typeof сужает unknown до конкретного типа.
  return 5000;
}`,
    hints: [
      'Для примитивов сужение выполняет typeof.',
      'Строку нужно преобразовать и проверить результат.',
      'Отрицательное значение и NaN одинаково недопустимы.'
    ],
    tests: [
      {
        name: 'число возвращается как есть',
        code: `expect(readTimeout(1000)).toBe(1000);`
      },
      {
        name: 'строка с числом разбирается',
        code: `expect(readTimeout('2500')).toBe(2500);`
      },
      {
        name: 'отрицательное значение заменяется',
        code: `expect(readTimeout(-1)).toBe(5000);`
      },
      {
        name: 'нечисловая строка заменяется',
        code: `expect(readTimeout('быстро')).toBe(5000);`
      },
      {
        name: 'null и объект заменяются',
        code: `expect(readTimeout(null) + readTimeout({})).toBe(10000);`
      }
    ],
    solution: `function readTimeout(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);

    if (value.trim() !== '' && Number.isFinite(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  return 5000;
}`
  },

  {
    id: 'ts-127-narrow-union-member',
    title: 'Сужение объединения по форме',
    difficulty: 'medium',
    lang: 'ts',
    prompt:
      'Объявите тип `Source` как объединение `string` и `{ url: string }`. Напишите ' +
      'функцию `readUrl(source: Source): string`, которая возвращает саму строку или ' +
      'поле `url`. Обращаться к полю объединения без сужения нельзя.',
    starter: `type Source = string | { url: string };

function readUrl(source: Source): string {
  // У значения объединения доступны только общие члены.
  return '';
}`,
    hints: [
      'Сначала отделите строку через typeof.',
      'После этого остаётся только объектный вариант.',
      'Поле url доступно лишь в суженной ветке.'
    ],
    tests: [
      {
        name: 'строка возвращается как есть',
        code: `expect(readUrl('http://a')).toBe('http://a');`
      },
      {
        name: 'объект даёт поле url',
        code: `expect(readUrl({ url: 'http://b' })).toBe('http://b');`
      },
      {
        name: 'пустая строка сохраняется',
        code: `expect(readUrl('')).toBe('');`
      },
      {
        name: 'пустой url сохраняется',
        code: `expect(readUrl({ url: '' })).toBe('');`
      }
    ],
    solution: `type Source = string | { url: string };

function readUrl(source: Source): string {
  if (typeof source === 'string') {
    return source;
  }

  return source.url;
}`
  }
]
