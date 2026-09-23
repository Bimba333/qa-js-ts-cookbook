export default [
  {
    id: 'js-96-runtime-check-still-needed',
    title: 'Проверка данных нужна в любом случае',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Типы проверяют код до запуска, а данные приходят во время выполнения. ' +
      'Напишите `parseWorkItem(payload)` — разбор ответа: возвращает ' +
      '`{ ok: true, value: { id, title, version } }` при корректной форме и ' +
      '`{ ok: false, problems }` иначе, где `problems` — список описаний в ' +
      'порядке проверки полей: `id должен быть непустой строкой`, ' +
      '`title должен быть непустой строкой`, ' +
      '`version должен быть целым неотрицательным числом`. ' +
      'Не объект и `null` дают единственную проблему `ответ не является объектом`.',
    starter: `function parseWorkItem(payload) {
  // Разбор не должен падать: он должен объяснить, что не так.

  return { ok: false, problems: [] };
}`,
    hints: [
      'Разбор возвращает результат, а не выбрасывает исключение.',
      'Строка из пробелов пустой не считается только после обрезки.',
      'Проверять надо все поля, а не останавливаться на первом.'
    ],
    tests: [
      {
        name: 'корректный ответ разбирается',
        code: `expect(parseWorkItem({ id: 'WI-1', title: 'вход', version: 2 }))
  .toEqual({ ok: true, value: { id: 'WI-1', title: 'вход', version: 2 } });`
      },
      {
        name: 'перечисляются все проблемы сразу',
        code: `expect(parseWorkItem({ id: '', title: '  ', version: -1 }).problems).toEqual([
  'id должен быть непустой строкой',
  'title должен быть непустой строкой',
  'version должен быть целым неотрицательным числом'
]);`
      },
      {
        name: 'дробная версия отвергается',
        code: `expect(parseWorkItem({ id: 'a', title: 'b', version: 1.5 }).problems)
  .toEqual(['version должен быть целым неотрицательным числом']);`
      },
      {
        name: 'нулевая версия допустима',
        code: `expect(parseWorkItem({ id: 'a', title: 'b', version: 0 }).ok).toBe(true);`
      },
      {
        name: 'не объект отвергается одной проблемой',
        code: `expect(parseWorkItem(null).problems).toEqual(['ответ не является объектом']);
expect(parseWorkItem('строка').problems).toEqual(['ответ не является объектом']);
expect(parseWorkItem([]).problems).toEqual(['ответ не является объектом']);`
      },
      {
        name: 'лишние поля в результат не попадают',
        code: `const parsed = parseWorkItem({ id: 'a', title: 'b', version: 1, extra: true });
expect(Object.keys(parsed.value).sort()).toEqual(['id', 'title', 'version']);`
      },
      {
        name: 'разбор не выбрасывает исключений',
        code: `let threw = false;
try { parseWorkItem(undefined); } catch { threw = true; }
expect(threw).toBe(false);`
      }
    ],
    solution: `function parseWorkItem(payload) {
  if (typeof payload !== 'object' || payload === null || Array.isArray(payload)) {
    return { ok: false, problems: ['ответ не является объектом'] };
  }

  const problems = [];

  const isFilledString = value =>
    typeof value === 'string' && value.trim() !== '';

  if (!isFilledString(payload.id)) {
    problems.push('id должен быть непустой строкой');
  }

  if (!isFilledString(payload.title)) {
    problems.push('title должен быть непустой строкой');
  }

  if (!Number.isInteger(payload.version) || payload.version < 0) {
    problems.push('version должен быть целым неотрицательным числом');
  }

  if (problems.length > 0) {
    return { ok: false, problems };
  }

  return {
    ok: true,
    value: { id: payload.id, title: payload.title, version: payload.version }
  };
}`
  }
]
