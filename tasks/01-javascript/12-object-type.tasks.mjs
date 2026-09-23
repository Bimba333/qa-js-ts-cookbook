export default [
  {
    id: 'js-12-object-operations',
    title: 'Четыре операции над свойствами',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `applyOperations(target, operations)` — применяет к объекту ' +
      'список операций вида `{ kind, key, value }`, где `kind` — `"set"`, ' +
      '`"delete"` или `"read"`. Верните ' +
      '`{ reads, keys, missing }`: массив прочитанных значений в порядке ' +
      'операций чтения, итоговые ключи объекта и число операций, обратившихся ' +
      'к отсутствующему ключу (чтение несуществующего или удаление ' +
      'несуществующего). Объект изменяется на месте. Неизвестный `kind` — ' +
      'ошибка `неизвестная операция: <kind>`.',
    starter: `function applyOperations(target, operations) {
  return { reads: [], keys: [], missing: 0 };
}`,
    hints: [
      'Обращение к отсутствующему ключу даёт undefined, а не ошибку.',
      'Наличие ключа проверяется до операции, а не по значению.',
      'delete возвращает true даже для отсутствующего ключа — опираться на это нельзя.'
    ],
    tests: [
      {
        name: 'добавление и чтение',
        code: `const target = {};
const result = applyOperations(target, [
  { kind: 'set', key: 'id', value: 'WI-1' },
  { kind: 'read', key: 'id' }
]);
expect(result.reads).toEqual(['WI-1']);
expect(target.id).toBe('WI-1');`
      },
      {
        name: 'удаление убирает ключ',
        code: `const target = { id: 'WI-1' };
const result = applyOperations(target, [{ kind: 'delete', key: 'id' }]);
expect(result.keys).toEqual([]);
expect('id' in target).toBe(false);`
      },
      {
        name: 'чтение отсутствующего ключа считается',
        code: `const result = applyOperations({}, [{ kind: 'read', key: 'нет' }]);
expect(result.reads).toEqual([undefined]);
expect(result.missing).toBe(1);`
      },
      {
        name: 'удаление отсутствующего ключа считается',
        code: `expect(applyOperations({}, [{ kind: 'delete', key: 'нет' }]).missing).toBe(1);`
      },
      {
        name: 'итоговые ключи в порядке добавления',
        code: `const result = applyOperations({}, [
  { kind: 'set', key: 'b', value: 2 },
  { kind: 'set', key: 'a', value: 1 }
]);
expect(result.keys).toEqual(['b', 'a']);`
      },
      {
        name: 'повторная запись ключ не добавляет',
        code: `const result = applyOperations({ id: 'a' }, [{ kind: 'set', key: 'id', value: 'b' }]);
expect(result.keys).toEqual(['id']);
expect(result.missing).toBe(0);`
      },
      {
        name: 'неизвестная операция отвергается',
        code: `let message = '';
try { applyOperations({}, [{ kind: 'обновить', key: 'id' }]); }
catch (error) { message = error.message; }
expect(message).toBe('неизвестная операция: обновить');`
      }
    ],
    solution: `function applyOperations(target, operations) {
  const reads = [];
  let missing = 0;

  for (const operation of operations) {
    const exists = Object.hasOwn(target, operation.key);

    if (operation.kind === 'set') {
      target[operation.key] = operation.value;
      continue;
    }

    if (operation.kind === 'delete') {
      if (!exists) missing += 1;
      delete target[operation.key];
      continue;
    }

    if (operation.kind === 'read') {
      if (!exists) missing += 1;
      reads.push(target[operation.key]);
      continue;
    }

    throw new Error('неизвестная операция: ' + operation.kind);
  }

  return { reads, keys: Object.keys(target), missing };
}`
  }
]
