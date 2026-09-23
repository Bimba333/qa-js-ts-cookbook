export default [
  {
    id: 'js-17-duration-summary',
    title: 'Среднее и остаток от деления',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `durationSummary(durations)`, которая принимает массив чисел ' +
      'и возвращает объект `{ total, average, remainder }`: сумму, среднее с ' +
      'округлением вниз и остаток от деления суммы на количество. Для пустого ' +
      'массива вернуть все нули.',
    starter: `function durationSummary(durations) {
  // Деление на ноль даёт NaN или Infinity — пустой случай обработайте отдельно.
}`,
    hints: [
      'Остаток от деления даёт оператор %.',
      'Округление вниз выполняется Math.floor.',
      'Для пустого массива делить нельзя.'
    ],
    tests: [
      {
        name: 'считает сумму, среднее и остаток',
        code: `expect(durationSummary([10, 20, 31])).toEqual({ total: 61, average: 20, remainder: 1 });`
      },
      {
        name: 'для пустого массива все нули',
        code: `expect(durationSummary([])).toEqual({ total: 0, average: 0, remainder: 0 });`
      },
      {
        name: 'делится без остатка',
        code: `expect(durationSummary([10, 30])).toEqual({ total: 40, average: 20, remainder: 0 });`
      },
      {
        name: 'работает с одним элементом',
        code: `expect(durationSummary([7])).toEqual({ total: 7, average: 7, remainder: 0 });`
      }
    ],
    solution: `function durationSummary(durations) {
  if (durations.length === 0) {
    return { total: 0, average: 0, remainder: 0 };
  }

  const total = durations.reduce((sum, value) => sum + value, 0);

  return {
    total,
    average: Math.floor(total / durations.length),
    remainder: total % durations.length
  };
}`
  },

  {
    id: 'js-17-logical-result-value',
    title: 'Что возвращают логические операторы',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `pickLabel(primary, fallback)`, которая возвращает `primary`, ' +
      'если это непустая строка, иначе `fallback`. Затем напишите функцию ' +
      '`firstTruthy(values)`, которая возвращает первое истинное значение массива ' +
      'или `null`, если такого нет. Обе функции должны возвращать сами значения, ' +
      'а не логический результат.',
    starter: `function pickLabel(primary, fallback) {
  // Логический оператор возвращает значение, а не true или false.
}

function firstTruthy(values) {
  // Верните само значение, а не признак его наличия.
}`,
    hints: [
      'Оператор || возвращает первое истинное значение или последнее.',
      'Пустая строка ложна, поэтому она сама отсеется.',
      'Для поиска в массиве подойдёт метод, возвращающий элемент.'
    ],
    tests: [
      {
        name: 'берёт основное значение',
        code: `expect(pickLabel('готово', 'нет данных')).toBe('готово');`
      },
      {
        name: 'подставляет запасное при пустой строке',
        code: `expect(pickLabel('', 'нет данных')).toBe('нет данных');`
      },
      {
        name: 'находит первое истинное значение',
        code: `expect(firstTruthy([0, '', 'первое', 'второе'])).toBe('первое');`
      },
      {
        name: 'если истинных нет, возвращает null',
        code: `expect(firstTruthy([0, '', null])).toBe(null);`
      },
      {
        name: 'для пустого массива возвращает null',
        code: `expect(firstTruthy([])).toBe(null);`
      }
    ],
    solution: `function pickLabel(primary, fallback) {
  return primary || fallback;
}

function firstTruthy(values) {
  const found = values.find((value) => Boolean(value));

  return found === undefined ? null : found;
}`
  }
]
