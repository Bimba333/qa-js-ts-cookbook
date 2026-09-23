export default [
  {
    id: 'js-54-failed-report-lines',
    title: 'Отчёт только по упавшим',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `failedReport(results)`, которая принимает массив ' +
      '`{ name, status, durationMs }` и возвращает массив строк вида ' +
      '`"order (120 мс)"` — только для упавших тестов. Порядок сохраняется. ' +
      'Соберите результат цепочкой методов.',
    starter: `function failedReport(results) {
  // Сначала сократите набор, затем преобразуйте.
}`,
    hints: [
      'Цепочка возможна, пока каждый шаг возвращает массив.',
      'Отбор перед преобразованием дешевле: меньше элементов доходит до второго шага.',
      'Строку удобно собрать шаблонным литералом.'
    ],
    tests: [
      {
        name: 'собирает строки по упавшим',
        code: `expect(failedReport([
  { name: 'login', status: 'passed', durationMs: 10 },
  { name: 'order', status: 'failed', durationMs: 120 }
])).toEqual(['order (120 мс)']);`
      },
      {
        name: 'если упавших нет, возвращает пустой массив',
        code: `expect(failedReport([
  { name: 'login', status: 'passed', durationMs: 10 }
])).toEqual([]);`
      },
      {
        name: 'сохраняет исходный порядок',
        code: `expect(failedReport([
  { name: 'z', status: 'failed', durationMs: 1 },
  { name: 'a', status: 'failed', durationMs: 2 }
])).toEqual(['z (1 мс)', 'a (2 мс)']);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = [{ name: 'order', status: 'failed', durationMs: 5 }];
failedReport(source);
expect(source).toEqual([{ name: 'order', status: 'failed', durationMs: 5 }]);`
      }
    ],
    solution: `function failedReport(results) {
  return results
    .filter((result) => result.status === 'failed')
    .map((result) => \`\${result.name} (\${result.durationMs} мс)\`);
}`
  },

  {
    id: 'js-54-slowest-three-names',
    title: 'Три самых медленных теста',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите функцию `slowestThree(results)`, которая принимает массив ' +
      '`{ name, durationMs }` и возвращает массив имён трёх самых медленных ' +
      'тестов по убыванию длительности. Если тестов меньше трёх, вернуть все. ' +
      'Исходный массив изменяться не должен.',
    starter: `function slowestThree(results) {
  // Помните: sort() изменяет исходный массив.
}`,
    hints: [
      'sort() сортирует на месте — сначала нужна копия.',
      'Компаратор возвращает число: для убывания вычитайте наоборот.',
      'Ограничить количество поможет slice().'
    ],
    tests: [
      {
        name: 'возвращает три самых медленных по убыванию',
        code: `expect(slowestThree([
  { name: 'a', durationMs: 10 },
  { name: 'b', durationMs: 300 },
  { name: 'c', durationMs: 50 },
  { name: 'd', durationMs: 200 }
])).toEqual(['b', 'd', 'c']);`
      },
      {
        name: 'если тестов меньше трёх, возвращает все',
        code: `expect(slowestThree([
  { name: 'a', durationMs: 10 },
  { name: 'b', durationMs: 30 }
])).toEqual(['b', 'a']);`
      },
      {
        name: 'для пустого массива возвращает пустой массив',
        code: `expect(slowestThree([])).toEqual([]);`
      },
      {
        name: 'не изменяет исходный массив',
        code: `const source = [
  { name: 'a', durationMs: 10 },
  { name: 'b', durationMs: 300 }
];
slowestThree(source);
expect(source[0].name).toBe('a');`
      }
    ],
    solution: `function slowestThree(results) {
  return [...results]
    .sort((first, second) => second.durationMs - first.durationMs)
    .slice(0, 3)
    .map((result) => result.name);
}`
  }
]
