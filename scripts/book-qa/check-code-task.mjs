/**
 * Проверяет, что движок проверяемых задач работает на собранном сайте.
 *
 * Тест проходит путь читателя целиком: открывает главу, запускает проверку
 * со стартовым кодом, убеждается, что она падает, затем вставляет эталонное
 * решение и убеждается, что все проверки проходят и статус меняется.
 */
import { chromium } from '@playwright/test'

const BASE = process.env.BOOK_PREVIEW_URL ?? 'http://localhost:4173/qa-js-ts-cookbook'
const CHAPTER = `${BASE}/docs/01-javascript/07-scope`

const failures = []

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
    (await task.locator('.code-task__badge--status').innerText()) === 'Не начата'
  )

  // Стартовый код не решает задачу: проверки обязаны упасть.
  await task.getByRole('button', { name: '✓ Проверить' }).click()
  await task.locator('.code-task__results').waitFor({ timeout: 10_000 })

  const failedMarks = await task.locator('.code-task__results .is-failed').count()
  check('со стартовым кодом проверки падают', failedMarks > 0, `провалено: ${failedMarks}`)

  const failMessage = await task.locator('.is-failed .code-task__check-message').first().innerText()
  check(
    'отчёт объясняет, что именно не сошлось',
    /ожидалось/.test(failMessage),
    failMessage
  )

  check(
    'статус стал «Есть попытки»',
    (await task.locator('.code-task__badge--status').innerText()) === 'Есть попытки'
  )

  // Подсказки открываются по одной.
  await task.getByRole('button', { name: /Подсказка/ }).click()
  check('подсказка открывается', (await task.locator('.code-task__hints li').count()) === 1)

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
    (await task.locator('.code-task__badge--status').innerText()) === 'Решена'
  )

  // Прогресс переживает перезагрузку страницы.
  await page.reload({ waitUntil: 'domcontentloaded' })
  const afterReload = page.locator('.code-task').first()
  await afterReload.locator('.code-task__badge--status').waitFor()
  check(
    'прогресс сохраняется между посещениями',
    (await afterReload.locator('.code-task__badge--status').innerText()) === 'Решена'
  )

  // Бесконечный цикл не должен вешать страницу.
  const loopTask = page.locator('.code-task').first()
  await loopTask.locator('.code-task__editor').fill('function createCounter() { while (true) {} }')
  await loopTask.getByRole('button', { name: '✓ Проверить' }).click()
  await loopTask.locator('.code-task__fatal').waitFor({ timeout: 15_000 })
  check(
    'бесконечный цикл прерывается по таймауту',
    /слишком долго/.test(await loopTask.locator('.code-task__fatal').innerText())
  )
} finally {
  await browser.close()
}

console.log(`\nИтог: ${failures.length === 0 ? 'все проверки пройдены' : `не прошло: ${failures.join(', ')}`}`)
if (failures.length > 0) process.exitCode = 1
