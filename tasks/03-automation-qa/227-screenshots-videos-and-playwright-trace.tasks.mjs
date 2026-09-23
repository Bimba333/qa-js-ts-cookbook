export default [
  {
    id: 'qa-227-screenshot-is-evidence',
    title: 'Снимок как доказательство состояния',
    difficulty: 'medium',
    lang: 'playwright',
    prompt:
      'Снимок экрана — часть доказательств, а не украшение отчёта. Войдите как ' +
      '`educational_tester` с паролем `educational-tester-password`, откройте ' +
      '`/work-items` и сделайте два снимка: всей страницы и **только** формы ' +
      'фильтра. Верните `{ pageBytes, elementBytes, pageFormat, elementVisible }`: ' +
      'размеры снимков в байтах, формат первого (первые байты PNG начинаются с ' +
      '`\\x89PNG`) и признак видимости формы. Файлы на диск сохранять не нужно — ' +
      'снимок возвращается буфером.',
    starter: `export default async function solve({ page }) {
  // Снимок элемента снимает только его область.

  return { pageBytes: 0, elementBytes: 0, pageFormat: '', elementVisible: false };
}`,
    hints: [
      'Снимок доступен и у страницы, и у локатора.',
      'Размер буфера даёт свойство length.',
      'Первые байты PNG можно прочитать как строку.'
    ],
    tests: [
      {
        name: 'снимок страницы получен',
        code: `expect(result.pageBytes > 1000).toBe(true);`
      },
      {
        name: 'снимок элемента меньше снимка страницы',
        code: `expect(result.elementBytes > 0).toBe(true);
expect(result.elementBytes < result.pageBytes).toBe(true);`
      },
      {
        name: 'формат снимка — PNG',
        code: `expect(result.pageFormat).toBe('PNG');`
      },
      {
        name: 'снимался видимый элемент',
        code: `expect(result.elementVisible).toBe(true);`
      },
      {
        name: 'страница осталась на списке задач',
        code: `expect(page.url()).toContain('/work-items');`
      }
    ],
    solution: `export default async function solve({ page }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/work-items');

  const pageShot = await page.screenshot();

  const filter = page.getByRole('form', { name: 'Фильтр задач' });
  const elementVisible = await filter.isVisible();
  const elementShot = await filter.screenshot();

  return {
    pageBytes: pageShot.length,
    elementBytes: elementShot.length,
    pageFormat: pageShot.subarray(1, 4).toString('utf8'),
    elementVisible
  };
}`
  }
]
