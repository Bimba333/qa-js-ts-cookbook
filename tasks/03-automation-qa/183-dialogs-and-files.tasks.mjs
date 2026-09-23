export default [
  {
    id: 'qa-183-dialog-and-download',
    title: 'Диалог и скачивание требуют наблюдения заранее',
    difficulty: 'hard',
    lang: 'playwright',
    prompt:
      'Войдите как `educational_tester` с паролем `educational-tester-password` и ' +
      'откройте `/playground`. Выполните три действия: ' +
      '1) нажмите `[data-testid="confirm-button"]`, **приняв** диалог; ' +
      '2) нажмите его же ещё раз, **отклонив** диалог; ' +
      '3) нажмите `[data-testid="download-link"]` и получите файл. ' +
      'Верните `{ dialogType, dialogMessage, accepted, dismissed, fileName }`: тип ' +
      'и текст первого диалога, значение `[data-testid="dialog-result"]` после ' +
      'принятия и после отклонения, а также предлагаемое имя скачанного файла.',
    starter: `export default async function solve({ page }) {
  // Обработчик диалога ставится до действия, иначе страница останется ждать.

  return { dialogType: '', dialogMessage: '', accepted: '', dismissed: '', fileName: '' };
}`,
    hints: [
      'Обработчик диалога подписывается на событие страницы.',
      'Одноразовая подписка удобнее: второй диалог обрабатывается иначе.',
      'Скачивание — тоже событие, и ждать его надо вместе с нажатием.'
    ],
    tests: [
      {
        name: 'тип диалога распознан',
        code: `expect(result.dialogType).toBe('confirm');`
      },
      {
        name: 'текст диалога прочитан',
        code: `expect(result.dialogMessage).toBe('Удалить запись?');`
      },
      {
        name: 'принятие отражается на странице',
        code: `expect(result.accepted.trim()).toBe('Подтверждено');`
      },
      {
        name: 'отклонение отражается на странице',
        code: `expect(result.dismissed.trim()).toBe('Отменено');`
      },
      {
        name: 'имя скачанного файла задано сервером',
        code: `expect(result.fileName).toBe('work-items-report.txt');`
      },
      {
        name: 'страница осталась рабочей',
        code: `expect(await page.getByRole('heading', { name: 'Учебная площадка' }).isVisible()).toBe(true);`
      }
    ],
    solution: `export default async function solve({ page }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/playground');

  const confirmButton = page.locator('[data-testid="confirm-button"]');
  const result = page.locator('[data-testid="dialog-result"]');

  let dialogType = '';
  let dialogMessage = '';

  page.once('dialog', async dialog => {
    dialogType = dialog.type();
    dialogMessage = dialog.message();
    await dialog.accept();
  });

  await confirmButton.click();
  const accepted = await result.innerText();

  page.once('dialog', async dialog => {
    await dialog.dismiss();
  });

  await confirmButton.click();
  const dismissed = await result.innerText();

  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('[data-testid="download-link"]').click()
  ]);

  return {
    dialogType,
    dialogMessage,
    accepted,
    dismissed,
    fileName: download.suggestedFilename()
  };
}`
  },

  {
    id: 'qa-183-upload-file',
    title: 'Загрузка файла без выбора в проводнике',
    difficulty: 'medium',
    lang: 'playwright',
    prompt:
      'Файл для поля загрузки задаётся из кода, а не выбирается вручную. ' +
      'Войдите как `educational_tester` с паролем `educational-tester-password`, ' +
      'откройте `/playground`, подставьте в поле `[data-testid="file-input"]` файл ' +
      'с именем `report.txt`, типом `text/plain` и содержимым `abc` (три байта), ' +
      'и отправьте форму. Верните `{ before, field, name, size }`: текст ' +
      '`[data-testid="upload-empty"]` до отправки и значения полей результата ' +
      'после неё.',
    starter: `export default async function solve({ page }) {
  // Содержимое файла можно передать буфером, не создавая файл на диске.

  return { before: '', field: '', name: '', size: '' };
}`,
    hints: [
      'У локатора поля есть метод, принимающий описание файла.',
      'Описание файла состоит из имени, типа и содержимого.',
      'Результат появляется после отправки формы, а не сразу после выбора.'
    ],
    tests: [
      {
        name: 'до отправки результата нет',
        code: `expect(result.before.trim()).toBe('Файл ещё не загружен.');`
      },
      {
        name: 'имя поля формы совпадает с разметкой',
        code: `expect(result.field.trim()).toBe('report');`
      },
      {
        name: 'имя файла передано серверу',
        code: `expect(result.name.trim()).toBe('report.txt');`
      },
      {
        name: 'размер совпадает с содержимым',
        code: `expect(result.size.trim()).toBe('3');`
      },
      {
        name: 'страница осталась на площадке',
        code: `expect(page.url()).toContain('/playground');`
      }
    ],
    solution: `export default async function solve({ page }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/playground');

  const before = await page.locator('[data-testid="upload-empty"]').innerText();

  await page.locator('[data-testid="file-input"]').setInputFiles({
    name: 'report.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from('abc')
  });

  await page.getByRole('button', { name: 'Загрузить' }).click();
  await page.locator('[data-testid="upload-result"]').waitFor();

  return {
    before,
    field: await page.locator('[data-testid="upload-field"]').innerText(),
    name: await page.locator('[data-testid="upload-name"]').innerText(),
    size: await page.locator('[data-testid="upload-size"]').innerText()
  };
}`
  }
]
