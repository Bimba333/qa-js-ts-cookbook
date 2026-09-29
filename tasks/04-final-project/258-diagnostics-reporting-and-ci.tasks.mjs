export default [
  {
    id: 'fp-258-redact-by-field-name',
    title: 'Маскирование по имени поля',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Секрет маскируют **до** записи в журнал и по имени поля, а не по ' +
      'содержимому. Напишите `redact(value)`: он возвращает копию структуры, в ' +
      'которой значения полей с именами `token`, `authorization`, `password` и ' +
      '`cookie` (без учёта регистра) заменены на строку `***`. Обход идёт на ' +
      'любую глубину, массивы сохраняют порядок, остальные значения не ' +
      'меняются. Исходный объект изменяться не должен.',
    starter: `function redact(value) {
  // Маскировать нужно по имени поля, на любой глубине.

  return value;
}`,
    hints: [
      'Имена сравниваются в нижнем регистре.',
      'Для массивов нужен массив, для объектов — объект.',
      'Копия создаётся на каждом уровне, иначе исходные данные изменятся.'
    ],
    tests: [
      {
        name: 'секретное поле маскируется',
        code: `const flat = redact({ token: 'abc', title: 'Отчёт' });
expect(flat).toEqual({ token: '***', title: 'Отчёт' });`
      },
      {
        name: 'регистр имени не важен, глубина не мешает',
        code: `const nested = redact({
  request: { headers: { Authorization: 'Bearer abc', accept: 'json' } }
});
expect(nested.request.headers.Authorization).toBe('***');
expect(nested.request.headers.accept).toBe('json');`
      },
      {
        name: 'массивы сохраняют порядок и тип',
        code: `const withArray = redact({ items: [{ password: 'p' }, { title: 'ок' }] });
expect(Array.isArray(withArray.items)).toBe(true);
expect(withArray.items[0].password).toBe('***');
expect(withArray.items[1].title).toBe('ок');`
      },
      {
        name: 'исходный объект не изменяется',
        code: `const original = { cookie: 'session=1' };
redact(original);
expect(original.cookie).toBe('session=1');`
      },
      {
        name: 'значения других типов проходят без изменений',
        code: `expect(redact(42)).toBe(42);
expect(redact(null)).toBeNull();
expect(redact('строка')).toBe('строка');`
      }
    ],
    solution: `const SECRET_FIELDS = ['token', 'authorization', 'password', 'cookie'];

function redact(value) {
  if (Array.isArray(value)) {
    return value.map(item => redact(item));
  }

  if (typeof value !== 'object' || value === null) {
    return value;
  }

  const copy = {};

  for (const [key, item] of Object.entries(value)) {
    copy[key] = SECRET_FIELDS.includes(key.toLowerCase()) ? '***' : redact(item);
  }

  return copy;
}`
  },
  {
    id: 'fp-258-evidence-has-limits',
    title: 'Доказательство с пределами',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Вложение должно записываться всегда — даже если данные содержат цикл или ' +
      'слишком велики. Напишите `serializeEvidence(value, limit)`: верните ' +
      'строку JSON, где повторно встреченная ссылка заменена на `"[cycle]"`. ' +
      'Если результат длиннее `limit` символов, обрежьте его до `limit` и ' +
      'допишите в конец `…[обрезано]`. Функция не бросает исключений.',
    starter: `function serializeEvidence(value, limit) {
  // Цикл и размер не должны мешать записать вложение.

  return JSON.stringify(value);
}`,
    hints: [
      'У JSON.stringify есть второй аргумент — функция-заменитель.',
      'Уже встреченные объекты удобно помнить в Set.',
      'Обрезка выполняется после сериализации, по длине строки.'
    ],
    tests: [
      {
        name: 'обычная структура сериализуется как есть',
        code: `expect(serializeEvidence({ id: 'T-1' }, 1000)).toBe('{"id":"T-1"}');`
      },
      {
        name: 'цикл не роняет запись',
        code: `const cyclic = { name: 'узел' };
cyclic.self = cyclic;
const cyclicText = serializeEvidence(cyclic, 1000);
expect(cyclicText).toContain('[cycle]');
expect(cyclicText).toContain('узел');`
      },
      {
        name: 'длинное значение обрезается с пометкой',
        code: `const long = { text: 'a'.repeat(200) };
const longText = serializeEvidence(long, 50);
expect(longText).toContain('…[обрезано]');
expect(longText.length).toBeLessThan(80);`
      },
      {
        name: 'короткое значение не помечается обрезанным',
        code: `const shortText = serializeEvidence({ ok: true }, 100);
expect(shortText).toBe('{"ok":true}');`
      },
      {
        name: 'повторная ссылка на один объект тоже помечается',
        code: `const shared = { id: 'общий' };
const repeatedText = serializeEvidence({ first: shared, second: shared }, 1000);
expect(repeatedText).toContain('[cycle]');`
      }
    ],
    solution: `function serializeEvidence(value, limit) {
  const seen = new Set();

  const text = JSON.stringify(value, (key, item) => {
    if (typeof item === 'object' && item !== null) {
      if (seen.has(item)) return '[cycle]';

      seen.add(item);
    }

    return item;
  });

  if (typeof text !== 'string') return '';

  return text.length > limit ? text.slice(0, limit) + '…[обрезано]' : text;
}`
  }
];
