export default [
  {
    id: 'qa-224-normalize-work-item',
    title: 'Приведение записи к канонической модели',
    difficulty: 'hard',
    lang: 'js',
    prompt:
      'Слои отдают одну запись по-разному. Напишите `normalize(raw)`, которая ' +
      'приводит её к виду `{ id, title, version, description, createdAt }`: ' +
      '`id` и `title` — строки без внешних пробелов; `version` — число, ' +
      'полученное из строки или числа, нечисловое значение — ошибка ' +
      '`version не число`; `description` — `null`, если поле отсутствует, равно ' +
      '`null` или пустой строке после обрезки; `createdAt` — время в UTC в виде ' +
      'строки ISO, неразбираемое значение — ошибка `createdAt не дата`. ' +
      'Отсутствие `id` или `title` — ошибка `отсутствует обязательное поле`.',
    starter: `function normalize(raw) {
  // Отсутствие, null и пустая строка — три разных входа с одним результатом.

  return { id: '', title: '', version: 0, description: null, createdAt: '' };
}`,
    hints: [
      'Number.isFinite отсекает и NaN, и бесконечность, в отличие от isFinite.',
      'Date разбирает строку молча: проверять надо getTime.',
      'Обрезка пробелов выполняется до проверки на пустоту.'
    ],
    tests: [
      {
        name: 'строковые числа и даты приводятся',
        code: `expect(normalize({
  id: ' WI-1 ',
  title: ' Вход ',
  version: '2',
  description: ' описание ',
  createdAt: '2026-01-01T00:00:00.000Z'
})).toEqual({
  id: 'WI-1',
  title: 'Вход',
  version: 2,
  description: 'описание',
  createdAt: '2026-01-01T00:00:00.000Z'
});`
      },
      {
        name: 'три вида отсутствия описания дают null',
        code: `const base = { id: 'WI-1', title: 'a', version: 1, createdAt: '2026-01-01T00:00:00.000Z' };
expect(normalize(base).description).toBe(null);
expect(normalize({ ...base, description: null }).description).toBe(null);
expect(normalize({ ...base, description: '   ' }).description).toBe(null);`
      },
      {
        name: 'время приводится к UTC',
        code: `const shifted = normalize({
  id: 'WI-1', title: 'a', version: 1,
  createdAt: '2026-01-01T03:00:00.000+03:00'
});
expect(shifted.createdAt).toBe('2026-01-01T00:00:00.000Z');`
      },
      {
        name: 'нечисловая версия отвергается',
        code: `let versionMessage = '';
try {
  normalize({ id: 'WI-1', title: 'a', version: 'два', createdAt: '2026-01-01T00:00:00.000Z' });
} catch (error) { versionMessage = error.message; }
expect(versionMessage).toBe('version не число');`
      },
      {
        name: 'неразбираемая дата отвергается',
        code: `let dateMessage = '';
try {
  normalize({ id: 'WI-1', title: 'a', version: 1, createdAt: 'вчера' });
} catch (error) { dateMessage = error.message; }
expect(dateMessage).toBe('createdAt не дата');`
      },
      {
        name: 'обязательное поле обязательно',
        code: `let requiredMessage = '';
try {
  normalize({ title: 'a', version: 1, createdAt: '2026-01-01T00:00:00.000Z' });
} catch (error) { requiredMessage = error.message; }
expect(requiredMessage).toBe('отсутствует обязательное поле');`
      },
      {
        name: 'нулевая версия допустима',
        code: `const zero = normalize({
  id: 'WI-1', title: 'a', version: 0, createdAt: '2026-01-01T00:00:00.000Z'
});
expect(zero.version).toBe(0);`
      }
    ],
    solution: `function normalize(raw) {
  const readRequiredText = value => {
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error('отсутствует обязательное поле');
    }

    return value.trim();
  };

  const id = readRequiredText(raw.id);
  const title = readRequiredText(raw.title);

  const version = Number(raw.version);

  if (!Number.isFinite(version)) {
    throw new Error('version не число');
  }

  const rawDescription = typeof raw.description === 'string' ? raw.description.trim() : '';
  const description = rawDescription === '' ? null : rawDescription;

  const createdAt = new Date(raw.createdAt);

  if (Number.isNaN(createdAt.getTime())) {
    throw new Error('createdAt не дата');
  }

  return {
    id,
    title,
    version,
    description,
    createdAt: createdAt.toISOString()
  };
}`
  }
]
