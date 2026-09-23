export default [
  {
    id: 'js-23-predicate-set',
    title: 'Набор коротких предикатов',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Объявите три стрелочные функции с неявным возвратом: `isFailed(result)`, ' +
      '`isSlow(result)` — длительность строго больше 1000 — и ' +
      '`isProblem(result)` — упал или медленный. Каждая возвращает логическое ' +
      'значение.',
    starter: `const isFailed = (result) => /* без фигурных скобок */ false;

const isSlow = (result) => false;

const isProblem = (result) => false;`,
    hints: [
      'Без фигурных скобок стрелка возвращает результат выражения.',
      'Сравнение строгое: ровно 1000 медленным не считается.',
      'Третья функция переиспользует первые две.'
    ],
    tests: [
      {
        name: 'определяет падение',
        code: `expect(isFailed({ status: 'failed', durationMs: 10 })).toBe(true);`
      },
      {
        name: 'граница длительности не считается медленной',
        code: `expect(isSlow({ status: 'passed', durationMs: 1000 })).toBe(false);`
      },
      {
        name: 'медленный успешный тест — проблема',
        code: `expect(isProblem({ status: 'passed', durationMs: 5000 })).toBe(true);`
      },
      {
        name: 'быстрый успешный тест проблемой не является',
        code: `expect(isProblem({ status: 'passed', durationMs: 10 })).toBe(false);`
      },
      {
        name: 'предикаты подходят для отбора',
        code: `expect([
  { status: 'failed', durationMs: 1 },
  { status: 'passed', durationMs: 1 }
].filter(isProblem).length).toBe(1);`
      }
    ],
    solution: `const isFailed = (result) => result.status === 'failed';

const isSlow = (result) => result.durationMs > 1000;

const isProblem = (result) => isFailed(result) || isSlow(result);`
  },

  {
    id: 'js-23-return-object-literal',
    title: 'Возврат объекта из стрелки',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Объявите стрелочную функцию `toSummary`, которая из объекта ' +
      '`{ name, status, durationMs }` возвращает `{ title, isOk }`: `title` — имя, ' +
      '`isOk` — признак статуса `passed`. Используйте неявный возврат объекта.',
    starter: `const toSummary = (result) => /* объект в неявном возврате */ ({});`,
    hints: [
      'Объект в неявном возврате оборачивается в круглые скобки.',
      'Без скобок фигурные будут восприняты как тело функции.',
      'Лишние поля в результат попадать не должны.'
    ],
    tests: [
      {
        name: 'успешный результат',
        code: `expect(toSummary({ name: 'login', status: 'passed', durationMs: 10 }))
  .toEqual({ title: 'login', isOk: true });`
      },
      {
        name: 'упавший результат',
        code: `expect(toSummary({ name: 'order', status: 'failed', durationMs: 10 }))
  .toEqual({ title: 'order', isOk: false });`
      },
      {
        name: 'лишние поля не попадают в результат',
        code: `expect(Object.keys(toSummary({ name: 'a', status: 'passed', durationMs: 1 })).sort())
  .toEqual(['isOk', 'title']);`
      },
      {
        name: 'подходит для преобразования массива',
        code: `expect([{ name: 'a', status: 'passed' }].map(toSummary))
  .toEqual([{ title: 'a', isOk: true }]);`
      }
    ],
    solution: `const toSummary = (result) => ({
  title: result.name,
  isOk: result.status === 'passed'
});`
  }
]
