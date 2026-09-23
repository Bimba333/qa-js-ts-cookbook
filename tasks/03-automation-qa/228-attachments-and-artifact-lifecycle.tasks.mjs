export default [
  {
    id: 'qa-228-attachment-path',
    title: 'Имя артефакта должно быть пригодным',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `buildAttachmentPath(directory, testTitle, name, index)` — сборку ' +
      'пути к артефакту. Правила: из заголовка теста и имени артефакта убираются ' +
      'символы, недопустимые в имени файла (`\\ / : * ? " < > |`) и пробелы — они ' +
      'заменяются дефисом; несколько дефисов подряд схлопываются в один; крайние ' +
      'дефисы убираются; всё приводится к нижнему регистру. Результат — ' +
      '`<directory>/<заголовок>-<индекс>-<имя>`. Заголовок обрезается до ' +
      '60 символов **после** нормализации. Пустой заголовок — ошибка ' +
      '`заголовок теста пуст`.',
    starter: `function buildAttachmentPath(directory, testTitle, name, index) {
  // Имя файла попадёт в отчёт и в архив CI: оно должно быть предсказуемым.

  return '';
}`,
    hints: [
      'Замена выполняется по набору символов, а не по одному.',
      'Схлопывание дефисов делается после замены, а не до.',
      'Обрезка длины может оставить дефис на конце.'
    ],
    tests: [
      {
        name: 'обычный заголовок',
        code: `expect(buildAttachmentPath('artifacts', 'Вход в систему', 'screenshot.png', 1))
  .toBe('artifacts/вход-в-систему-1-screenshot.png');`
      },
      {
        name: 'недопустимые символы заменяются',
        code: `expect(buildAttachmentPath('out', 'a/b:c*d?e"f<g>h|i', 'log.txt', 2))
  .toBe('out/a-b-c-d-e-f-g-h-i-2-log.txt');`
      },
      {
        name: 'несколько дефисов схлопываются',
        code: `expect(buildAttachmentPath('out', 'a   b', 'x.png', 0))
  .toBe('out/a-b-0-x.png');`
      },
      {
        name: 'крайние дефисы убираются',
        code: `expect(buildAttachmentPath('out', '  вход  ', 'x.png', 3))
  .toBe('out/вход-3-x.png');`
      },
      {
        name: 'длинный заголовок обрезается до 60 символов',
        code: `const long = 'a'.repeat(100);
const path = buildAttachmentPath('out', long, 'x.png', 1);
expect(path).toBe('out/' + 'a'.repeat(60) + '-1-x.png');`
      },
      {
        name: 'имя артефакта тоже нормализуется',
        code: `expect(buildAttachmentPath('out', 'тест', 'Отчёт CI.html', 1))
  .toBe('out/тест-1-отчёт-ci.html');`
      },
      {
        name: 'пустой заголовок отвергается',
        code: `let message = '';
try { buildAttachmentPath('out', '   ', 'x.png', 1); }
catch (error) { message = error.message; }
expect(message).toBe('заголовок теста пуст');`
      }
    ],
    solution: `function normalize(value) {
  return value
    .toLowerCase()
    .replace(/[\\\\/:*?"<>|\\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildAttachmentPath(directory, testTitle, name, index) {
  const title = normalize(testTitle);

  if (title === '') {
    throw new Error('заголовок теста пуст');
  }

  const shortTitle = title.slice(0, 60).replace(/-$/, '');

  return directory + '/' + shortTitle + '-' + index + '-' + normalize(name);
}`
  }
]
