export default [
  {
    id: 'js-50-collect-failed-names',
    title: 'Собрать имена упавших тестов',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `collectFailedNames(results)`, которая принимает массив ' +
      'результатов вида `{ name, status }` и возвращает массив имён тестов со ' +
      'статусом `"failed"`. Обход выполните через `forEach()`, накапливая имена ' +
      'в подготовленный массив.',
    starter: `function collectFailedNames(results) {
  const failed = [];

  // Пройдите по results и добавьте нужные имена в failed.

  return failed;
}`,
    hints: [
      'forEach() ничего не возвращает — результат нужно накапливать самостоятельно.',
      'Внутри колбэка проверьте статус и добавьте имя в подготовленный массив.',
      'Возвращать нужно накопленный массив, а не результат вызова forEach().'
    ],
    tests: [
      {
        name: 'возвращает имена упавших тестов',
        code: `expect(collectFailedNames([
  { name: 'login', status: 'passed' },
  { name: 'order', status: 'failed' },
  { name: 'pay', status: 'failed' }
])).toEqual(['order', 'pay']);`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(collectFailedNames([])).toEqual([]);`
      },
      {
        name: 'если упавших нет, возвращает пустой массив',
        code: `expect(collectFailedNames([{ name: 'login', status: 'passed' }])).toEqual([]);`
      },
      {
        name: 'сохраняет исходный порядок',
        code: `expect(collectFailedNames([
  { name: 'z', status: 'failed' },
  { name: 'a', status: 'failed' }
])).toEqual(['z', 'a']);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = [{ name: 'login', status: 'failed' }];
collectFailedNames(source);
expect(source).toEqual([{ name: 'login', status: 'failed' }]);`
      }
    ],
    solution: `function collectFailedNames(results) {
  const failed = [];

  results.forEach((result) => {
    if (result.status === 'failed') {
      failed.push(result.name);
    }
  });

  return failed;
}`
  },

  {
    id: 'js-50-build-report-lines',
    title: 'Строки отчёта с номерами',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `buildReportLines(results)`, которая принимает массив ' +
      '`{ name, status }` и возвращает массив строк вида `"1. login — passed"`. ' +
      'Нумерация начинается с единицы. Используйте второй аргумент колбэка ' +
      '`forEach()` — индекс элемента.',
    starter: `function buildReportLines(results) {
  const lines = [];

  // Колбэк forEach получает элемент и его индекс.

  return lines;
}`,
    hints: [
      'Колбэк forEach() принимает три аргумента: элемент, индекс и сам массив.',
      'Индекс начинается с нуля, а нумерация в отчёте — с единицы.',
      'Строку удобно собрать шаблонным литералом.'
    ],
    tests: [
      {
        name: 'нумерует строки с единицы',
        code: `expect(buildReportLines([
  { name: 'login', status: 'passed' },
  { name: 'order', status: 'failed' }
])).toEqual(['1. login — passed', '2. order — failed']);`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(buildReportLines([])).toEqual([]);`
      },
      {
        name: 'работает с одним элементом',
        code: `expect(buildReportLines([{ name: 'solo', status: 'skipped' }]))
  .toEqual(['1. solo — skipped']);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = [{ name: 'login', status: 'passed' }];
buildReportLines(source);
expect(source).toEqual([{ name: 'login', status: 'passed' }]);`
      }
    ],
    solution: `function buildReportLines(results) {
  const lines = [];

  results.forEach((result, index) => {
    lines.push(\`\${index + 1}. \${result.name} — \${result.status}\`);
  });

  return lines;
}`
  }
]
