/**
 * Проверяет, что движок проверяемых задач работает на собранном сайте.
 *
 * Тест проходит путь читателя целиком: открывает главу, запускает проверку
 * со стартовым кодом, убеждается, что она падает, затем вставляет эталонное
 * решение и убеждается, что все проверки проходят и статус меняется.
 */
import { spawn } from 'node:child_process'
import net from 'node:net'

import { chromium } from '@playwright/test'

const failures = []

function findFreePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer()

    probe.unref()
    probe.on('error', reject)
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address()

      probe.close(() => resolve(port))
    })
  })
}

async function isReachable(url) {
  try {
    const response = await fetch(url, { redirect: 'follow' })

    return response.ok
  } catch {
    return false
  }
}

/**
 * Поднимает собственный предпросмотр на свободном порту.
 *
 * Переиспользовать уже запущенный сервер нельзя: он мог быть запущен до
 * пересборки и отдавать устаревшие файлы, из-за чего страница не оживает,
 * а проверка падает без внятной причины.
 */
async function startPreview() {
  const port = await findFreePort()
  const base = `http://127.0.0.1:${port}/qa-js-ts-cookbook`
  const server = spawn('npx', ['vitepress', 'preview', '.', '--port', String(port)], {
    stdio: 'ignore'
  })

  for (let attempt = 0; attempt < 60; attempt += 1) {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (await isReachable(`${base}/docs/01-javascript/07-scope`)) {
      return { base, stop: () => server.kill('SIGTERM') }
    }
  }

  server.kill('SIGKILL')
  throw new Error('Не удалось запустить предпросмотр книги. Сначала выполните npm run docs:build.')
}

const preview = await startPreview()
const BASE = preview.base
const CHAPTER = `${BASE}/docs/01-javascript/07-scope`
const stopPreview = preview.stop

function check(name, condition, detail = '') {
  if (condition) {
    console.log(`  PASS  ${name}`)
  } else {
    failures.push(name)
    console.log(`  FAIL  ${name}${detail ? `\n        ${detail}` : ''}`)
  }
}

const browser = await chromium.launch()
const page = await browser.newPage()

