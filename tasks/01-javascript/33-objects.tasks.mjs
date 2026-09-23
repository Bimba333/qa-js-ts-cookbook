export default [
  {
    id: 'js-33-read-optional-field',
    title: 'Чтение поля, которого может не быть',
    difficulty: 'easy',
    lang: 'js',
    prompt:
      'Напишите функцию `readRole(user)`, которая возвращает значение поля `role`. ' +
      'Если поля нет, вернуть строку `guest`. Отличайте отсутствие поля от значения ' +
      '`null`: для `null` тоже нужно вернуть `guest`, а для пустой строки — вернуть ' +
      'пустую строку.',
    starter: `function readRole(user) {
  // Отсутствующее поле даёт undefined.
}`,
    hints: [
      'Обращение к несуществующему свойству возвращает undefined, а не ошибку.',
      'Подменять нужно только undefined и null.',
      'Пустая строка — валидное значение, её заменять нельзя.'
    ],
    tests: [
      {
        name: 'возвращает существующее значение',
        code: `expect(readRole({ role: 'admin' })).toBe('admin');`
      },
      {
        name: 'подставляет guest при отсутствии поля',
        code: `expect(readRole({})).toBe('guest');`
      },
      {
        name: 'подставляет guest при null',
        code: `expect(readRole({ role: null })).toBe('guest');`
      },
      {
        name: 'пустую строку сохраняет',
        code: `expect(readRole({ role: '' })).toBe('');`
      }
    ],
    solution: `function readRole(user) {
  return user.role ?? 'guest';
}`
  },

  {
    id: 'js-33-update-without-mutation',
    title: 'Обновить поле, не меняя исходный объект',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `withStatus(item, status)`, которая возвращает **новый** ' +
      'объект со всеми полями исходного и заменённым полем `status`. Исходный объект ' +
      'изменяться не должен.',
    starter: `function withStatus(item, status) {
  // Верните копию с изменённым полем.
}`,
    hints: [
      'Присваивание свойства изменит исходный объект.',
      'Копию с дополнением удобно собрать через spread.',
      'Порядок важен: новое значение должно перекрыть старое.'
    ],
    tests: [
      {
        name: 'заменяет поле',
        code: `expect(withStatus({ id: 1, status: 'new' }, 'done'))
  .toEqual({ id: 1, status: 'done' });`
      },
      {
        name: 'не изменяет исходный объект',
        code: `const source = { id: 1, status: 'new' };
withStatus(source, 'done');
expect(source.status).toBe('new');`
      },
      {
        name: 'возвращает новый объект',
        code: `const source = { id: 1, status: 'new' };
expect(withStatus(source, 'done') === source).toBe(false);`
      },
      {
        name: 'добавляет поле, если его не было',
        code: `expect(withStatus({ id: 1 }, 'done')).toEqual({ id: 1, status: 'done' });`
      }
    ],
    solution: `function withStatus(item, status) {
  return { ...item, status };
}`
  }
]
