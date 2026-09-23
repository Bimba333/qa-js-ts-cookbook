export default [
  {
    id: 'js-25-early-return-guard',
    title: 'Ранний возврат вместо вложенных условий',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `validateItem(item)`, которая возвращает строку с первой ' +
      'найденной проблемой или `null`, если проблем нет. Проверки по порядку: ' +
      'объект отсутствует — `нет данных`; пустое имя — `нет имени`; отрицательная ' +
      'длительность — `отрицательная длительность`. Используйте ранние возвраты.',
    starter: `function validateItem(item) {
  // Первая найденная проблема прекращает проверку.
}`,
    hints: [
      'Ранний возврат прекращает выполнение функции сразу.',
      'Порядок проверок важен: возвращается первая проблема.',
      'Отсутствие проблем даёт null.'
    ],
    tests: [
      {
        name: 'нет объекта',
        code: `expect(validateItem(null)).toBe('нет данных');`
      },
      {
        name: 'пустое имя',
        code: `expect(validateItem({ name: '', durationMs: 1 })).toBe('нет имени');`
      },
      {
        name: 'отрицательная длительность',
        code: `expect(validateItem({ name: 'login', durationMs: -5 })).toBe('отрицательная длительность');`
      },
      {
        name: 'корректный объект',
        code: `expect(validateItem({ name: 'login', durationMs: 0 })).toBe(null);`
      },
      {
        name: 'возвращается ПЕРВАЯ проблема',
        code: `expect(validateItem({ name: '', durationMs: -5 })).toBe('нет имени');`
      }
    ],
    solution: `function validateItem(item) {
  if (!item) {
    return 'нет данных';
  }

  if (!item.name) {
    return 'нет имени';
  }

  if (item.durationMs < 0) {
    return 'отрицательная длительность';
  }

  return null;
}`
  },

  {
    id: 'js-25-missing-return',
    title: 'Функция без возврата',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `applyAll(value, steps)`, которая последовательно применяет ' +
      'к значению функции из массива. Если какой-то шаг ничего не вернул, его ' +
      'результат игнорируется и в следующий шаг передаётся прежнее значение — так ' +
      'забытый `return` не обнуляет цепочку.',
    starter: `function applyAll(value, steps) {
  // Шаг без возврата даёт undefined — прежнее значение нужно сохранить.
}`,
    hints: [
      'Функция без return возвращает undefined.',
      'Перед заменой значения проверьте результат шага.',
      'Значение null считается осмысленным и заменяет прежнее.'
    ],
    tests: [
      {
        name: 'применяет шаги по очереди',
        code: `expect(applyAll(2, [(x) => x + 1, (x) => x * 10])).toBe(30);`
      },
      {
        name: 'шаг без возврата не обнуляет значение',
        code: `expect(applyAll(5, [(x) => { x + 1; }, (x) => x * 2])).toBe(10);`
      },
      {
        name: 'пустой список шагов возвращает исходное значение',
        code: `expect(applyAll('готово', [])).toBe('готово');`
      },
      {
        name: 'null от шага заменяет значение',
        code: `expect(applyAll(1, [() => null])).toBe(null);`
      }
    ],
    solution: `function applyAll(value, steps) {
  let current = value;

  for (const step of steps) {
    const next = step(current);

    if (next !== undefined) {
      current = next;
    }
  }

  return current;
}`
  }
]
