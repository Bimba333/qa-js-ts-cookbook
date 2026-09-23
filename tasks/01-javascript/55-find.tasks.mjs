export default [
  {
    id: 'js-55-find-by-id',
    title: 'Найти тест по идентификатору',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `findById(results, id)`, которая возвращает первый элемент ' +
      'массива `{ id, name }` с указанным `id`. Если элемент не найден, функция ' +
      'должна выбросить ошибку с сообщением `Тест <id> не найден`.',
    starter: `function findById(results, id) {
  // find() вернёт undefined, если ничего не подошло.
}`,
    hints: [
      'Метод поиска первого подходящего элемента возвращает undefined при неудаче.',
      'Результат нужно проверить до того, как обращаться к его свойствам.',
      'Сообщение собирается шаблонным литералом.'
    ],
    tests: [
      {
        name: 'находит элемент по id',
        code: `expect(findById([{ id: 1, name: 'login' }, { id: 2, name: 'order' }], 2))
  .toEqual({ id: 2, name: 'order' });`
      },
      {
        name: 'возвращает первый подходящий',
        code: `expect(findById([{ id: 1, name: 'first' }, { id: 1, name: 'second' }], 1).name)
  .toBe('first');`
      },
      {
        name: 'бросает понятную ошибку, если не найдено',
        code: `let message = '';
try { findById([{ id: 1, name: 'login' }], 99); }
catch (error) { message = error.message; }
expect(message).toBe('Тест 99 не найден');`
      },
      {
        name: 'бросает ошибку на пустом массиве',
        code: `let thrown = false;
try { findById([], 1); } catch (error) { thrown = true; }
expect(thrown).toBe(true);`
      }
    ],
    solution: `function findById(results, id) {
  const found = results.find((result) => result.id === id);

  if (!found) {
    throw new Error(\`Тест \${id} не найден\`);
  }

  return found;
}`
  },

  {
    id: 'js-55-first-failed-index',
    title: 'Позиция первого падения',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `firstFailedPosition(results)`, которая возвращает ' +
      'человекочитаемый номер первого упавшего теста в массиве `{ name, status }`. ' +
      'Нумерация начинается с единицы. Если упавших нет, вернуть `0`.',
    starter: `function firstFailedPosition(results) {
  // Нужен индекс, а не сам элемент.
}`,
    hints: [
      'Для позиции есть парный метод поиска, возвращающий индекс.',
      'При неудаче он возвращает -1 — это значение нужно обработать.',
      'Индекс начинается с нуля, а нумерация — с единицы.'
    ],
    tests: [
      {
        name: 'возвращает номер первого упавшего',
        code: `expect(firstFailedPosition([
  { name: 'login', status: 'passed' },
  { name: 'order', status: 'failed' }
])).toBe(2);`
      },
      {
        name: 'если упавших нет, возвращает 0',
        code: `expect(firstFailedPosition([{ name: 'login', status: 'passed' }])).toBe(0);`
      },
      {
        name: 'для пустого массива возвращает 0',
        code: `expect(firstFailedPosition([])).toBe(0);`
      },
      {
        name: 'первый элемент даёт номер 1',
        code: `expect(firstFailedPosition([{ name: 'a', status: 'failed' }])).toBe(1);`
      }
    ],
    solution: `function firstFailedPosition(results) {
  const index = results.findIndex((result) => result.status === 'failed');

  return index === -1 ? 0 : index + 1;
}`
  }
]
