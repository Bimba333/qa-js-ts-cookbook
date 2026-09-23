export default [
  {
    id: 'qa-170-filter-through-form',
    title: 'Фильтр через форму, а не через адрес',
    difficulty: 'medium',
    lang: 'playwright',
    prompt:
      'Войдите как `educational_tester` с паролем `educational-tester-password` и ' +
      'примените фильтр списка задач **действиями пользователя**: выберите в форме ' +
      'статус `DONE` и нажмите кнопку «Применить фильтр». Переходить сразу по ' +
      'адресу с параметрами нельзя. Верните `{ url, statuses, rows }`: адрес после ' +
      'применения фильтра, массив значений столбца «Статус» и число строк таблицы. ' +
      'Записи создавать не нужно.',
    starter: `export default async function solve({ page }) {
  // Форму заполняет пользователь: выбор значения, затем нажатие кнопки.

  return { url: '', statuses: [], rows: 0 };
}`,
    hints: [
      'Выпадающий список заполняется выбором значения, а не вводом текста.',
      'Отправка формы — это нажатие кнопки, а не переход по ссылке.',
      'Значения столбца можно собрать по ячейкам строк таблицы.'
    ],
    tests: [
      {
        name: 'фильтр отражён в адресе',
        code: `expect(result.url).toContain('status=DONE');`
      },
      {
        name: 'в таблице остались только задачи со статусом DONE',
        code: `expect(result.statuses.length > 0).toBe(true);
expect(result.statuses.every(value => value === 'DONE')).toBe(true);`
      },
      {
        name: 'число строк совпадает с числом прочитанных статусов',
        code: `expect(result.rows).toBe(result.statuses.length);`
      },
      {
        name: 'форма осталась на выбранном значении',
        code: `expect(await page.getByLabel('Статус').inputValue()).toBe('DONE');`
      },
      {
        name: 'на стенде такие задачи действительно есть',
        code: `const response = await api.get('/work-items?status=DONE&limit=1');
expect(response.status).toBe(200);
expect(response.body.total > 0).toBe(true);`
      }
    ],
    solution: `export default async function solve({ page }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/work-items');

  await page.getByLabel('Статус').selectOption('DONE');
  await page.getByRole('button', { name: 'Применить фильтр' }).click();
  await page.waitForURL(/status=DONE/);

  const cells = page.locator('tbody tr td:nth-child(2)');
  const statuses = await cells.allInnerTexts();

  return {
    url: page.url(),
    statuses: statuses.map(value => value.trim()),
    rows: await page.locator('tbody tr').count()
  };
}`
  }
]
