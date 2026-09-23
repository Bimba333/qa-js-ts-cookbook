export default [
  {
    id: 'qa-230-adapter-translates',
    title: 'Адаптер переводит результат',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите `toAllureResult(test, environment)` — перевод результата прогона ' +
      'в запись отчёта. `test` — `{ id, title, status, durationMs, tags, links, ' +
      'error }`. Верните `{ name, fullName, status, statusDetails, labels, links, ' +
      'duration }`. Правила: `status` переводится как `passed` → `passed`, ' +
      '`failed` → `failed`, `skipped` → `skipped`, а падение подготовки ' +
      '`broken` → `broken`; `statusDetails` — `{ message }` только при наличии ' +
      '`error`, иначе поле отсутствует; `labels` — массив ' +
      '`{ name, value }` из тегов (`name: "tag"`) плюс метки окружения ' +
      '`{ name: "env", value: environment }`; `fullName` — `<id>` без изменений. ' +
      'Неизвестный статус — ошибка `неизвестный статус: <статус>`.',
    starter: `function toAllureResult(test, environment) {
  // Адаптер переводит, а не выполняет тестовую логику.

  return {};
}`,
    hints: [
      'Отсутствующее поле и поле со значением undefined различаются через Object.keys.',
      'Метки окружения добавляются после меток из тегов.',
      'Неизвестный статус лучше не переводить молча.'
    ],
    tests: [
      {
        name: 'успешный тест переводится',
        code: `expect(toAllureResult({
  id: 'tests/login.spec.ts::вход', title: 'вход', status: 'passed',
  durationMs: 120, tags: [], links: []
}, 'ci')).toEqual({
  name: 'вход',
  fullName: 'tests/login.spec.ts::вход',
  status: 'passed',
  labels: [{ name: 'env', value: 'ci' }],
  links: [],
  duration: 120
});`
      },
      {
        name: 'теги становятся метками',
        code: `const labels = toAllureResult({
  id: 'a', title: 'b', status: 'passed', durationMs: 1,
  tags: ['smoke', 'api'], links: []
}, 'local').labels;
expect(labels).toEqual([
  { name: 'tag', value: 'smoke' },
  { name: 'tag', value: 'api' },
  { name: 'env', value: 'local' }
]);`
      },
      {
        name: 'ошибка попадает в подробности статуса',
        code: `const broken = toAllureResult({
  id: 'a', title: 'b', status: 'failed', durationMs: 5,
  tags: [], links: [], error: { message: 'ожидалось 1' }
}, 'ci');
expect(broken.statusDetails).toEqual({ message: 'ожидалось 1' });`
      },
      {
        name: 'без ошибки поля подробностей нет',
        code: `const clean = toAllureResult({
  id: 'a', title: 'b', status: 'passed', durationMs: 5, tags: [], links: []
}, 'ci');
expect(Object.keys(clean).includes('statusDetails')).toBe(false);`
      },
      {
        name: 'ссылки переносятся как есть',
        code: `const linked = toAllureResult({
  id: 'a', title: 'b', status: 'passed', durationMs: 1,
  tags: [], links: [{ name: 'задача', url: 'http://tracker/1' }]
}, 'ci');
expect(linked.links).toEqual([{ name: 'задача', url: 'http://tracker/1' }]);`
      },
      {
        name: 'падение подготовки переводится как broken',
        code: `expect(toAllureResult({
  id: 'a', title: 'b', status: 'broken', durationMs: 1, tags: [], links: []
}, 'ci').status).toBe('broken');`
      },
      {
        name: 'неизвестный статус отвергается',
        code: `let message = '';
try {
  toAllureResult({ id: 'a', title: 'b', status: 'странный', durationMs: 1, tags: [], links: [] }, 'ci');
} catch (error) { message = error.message; }
expect(message).toBe('неизвестный статус: странный');`
      }
    ],
    solution: `const STATUSES = new Set(['passed', 'failed', 'skipped', 'broken']);

function toAllureResult(test, environment) {
  if (!STATUSES.has(test.status)) {
    throw new Error('неизвестный статус: ' + test.status);
  }

  const labels = test.tags.map(tag => ({ name: 'tag', value: tag }));
  labels.push({ name: 'env', value: environment });

  const result = {
    name: test.title,
    fullName: test.id,
    status: test.status,
    labels,
    links: [...test.links],
    duration: test.durationMs
  };

  if (test.error !== undefined) {
    result.statusDetails = { message: test.error.message };
  }

  return result;
}`
  }
]
