export default [
  {
    id: 'js-92-pure-update',
    title: 'Обновление без изменения аргумента',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `withStatus(items, id, status)`, которая возвращает ' +
      '**новый** массив, где у записи с нужным `id` изменён `status`. Исходный ' +
      'массив и его объекты меняться не должны. Если записи с таким `id` нет, ' +
      'верните массив с тем же содержимым, но всё равно новый. Порядок ' +
      'сохраняется.',
    starter: `function withStatus(items, id, status) {
  // Ни сам массив, ни его объекты изменять нельзя.
}`,
    hints: [
      'Новый массив с заменой одного элемента даёт `map`: остальные элементы возвращаются как есть.',
      'Изменённой записи нужна копия: раскрытие объекта плюс новое значение поля.',
      'Возвращать исходный массив нельзя даже когда ничего не менялось — вызывающий код ожидает новый.'
    ],
    tests: [
      {
        name: 'статус меняется у нужной записи',
        code: `const source = [{ id: 1, status: 'NEW' }, { id: 2, status: 'NEW' }];
expect(withStatus(source, 2, 'DONE')).toEqual([
  { id: 1, status: 'NEW' },
  { id: 2, status: 'DONE' }
]);`
      },
      {
        name: 'исходный массив не изменился',
        code: `const origin = [{ id: 1, status: 'NEW' }];
withStatus(origin, 1, 'DONE');
expect(origin[0].status).toBe('NEW');`
      },
      {
        name: 'возвращается новый массив',
        code: `const same = [{ id: 1, status: 'NEW' }];
expect(withStatus(same, 1, 'DONE') === same).toBe(false);`
      },
      {
        name: 'незатронутые записи можно не копировать',
        code: `const untouched = [{ id: 1, status: 'NEW' }, { id: 2, status: 'NEW' }];
const next = withStatus(untouched, 2, 'DONE');
expect(next[0]).toEqual({ id: 1, status: 'NEW' });
expect(next[1] === untouched[1]).toBe(false);`
      },
      {
        name: 'неизвестный `id` не меняет содержимое, но даёт новый массив',
        code: `const missing = [{ id: 1, status: 'NEW' }];
const copy = withStatus(missing, 99, 'DONE');
expect(copy).toEqual([{ id: 1, status: 'NEW' }]);
expect(copy === missing).toBe(false);`
      },
      {
        name: 'пустой массив обрабатывается',
        code: `expect(withStatus([], 1, 'DONE')).toEqual([]);`
      }
    ],
    solution: `function withStatus(items, id, status) {
  return items.map(item => (item.id === id ? { ...item, status } : item));
}`
  }
]
