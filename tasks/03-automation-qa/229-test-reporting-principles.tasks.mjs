export default [
  {
    id: 'qa-229-stable-identity',
    title: 'Устойчивая идентичность теста',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Отчёт может сравнивать запуски только у тестов с устойчивой ' +
      'идентичностью. Напишите `buildTestId(test)` из полей `{ file, suite, ' +
      'title, project }`: результат — `<project>::<file>::<suite> > <title>`. ' +
      'Требования: путь файла приводится к разделителю `/`; лишние пробелы в ' +
      '`suite` и `title` схлопываются в один; `suite` может отсутствовать — тогда ' +
      'идентификатор заканчивается на `::<title>`; отсутствие `file` или `title` — ' +
      'ошибка `идентичность не определена`. Динамические части (даты, номера) ' +
      'в идентификатор не добавляются.',
    starter: `function buildTestId(test) {
  // Идентификатор должен совпадать между запусками.

  return '';
}`,
    hints: [
      'Разделитель пути в Windows и Linux разный — приводите к одному виду.',
      'Двойные пробелы в заголовке делают идентификатор непредсказуемым.',
      'Отсутствующая группа не должна оставлять пустой фрагмент.'
    ],
    tests: [
      {
        name: 'полный идентификатор',
        code: `expect(buildTestId({
  project: 'chromium',
  file: 'tests/login.spec.ts',
  suite: 'Вход',
  title: 'открывает форму'
})).toBe('chromium::tests/login.spec.ts::Вход > открывает форму');`
      },
      {
        name: 'путь приводится к одному разделителю',
        code: `expect(buildTestId({
  project: 'chromium',
  file: 'tests\\\\login.spec.ts',
  title: 'шаг'
})).toBe('chromium::tests/login.spec.ts::шаг');`
      },
      {
        name: 'без группы идентификатор короче',
        code: `expect(buildTestId({
  project: 'chromium',
  file: 'a.spec.ts',
  title: 'шаг'
})).toBe('chromium::a.spec.ts::шаг');`
      },
      {
        name: 'лишние пробелы схлопываются',
        code: `expect(buildTestId({
  project: 'chromium',
  file: 'a.spec.ts',
  suite: '  Вход   в  систему ',
  title: ' открывает  форму '
})).toBe('chromium::a.spec.ts::Вход в систему > открывает форму');`
      },
      {
        name: 'идентификатор повторяется между вызовами',
        code: `const test = { project: 'chromium', file: 'a.spec.ts', title: 'шаг' };
expect(buildTestId(test)).toBe(buildTestId(test));`
      },
      {
        name: 'без заголовка идентичности нет',
        code: `let message = '';
try { buildTestId({ project: 'chromium', file: 'a.spec.ts' }); }
catch (error) { message = error.message; }
expect(message).toBe('идентичность не определена');`
      },
      {
        name: 'без файла идентичности нет',
        code: `let fileMessage = '';
try { buildTestId({ project: 'chromium', title: 'шаг' }); }
catch (error) { fileMessage = error.message; }
expect(fileMessage).toBe('идентичность не определена');`
      }
    ],
    solution: `function buildTestId(test) {
  const { file, suite, title, project } = test;

  const collapse = value => String(value).replace(/\\s+/g, ' ').trim();

  if (typeof file !== 'string' || file.trim() === '') {
    throw new Error('идентичность не определена');
  }

  if (typeof title !== 'string' || title.trim() === '') {
    throw new Error('идентичность не определена');
  }

  const normalizedFile = file.replace(/\\\\/g, '/');
  const cleanTitle = collapse(title);
  const cleanSuite = suite === undefined ? '' : collapse(suite);

  const tail = cleanSuite === '' ? cleanTitle : cleanSuite + ' > ' + cleanTitle;

  return project + '::' + normalizedFile + '::' + tail;
}`
  }
]
