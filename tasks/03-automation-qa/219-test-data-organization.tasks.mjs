export default [
  {
    id: 'qa-219-input-and-expectation',
    title: 'Вход и ожидание должны быть независимы',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Тест, где ожидаемый результат вычислен из входных данных той же формулой, ' +
      'что и проверяемый код, не проверяет ничего. Напишите ' +
      '`checkIndependence(testCase)`, где `testCase` — `{ name, input, expected }`. ' +
      'Верните массив проблем: `общий объект` — если `expected` или любое его ' +
      'поле ссылается на тот же объект, что и `input` или его поле; ' +
      '`ожидание вычислено` — если `expected` является функцией; ' +
      '`ожидание пусто` — если `expected` равно `undefined`. ' +
      'Порядок проблем: общий объект, ожидание вычислено, ожидание пусто. ' +
      'Если проблем нет, верните пустой массив.',
    starter: `function checkIndependence(testCase) {
  // Совпадение по значению допустимо. Совпадение по ссылке — нет.

  return [];
}`,
    hints: [
      'Сравнение по ссылке — это строгое равенство объектов.',
      'Проверять надо и сами значения, и их поля первого уровня.',
      'Копия объекта с тем же содержимым проблемой не является.'
    ],
    tests: [
      {
        name: 'независимые данные проблем не дают',
        code: `expect(checkIndependence({
  name: 'a',
  input: { id: 1 },
  expected: { id: 1 }
})).toEqual([]);`
      },
      {
        name: 'общий объект обнаруживается',
        code: `const shared = { id: 1 };
expect(checkIndependence({ name: 'a', input: shared, expected: shared }))
  .toEqual(['общий объект']);`
      },
      {
        name: 'общее поле тоже обнаруживается',
        code: `const nested = { value: 1 };
expect(checkIndependence({
  name: 'a',
  input: { payload: nested },
  expected: { payload: nested }
})).toEqual(['общий объект']);`
      },
      {
        name: 'вычисляемое ожидание обнаруживается',
        code: `expect(checkIndependence({
  name: 'a',
  input: { id: 1 },
  expected: input => input.id
})).toEqual(['ожидание вычислено']);`
      },
      {
        name: 'пустое ожидание обнаруживается',
        code: `expect(checkIndependence({ name: 'a', input: { id: 1 } }))
  .toEqual(['ожидание пусто']);`
      },
      {
        name: 'примитивы общими не считаются',
        code: `expect(checkIndependence({ name: 'a', input: { id: 'x' }, expected: { id: 'x' } }))
  .toEqual([]);`
      },
      {
        name: 'общий массив тоже обнаруживается',
        code: `const items = [1, 2, 3];
expect(checkIndependence({ name: 'a', input: { items }, expected: { items } }))
  .toEqual(['общий объект']);`
      },
      {
        name: 'копия массива проблемой не является',
        code: `const source = [1, 2, 3];
expect(checkIndependence({ name: 'a', input: { items: source }, expected: { items: [...source] } }))
  .toEqual([]);`
      }
    ],
    solution: `function collectReferences(value) {
  const references = new Set();

  if (value !== null && typeof value === 'object') {
    references.add(value);

    for (const nested of Object.values(value)) {
      if (nested !== null && typeof nested === 'object') {
        references.add(nested);
      }
    }
  }

  return references;
}

function checkIndependence(testCase) {
  const { input, expected } = testCase;
  const problems = [];

  const fromInput = collectReferences(input);
  const fromExpected = collectReferences(expected);

  const shared = [...fromExpected].some(reference => fromInput.has(reference));

  if (shared) {
    problems.push('общий объект');
  }

  if (typeof expected === 'function') {
    problems.push('ожидание вычислено');
  }

  if (expected === undefined) {
    problems.push('ожидание пусто');
  }

  return problems;
}`
  }
]
