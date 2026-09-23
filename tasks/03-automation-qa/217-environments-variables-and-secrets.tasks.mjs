export default [
  {
    id: 'qa-217-mask-secrets',
    title: 'Секрет не должен попасть в диагностику',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `maskSecrets(text, secrets)` — замену секретов в тексте на `***`. ' +
      'Требования: заменяются все вхождения; пустые строки и `undefined` в списке ' +
      'секретов пропускаются (иначе замена испортит весь текст); более длинные ' +
      'секреты заменяются раньше коротких, чтобы вложенный секрет не оставил ' +
      'хвост; текст без секретов возвращается без изменений.',
    starter: `function maskSecrets(text, secrets) {
  // Пустая строка в списке секретов — ловушка: она «совпадает» везде.

  return text;
}`,
    hints: [
      'Замена по подстроке должна затрагивать все вхождения, а не первое.',
      'Список стоит отсортировать по убыванию длины перед заменой.',
      'Регулярное выражение из секрета опасно: в нём могут быть спецсимволы.'
    ],
    tests: [
      {
        name: 'секрет заменяется',
        code: `expect(maskSecrets('token=abc123 готово', ['abc123'])).toBe('token=*** готово');`
      },
      {
        name: 'все вхождения заменяются',
        code: `expect(maskSecrets('abc abc', ['abc'])).toBe('*** ***');`
      },
      {
        name: 'пустая строка в списке ничего не портит',
        code: `expect(maskSecrets('текст', ['', undefined])).toBe('текст');`
      },
      {
        name: 'длинный секрет заменяется раньше короткого',
        code: `expect(maskSecrets('abc123', ['abc', 'abc123'])).toBe('***');`
      },
      {
        name: 'спецсимволы секрета не ломают замену',
        code: `expect(maskSecrets('ключ a.b+c конец', ['a.b+c'])).toBe('ключ *** конец');`
      },
      {
        name: 'текст без секретов не меняется',
        code: `expect(maskSecrets('обычное сообщение', ['abc'])).toBe('обычное сообщение');`
      },
      {
        name: 'пустой список секретов',
        code: `expect(maskSecrets('обычное сообщение', [])).toBe('обычное сообщение');`
      }
    ],
    solution: `function maskSecrets(text, secrets) {
  const meaningful = secrets
    .filter(secret => typeof secret === 'string' && secret !== '')
    .sort((a, b) => b.length - a.length);

  let result = text;

  for (const secret of meaningful) {
    // split/join заменяет все вхождения и не трактует секрет как шаблон.
    result = result.split(secret).join('***');
  }

  return result;
}`
  }
]
