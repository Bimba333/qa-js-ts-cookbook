export default [
  {
    id: 'qa-173-shortest-boundary-wins',
    title: 'Побеждает самая короткая граница',
    difficulty: 'hard',
    lang: 'playwright',
    prompt:
      'Покажите, что границы ожидания независимы и срабатывает самая короткая. ' +
      'Войдите как `educational_tester` с паролем `educational-tester-password`, ' +
      'откройте `/work-items` и дождитесь заведомо отсутствующего элемента ' +
      '`page.getByRole("heading", { name: "Такого заголовка нет" })` двумя ' +
      'способами: с таймаутом 300 мс и с таймаутом 1200 мс. Верните ' +
      '`{ shortMs, longMs, shortFailed, longFailed, message }`: измеренное время ' +
      'каждого ожидания в миллисекундах, признаки того, что оба ожидания ' +
      'завершились ошибкой, и текст первой ошибки.',
    starter: `export default async function solve({ page }) {
  // Ожидание элемента ограничено своим таймаутом, а не общим временем теста.

  return { shortMs: 0, longMs: 0, shortFailed: false, longFailed: false, message: '' };
}`,
    hints: [
      'Таймаут передаётся параметром конкретного ожидания.',
      'Истёкшее ожидание выбрасывает ошибку — её нужно поймать.',
      'Время измеряется вокруг самого ожидания, а не вокруг всего сценария.'
    ],
    tests: [
      {
        name: 'оба ожидания завершились ошибкой',
        code: `expect(result.shortFailed).toBe(true);
expect(result.longFailed).toBe(true);`
      },
      {
        name: 'короткая граница сработала раньше длинной',
        code: `expect(result.shortMs < result.longMs).toBe(true);`
      },
      {
        name: 'короткое ожидание уложилось в свою границу',
        code: `expect(result.shortMs >= 250).toBe(true);
expect(result.shortMs < 1000).toBe(true);`
      },
      {
        name: 'длинное ожидание длилось дольше своей границы',
        code: `expect(result.longMs >= 1100).toBe(true);`
      },
      {
        name: 'ошибка объясняет, чего не дождались',
        code: `expect(result.message.length > 0).toBe(true);
expect(/Timeout|timeout/.test(result.message)).toBe(true);`
      },
      {
        name: 'страница осталась рабочей после истёкших ожиданий',
        code: `expect(await page.getByRole('heading', { name: 'Задачи' }).isVisible()).toBe(true);`
      }
    ],
    solution: `export default async function solve({ page }) {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('educational_tester');
  await page.getByLabel('Пароль').fill('educational-tester-password');
  await page.getByRole('button', { name: 'Войти' }).click();

  await page.goto('/work-items');

  const missing = page.getByRole('heading', { name: 'Такого заголовка нет' });

  const measure = async timeout => {
    const startedAt = Date.now();

    try {
      await missing.waitFor({ state: 'visible', timeout });

      return { elapsed: Date.now() - startedAt, failed: false, message: '' };
    } catch (error) {
      return { elapsed: Date.now() - startedAt, failed: true, message: error.message };
    }
  };

  const short = await measure(300);
  const long = await measure(1200);

  return {
    shortMs: short.elapsed,
    longMs: long.elapsed,
    shortFailed: short.failed,
    longFailed: long.failed,
    message: short.message
  };
}`
  }
]
