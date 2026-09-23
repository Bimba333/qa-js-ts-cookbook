export default [
  {
    id: 'js-15-parse-retry-count',
    title: 'Разбор числа из переменной окружения',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `parseRetries(raw)`, которая принимает строку из переменной ' +
      'окружения и возвращает целое число попыток. Если значение не является числом, ' +
      'вернуть `0`. Пустая строка и строка из пробелов числом не считаются.',
    starter: `function parseRetries(raw) {
  // Number('') даёт 0, а не NaN — это нужно учесть.
}`,
    hints: [
      'Number(\'\') возвращает 0, поэтому пустую строку нужно отсечь отдельно.',
      'Нечисловая строка даёт NaN, а NaN не равен самому себе.',
      'Проверить результат удобно через Number.isFinite.'
    ],
    tests: [
      {
        name: 'разбирает число',
        code: `expect(parseRetries('3')).toBe(3);`
      },
      {
        name: 'пустая строка даёт 0',
        code: `expect(parseRetries('')).toBe(0);`
      },
      {
        name: 'строка из пробелов даёт 0',
        code: `expect(parseRetries('   ')).toBe(0);`
      },
      {
        name: 'нечисловая строка даёт 0',
        code: `expect(parseRetries('abc')).toBe(0);`
      },
      {
        name: 'ноль остаётся нулём',
        code: `expect(parseRetries('0')).toBe(0);`
      }
    ],
    solution: `function parseRetries(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') {
    return 0;
  }

  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : 0;
}`
  },

  {
    id: 'js-15-describe-value',
    title: 'Безопасное описание значения для журнала',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `describeValue(value)`, которая возвращает строку для журнала. ' +
      'Для строки — саму строку, для числа и boolean — их строковое представление, ' +
      'для `null` — `"null"`, для `undefined` — `"undefined"`, для массива — элементы ' +
      'через запятую, для объекта — `"[object]"` вместо `[object Object]`.',
    starter: `function describeValue(value) {
  // String({}) даёт [object Object] — это бесполезно в журнале.
}`,
    hints: [
      'String(null) и String(undefined) уже дают нужные строки.',
      'Массив определяется через Array.isArray, а не через typeof.',
      'Обычный объект нужно обработать до общего приведения к строке.'
    ],
    tests: [
      {
        name: 'строка возвращается как есть',
        code: `expect(describeValue('готово')).toBe('готово');`
      },
      {
        name: 'число и boolean приводятся к строке',
        code: `expect(describeValue(42) + '|' + describeValue(true)).toBe('42|true');`
      },
      {
        name: 'null и undefined описываются словами',
        code: `expect(describeValue(null) + '|' + describeValue(undefined)).toBe('null|undefined');`
      },
      {
        name: 'массив перечисляется через запятую',
        code: `expect(describeValue(['a', 'b'])).toBe('a,b');`
      },
      {
        name: 'объект не превращается в [object Object]',
        code: `expect(describeValue({ a: 1 })).toBe('[object]');`
      }
    ],
    solution: `function describeValue(value) {
  if (Array.isArray(value)) {
    return value.join(',');
  }

  if (typeof value === 'object' && value !== null) {
    return '[object]';
  }

  return String(value);
}`
  }
]