try {
  await page.goto(CHAPTER, { waitUntil: 'domcontentloaded' })

  const heading = page.getByRole('heading', { name: 'Задачи с проверкой' })
  await heading.waitFor({ timeout: 10_000 })
  check('раздел проверяемых задач отрисован', await heading.isVisible())

  const task = page.locator('.code-task').first()
  await task.waitFor()

  check(
    'задача начинается со статуса «Не начата»',
    ((await task.locator('.code-task__badge--status').textContent()).trim()) === 'Не начата'
  )

  // Стартовый код не решает задачу: проверки обязаны упасть.
  await task.getByRole('button', { name: '✓ Проверить' }).click()
  await task.locator('.code-task__results').waitFor({ timeout: 10_000 })

  const failedMarks = await task.locator('.code-task__results .is-failed').count()
  check('со стартовым кодом проверки падают', failedMarks > 0, `провалено: ${failedMarks}`)

  // Сообщение может быть как несовпадением ожидания, так и ошибкой
  // выполнения: важно, что читателю объясняют причину, а не просто «не прошло».
  const failMessage = await task.locator('.is-failed .code-task__check-message').first().innerText()
  check(
    'отчёт объясняет, что именно не сошлось',
    failMessage.trim().length > 0 && !/^не прошло$/i.test(failMessage),
    failMessage
  )

  check(
    'статус стал «Есть попытки»',
    ((await task.locator('.code-task__badge--status').textContent()).trim()) === 'Есть попытки'
  )

  // Решение не должно открываться после первой же проверки.
  check(
    'после одной попытки решение закрыто',
    (await task.locator('.code-task__solution-locked').count()) === 1
  )

  const lockMessage = await task.locator('.code-task__solution-locked').innerText()
  check(
    'сообщение называет, чего не хватает',
    /ещё попыток: 1/.test(lockMessage) && /нераскрытых подсказок/.test(lockMessage),
    lockMessage
  )

  // Подсказки открываются по одной.
  await task.getByRole('button', { name: /Подсказка/ }).click()
  check('подсказка открывается', (await task.locator('.code-task__hints li').count()) === 1)

  // Вторая попытка и все подсказки открывают решение честным путём.
  await task.getByRole('button', { name: '✓ Проверить' }).click()
  await task.locator('.code-task__summary').waitFor({ timeout: 10_000 })

  const hintButton = task.getByRole('button', { name: /Подсказка/ })
  while (await hintButton.isEnabled()) {
    await hintButton.click()
  }

  check(
    'после попыток и подсказок решение открывается',
    (await task.getByRole('button', { name: 'Показать решение' }).count()) === 1
  )

  // Эталонное решение должно проходить все проверки.
  const solution = `function createCounter() {
  let count = 0;
  return function next() {
    count += 1;
    return count;
  };
}`

  await task.locator('.code-task__editor').fill(solution)
  await task.getByRole('button', { name: '✓ Проверить' }).click()
  await task.locator('.code-task__summary--ok').waitFor({ timeout: 10_000 })

  const passed = await task.locator('.code-task__results .is-passed').count()
  const failed = await task.locator('.code-task__results .is-failed').count()
  check('решение проходит все проверки', failed === 0 && passed === 4, `ок: ${passed}, провалено: ${failed}`)

  check(
    'статус стал «Решена»',
    ((await task.locator('.code-task__badge--status').textContent()).trim()) === 'Решена'
  )

  // Прогресс переживает перезагрузку страницы.
  await page.reload({ waitUntil: 'domcontentloaded' })
  const afterReload = page.locator('.code-task').first()
  await afterReload.locator('.code-task__badge--status').waitFor()
  check(
    'прогресс сохраняется между посещениями',
    ((await afterReload.locator('.code-task__badge--status').textContent()).trim()) === 'Решена'
  )

  // Отказ от самостоятельного решения: отдельная задача, чтобы не смешивать
  // с той, которую только что решили.
  await page.goto(`${BASE}/docs/01-javascript/15-type-conversion`, { waitUntil: 'load' })
  const surrenderTask = page.locator('.code-task').first()
  await surrenderTask.waitFor({ timeout: 10_000 })

  check(
    'до попыток решение закрыто',
    (await surrenderTask.locator('.code-task__solution-locked').count()) === 1
  )

  page.once('dialog', dialog => dialog.accept())
  await surrenderTask.getByRole('button', { name: 'Сдаться и открыть решение' }).click()
  await surrenderTask.locator('.code-task__solution-body').waitFor({ timeout: 5000 })

  check(
    'после отказа решение показано',
    (await surrenderTask.locator('.code-task__solution-body').isVisible())
  )
  check(
    'отказ отмечен в интерфейсе',
    (await surrenderTask.locator('.code-task__solution-note').innerText())
      .includes('без самостоятельного разбора')
  )

  await page.reload({ waitUntil: 'domcontentloaded' })
  const afterSurrender = page.locator('.code-task').first()
  await afterSurrender.locator('.code-task__badge--status').waitFor()
  check(
    'отказ помнится между посещениями',
    (await afterSurrender.getByRole('button', { name: /решение/i }).count()) >= 1
  )

  await page.goto(`${BASE}/docs/01-javascript/07-scope`, { waitUntil: 'load' })
  await page.locator('.code-task').first().waitFor({ timeout: 10_000 })

  // Бесконечный цикл не должен вешать страницу.
  const loopTask = page.locator('.code-task').first()
  await loopTask.locator('.code-task__editor').fill('function createCounter() { while (true) {} }')
  await loopTask.getByRole('button', { name: '✓ Проверить' }).click()
  await loopTask.locator('.code-task__fatal').waitFor({ timeout: 15_000 })
  check(
    'бесконечный цикл прерывается по таймауту',
    /слишком долго/.test(await loopTask.locator('.code-task__fatal').innerText())
  )
  // TypeScript-задача: код должен транспилироваться перед запуском.
  await page.goto(`${BASE}/docs/02-typescript/111-type-alias`, { waitUntil: 'load' })
  const tsTask = page.locator('.code-task').first()
  await tsTask.waitFor({ timeout: 10_000 })

  const tsSolution = `type TestResult = {
  name: string;
  status: 'passed' | 'failed' | 'skipped';
  durationMs?: number;
};

function describe(result: TestResult): string {
  const base = result.name + ': ' + result.status;
  return result.durationMs === undefined
    ? base
    : base + ' (' + result.durationMs + ' мс)';
}`

  await tsTask.locator('.code-task__editor').fill(tsSolution)
  await tsTask.locator('.code-task__button--primary').click()
  await tsTask.locator('.code-task__results').waitFor({ timeout: 15_000 })

  const tsFailed = await tsTask.locator('.code-task__results .is-failed').count()
  check('TypeScript-задача проходит проверки', tsFailed === 0, `провалено: ${tsFailed}`)

  // Песочница примеров — единственное место, где читатель правит код,
  // поэтому бесконечный цикл там не должен вешать страницу.
  await page.goto(`${BASE}/docs/01-javascript/07-scope`, { waitUntil: 'load' })
  const playground = page.locator('.code-runner--sandbox').first()
  await playground.waitFor({ timeout: 10_000 })
  await page.waitForTimeout(1500)

  await playground.locator('.code-runner__editor').fill('while (true) {}')
  await playground.locator('.code-runner__button').first().click()
  await playground.locator('.code-runner__error').waitFor({ timeout: 20_000 })

  check(
    'бесконечный цикл в песочнице прерывается',
    /слишком долго/.test(await playground.locator('.code-runner__error pre').innerText())
  )

  check(
    'страница остаётся отзывчивой после зацикливания',
    (await page.evaluate(() => Boolean(document.title))) === true
  )

  await playground.locator('.code-runner__editor').fill('console.log(2 + 2)')
  await playground.locator('.code-runner__button').first().click()
  await playground.locator('.code-runner__output').waitFor({ timeout: 15_000 })

  check(
    'песочница работает после прерывания',
    (await playground.locator('.code-runner__output pre').innerText()).trim() === '4'
  )

  // Задача стенда не должна предлагать запуск в браузере.
  await page.goto(`${BASE}/docs/03-automation-qa/207-postgresql-in-automation-qa`, {
    waitUntil: 'load'
  })
  const standTask = page.locator('.code-task').first()
  await standTask.waitFor({ timeout: 10_000 })

  check('задача стенда не показывает редактор', (await standTask.locator('.code-task__editor').count()) === 0)
  check(
    'задача стенда показывает команду проверки',
    (await standTask.locator('.code-task__stand').innerText()).includes('task:verify')
  )
} finally {
  await browser.close()
  stopPreview()
}

console.log(`\nИтог: ${failures.length === 0 ? 'все проверки пройдены' : `не прошло: ${failures.join(', ')}`}`)
if (failures.length > 0) process.exitCode = 1
