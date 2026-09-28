export default [
  {
    id: 'qa-163-split-test-and-infrastructure',
    title: 'Где проходит граница теста и инфраструктуры',
    difficulty: 'medium',
    lang: 'js',
    prompt:
      'Напишите функцию `reviewFile(lines)`, которая по строкам одного файла ' +
      'возвращает `{ kind, problems }`. `kind` — `тест`, если в файле есть ' +
      'строка, начинающаяся с `test(` или `expect(`, иначе `инфраструктура`. ' +
      '`problems` — отсортированный список замечаний: `проверка в инфраструктуре` ' +
      'для `expect(` вне теста, `селектор в тесте` для строки с `page.locator(` ' +
      'внутри теста, `секрет в коде` для строки, содержащей `password:` или ' +
      '`token:` с литералом в кавычках. Замечания не повторяются.',
    starter: `function reviewFile(lines) {
  // Вид файла определяется до того, как разбираются замечания.

  return { kind: 'инфраструктура', problems: [] };
}`,
    hints: [
      'Вид файла нужно определить первым проходом: от него зависит смысл остальных признаков.',
      'Строки перед проверкой стоит очистить от ведущих пробелов.',
      'Повторяющиеся замечания убирает множество.'
    ],
    tests: [
      {
        name: 'файл с тестом опознаётся',
        code: `expect(reviewFile(["test('вход', async () => {});"]).kind).toBe('тест');`
      },
      {
        name: 'файл без теста — инфраструктура',
        code: `expect(reviewFile(['export function buildClient() {}']).kind).toBe('инфраструктура');`
      },
      {
        name: 'проверка вне теста — замечание',
        code: `expect(reviewFile(['expect(value).toBe(1);'])).toEqual({
  kind: 'тест', problems: []
});
expect(reviewFile(['export function check() {', '  expect(value).toBe(1);', '}']))
  .toEqual({ kind: 'тест', problems: [] });`
      },
      {
        name: 'селектор внутри теста — замечание',
        code: `expect(reviewFile([
  "test('вход', async () => {",
  "  await page.locator('#login').click();",
  '});'
]).problems).toEqual(['селектор в тесте']);`
      },
      {
        name: 'секрет в коде находится',
        code: `expect(reviewFile(["const user = { password: 'qa-123' };"]).problems)
  .toEqual(['секрет в коде']);`
      },
      {
        name: 'замечания не повторяются и сортируются',
        code: `expect(reviewFile([
  "test('вход', async () => {",
  "  await page.locator('#a').click();",
  "  await page.locator('#b').click();",
  "  const token: 'abc';",
  '});'
]).problems).toEqual(['секрет в коде', 'селектор в тесте']);`
      },
      {
        name: 'чистый тест без замечаний',
        code: `expect(reviewFile([
  "test('вход', async () => {",
  '  await loginPage.open();',
  '  expect(await loginPage.title()).toBe("Вход");',
  '});'
]).problems).toEqual([]);`
      }
    ],
    solution: `function reviewFile(lines) {
  const trimmed = lines.map(line => line.trim());
  const isTest = trimmed.some(line => line.startsWith('test(') || line.startsWith('expect('));
  const problems = new Set();

  for (const line of trimmed) {
    if (!isTest && line.startsWith('expect(')) problems.add('проверка в инфраструктуре');
    if (isTest && line.includes('page.locator(')) problems.add('селектор в тесте');
    if (/(password|token)\\s*:\\s*['"]/.test(line)) problems.add('секрет в коде');
  }

  return { kind: isTest ? 'тест' : 'инфраструктура', problems: [...problems].sort() };
}`
  }
]
