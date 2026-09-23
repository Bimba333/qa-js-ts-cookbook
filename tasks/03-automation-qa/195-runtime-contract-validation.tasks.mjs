export default [
  {
    id: 'qa-195-validate-response-shape',
    title: 'Проверка контракта ответа',
    difficulty: 'hard',
    lang: 'api',
    prompt:
      'Напишите проверку контракта и примените её дважды. ' +
      'Контракт элемента: `id` — непустая строка, `title`, `status` и `priority` — ' +
      'строки, `version` — целое число не меньше нуля. Отсутствующее поле — тоже ' +
      'нарушение. Прочитайте `GET /work-items?limit=5` и проверьте элементы ответа, ' +
      'а затем прогоните ту же проверку по заведомо неверному набору из стартового ' +
      'кода. Верните `{ checked, violations, brokenViolations, sample }`: число ' +
      'проверенных элементов ответа, нарушения в ответе, нарушения в неверном ' +
      'наборе и первый элемент выборки.',
    starter: `const BROKEN = [
  { id: '', title: 'пустой идентификатор', status: 'NEW', priority: 'LOW', version: 1 },
  { id: 'WI-2', title: 42, status: 'NEW', priority: 'LOW', version: 1 },
  { id: 'WI-3', title: 'нет версии', status: 'NEW', priority: 'LOW' },
  { id: 'WI-4', title: 'дробная версия', status: 'NEW', priority: 'LOW', version: 1.5 }
];

export default async function solve(api) {
  const response = await api.get('/work-items?limit=5');

  // Одна и та же проверка применяется к ответу и к неверному набору.

  return { checked: 0, violations: [], brokenViolations: [], sample: null };
}`,
    hints: [
      'Проверку удобно вынести в отдельную функцию: она нужна дважды.',
      'Отсутствующее поле и поле неверного типа — разные случаи, но оба нарушения.',
      'Number.isInteger отличает целое от дробного и от строки.'
    ],
    tests: [
      {
        name: 'проверено пять элементов ответа',
        code: `expect(result.checked).toBe(5);`
      },
      {
        name: 'в ответе стенда нарушений нет',
        code: `expect(result.violations).toEqual([]);`
      },
      {
        name: 'неверный набор даёт нарушения',
        code: `expect(result.brokenViolations.length >= 4).toBe(true);`
      },
      {
        name: 'нарушения описаны текстом',
        code: `expect(result.brokenViolations.every(item => typeof item === 'string')).toBe(true);`
      },
      {
        name: 'образец содержит обязательные поля',
        code: `expect(typeof result.sample.id).toBe('string');
expect(result.sample.id.length > 0).toBe(true);
expect(Number.isInteger(result.sample.version)).toBe(true);`
      },
      {
        name: 'выборка ограничена пятью записями',
        code: `const limited = await api.get('/work-items?limit=5');
expect(limited.body.items).toHaveLength(5);`
      }
    ],
    solution: `const BROKEN = [
  { id: '', title: 'пустой идентификатор', status: 'NEW', priority: 'LOW', version: 1 },
  { id: 'WI-2', title: 42, status: 'NEW', priority: 'LOW', version: 1 },
  { id: 'WI-3', title: 'нет версии', status: 'NEW', priority: 'LOW' },
  { id: 'WI-4', title: 'дробная версия', status: 'NEW', priority: 'LOW', version: 1.5 }
];

function findViolations(item, index) {
  const problems = [];

  if (typeof item.id !== 'string' || item.id === '') {
    problems.push('элемент ' + index + ': id не является непустой строкой');
  }

  for (const field of ['title', 'status', 'priority']) {
    if (typeof item[field] !== 'string') {
      problems.push('элемент ' + index + ': ' + field + ' не является строкой');
    }
  }

  if (!Number.isInteger(item.version) || item.version < 0) {
    problems.push('элемент ' + index + ': version не является целым неотрицательным');
  }

  return problems;
}

export default async function solve(api) {
  const response = await api.get('/work-items?limit=5');
  const items = response.body.items;

  return {
    checked: items.length,
    violations: items.flatMap(findViolations),
    brokenViolations: BROKEN.flatMap(findViolations),
    sample: items[0] ?? null
  };
}`
  }
]
