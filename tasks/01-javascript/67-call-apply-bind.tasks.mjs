export default [
  {
    id: 'js-67-own-bind',
    title: 'Свой `bind()`',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Напишите функцию `myBind(fn, receiver, ...bound)`, которая повторяет ' +
      'поведение `bind()`: возвращает новую функцию с закреплённым получателем ' +
      'и заранее переданными аргументами. Аргументы вызова добавляются после ' +
      'закреплённых. Повторная привязка результата получателя менять не должна: ' +
      'первая привязка окончательна. Использовать встроенный `bind()` нельзя.',
    starter: `function myBind(fn, receiver, ...bound) {
  // Верните функцию, которая вызывает fn с нужным получателем.
}`,
    hints: [
      'Явно задать получателя при вызове позволяют `call()` и `apply()`.',
      'Закреплённые аргументы идут первыми, аргументы вызова — следом; собрать их вместе помогает раскрытие.',
      'Необратимость получается сама собой: возвращённая функция не смотрит на собственный `this` и всегда передаёт закреплённого получателя.'
    ],
    tests: [
      {
        name: 'получатель закрепляется',
        code: `function describe() { return this.role; }
const asAdmin = myBind(describe, { role: 'admin' });
expect(asAdmin()).toBe('admin');`
      },
      {
        name: 'закреплённые аргументы идут первыми',
        code: `function join(separator, value) { return separator + value; }
const withSlash = myBind(join, null, ' / ');
expect(withSlash('итог')).toBe(' / итог');`
      },
      {
        name: 'аргументы вызова добавляются после закреплённых',
        code: `function collect(...args) { return args; }
const prefixed = myBind(collect, null, 1, 2);
expect(prefixed(3, 4)).toEqual([1, 2, 3, 4]);`
      },
      {
        name: 'повторная привязка не меняет получателя',
        code: `function role() { return this.role; }
const once = myBind(role, { role: 'qa' });
const twice = myBind(once, { role: 'admin' });
expect(twice()).toBe('qa');`
      },
      {
        name: 'оторванный метод получает свой объект',
        code: `const client = {
  baseUrl: 'http://stand',
  describe() { return this.baseUrl; }
};
const detached = client.describe;
expect(myBind(detached, client)()).toBe('http://stand');`
      },
      {
        name: 'встроенный `bind` не используется',
        code: `expect(/\\.bind\\s*\\(/.test(String(myBind))).toBe(false);`
      }
    ],
    solution: `function myBind(fn, receiver, ...bound) {
  return function bound2(...args) {
    return fn.apply(receiver, [...bound, ...args]);
  };
}`
  }
]
