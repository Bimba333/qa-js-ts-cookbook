export default [
  {
    id: 'qa-171-expect-heading',
    title: 'Проверка состояния страницы с ожиданием',
    difficulty: 'easy',
    lang: 'playwright',
    prompt:
      'Откройте страницу входа и дождитесь заголовка «Вход в систему» через ' +
      'web-first проверку `expect(locator).toBeVisible()`. Верните объект ' +
      '`{ waited, title }`: первый — `true`, если проверка прошла, второй — текст ' +
      'заголовка страницы. Функция `expect` доступна через импорт ' +
      '`@playwright/test`.',
    starter: `import { expect as pwExpect } from '@playwright/test';

export default async function solve({ page }) {
  // Проверка с ожиданием повторяет запрос к DOM до совпадения.

  return { waited: false, title: '' };
}`,
    hints: [
      'Web-first проверка получает локатор, а не снятое значение.',
      'Она сама повторяет обращение к DOM до таймаута.',
      'Текст заголовка можно прочитать после успешной проверки.'
    ],
    tests: [
      {
        name: 'проверка прошла',
        code: `expect(result.waited).toBe(true);`
      },
      {
        name: 'заголовок прочитан',
        code: `expect(result.title.trim()).toBe('Вход в систему');`
      },
      {
        name: 'страница входа открыта',
        code: `expect(page.url()).toContain('/login');`
      },
      {
        name: 'заголовок виден и после решения',
        code: `expect(await page.getByRole('heading', { name: 'Вход в систему' }).isVisible()).toBe(true);`
      }
    ],
    solution: `import { expect as pwExpect } from '@playwright/test';

export default async function solve({ page }) {
  await page.goto('/login');

  const heading = page.getByRole('heading', { name: 'Вход в систему' });
  await pwExpect(heading).toBeVisible();

  return { waited: true, title: await heading.innerText() };
}`
  },

  {
    id: 'qa-171-absent-element',
    title: 'Проверка отсутствия элемента',
    difficulty: 'medium',
    lang: 'playwright',
    prompt:
      'Откройте страницу входа и убедитесь, что на ней нет кнопки «Выйти». ' +
      'Верните объект `{ logoutCount, hidden }`: количество совпадений локатора ' +
      'кнопки и результат проверки её отсутствия через web-first проверку.',
    starter: `import { expect as pwExpect } from '@playwright/test';

export default async function solve({ page }) {
  // Для отсутствующего элемента подходят toHaveCount(0) и toBeHidden().

  return { logoutCount: -1, hidden: false };
}`,
    hints: [
      'Количество совпадений даёт метод count и проверка toHaveCount.',
      'Для отсутствующего элемента проходят и toBeHidden, и toHaveCount(0).',
      'Разница в смысле: «скрыт» против «отсутствует».'
    ],
    tests: [
      {
        name: 'кнопки выхода на странице нет',
        code: `expect(result.logoutCount).toBe(0);`
      },
      {
        name: 'проверка отсутствия прошла',
        code: `expect(result.hidden).toBe(true);`
      },
      {
        name: 'страница входа открыта',
        code: `expect(page.url()).toContain('/login');`
      },
      {
        name: 'форма входа при этом на месте',
        code: `expect(await page.getByLabel('Логин').isVisible()).toBe(true);`
      }
    ],
    solution: `import { expect as pwExpect } from '@playwright/test';

export default async function solve({ page }) {
  await page.goto('/login');

  const logout = page.getByRole('button', { name: 'Выйти' });
  await pwExpect(logout).toHaveCount(0);

  return { logoutCount: await logout.count(), hidden: true };
}`
  }
]
