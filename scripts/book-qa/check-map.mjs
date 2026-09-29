/**
 * Проверка карты книги.
 *
 * Карта отвечает на вопрос «где я и что осталось»: все главы в одном списке,
 * поиск, фильтры, отметки прогресса и границы доступа. Числа обязаны совпадать
 * со сборкой — иначе карта начинает показывать книгу, которой нет.
 */
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'

const generated = fs.readFileSync('.vitepress/book.generated.mjs', 'utf8')
const book = JSON.parse(generated.slice(generated.indexOf('{')).trim())

const freePort = () => new Promise(resolve => {
  const server = net.createServer()
  server.listen(0, () => { const { port } = server.address(); server.close(() => resolve(port)) })
})

const port = await freePort()
const server = spawn('npx', ['vitepress', 'preview', '.', '--port', String(port)], { stdio: 'ignore' })
const base = `http://127.0.0.1:${port}/qa-js-ts-cookbook`

const reachable = async url => { try { return (await fetch(url)).ok } catch { return false } }

let up = false
for (let attempt = 0; attempt < 60 && !up; attempt += 1) {
  await new Promise(resolve => setTimeout(resolve, 500))
  up = await reachable(`${base}/docs/map`)
}
if (!up) { server.kill('SIGKILL'); throw new Error('предпросмотр не поднялся') }

const browser = await chromium.launch()
const context = await browser.newContext()
const page = await context.newPage()

const failures = []
const check = (name, condition) => {
  if (condition) console.log(`  ✓  ${name}`)
  else { console.log(`  ✕  ${name}`); failures.push(name) }
}

await page.goto(`${base}/docs/map`, { waitUntil: 'load' })
await page.waitForTimeout(800)

const rows = page.locator('.book-map__row')
check('на карте все главы книги', (await rows.count()) === book.statistics.chapters)
check('части книги показаны', (await page.locator('.book-map__part').count()) === book.parts.length)
check('разделы подписаны', (await page.locator('.book-map__section').count()) > 20)

const freeMarks = await page.locator('.book-map__access--free').count()
check('открытых глав столько же, сколько в сборке', freeMarks === book.statistics.freeChapters)

// Поиск должен сужать список, а не перезагружать страницу.
await page.fill('.book-map__search input', 'filter')
await page.waitForTimeout(300)
const afterSearch = await rows.count()
check('поиск сужает список', afterSearch > 0 && afterSearch < book.statistics.chapters)
check('найденное относится к запросу',
  (await rows.first().textContent()).toLowerCase().includes('filter'))

await page.fill('.book-map__search input', '52')
await page.waitForTimeout(300)
check('поиск по номеру главы работает', (await rows.count()) >= 1)

await page.click('.book-map__reset')
await page.waitForTimeout(300)
check('сброс возвращает все главы', (await rows.count()) === book.statistics.chapters)

// Фильтр по части.
await page.click('.book-map__chip:has-text("TypeScript")')
await page.waitForTimeout(300)
const tsCount = Object.values(book.chapters).filter(chapter => chapter.part === 'TypeScript').length
check('фильтр по части оставляет только её главы', (await rows.count()) === tsCount)

await page.click('.book-map__chip:has-text("все")')
await page.waitForTimeout(300)

// Фильтр «только открытые».
await page.check('.book-map__toggles input >> nth=1')
await page.waitForTimeout(300)
check('фильтр «только открытые» работает', (await rows.count()) === book.statistics.freeChapters)
await page.uncheck('.book-map__toggles input >> nth=1')
await page.waitForTimeout(300)

// Прогресс: решённая задача меняет отметку главы.
await page.evaluate(() => {
  window.localStorage.setItem('book:task-progress:v1', JSON.stringify({
    'js-07-counter': { status: 'solved', attempts: 1, hintsUsed: 0 }
  }))
})
await page.reload({ waitUntil: 'load' })
await page.waitForTimeout(800)

check('решённые задачи отмечены на карте',
  (await page.locator('.book-map__tasks--started, .book-map__tasks--solved').count()) >= 1)
check('предложено, с чего продолжить',
  (await page.locator('.book-map__continue').count()) === 1)

const hrefs = await page.locator('.book-map a').evaluateAll(
  links => links.map(link => link.getAttribute('href'))
)
check('все ссылки карты с префиксом base',
  hrefs.every(href => href.startsWith('/qa-js-ts-cookbook/')))

// Фильтр «только нерешённые» не должен прятать главы без задач молча:
// проверяем, что он именно сужает и что счётчик это показывает.
await page.check('.book-map__toggles input >> nth=0')
await page.waitForTimeout(300)
const unsolved = await rows.count()
check('фильтр «только нерешённые» сужает список',
  unsolved > 0 && unsolved < book.statistics.chapters)
check('счётчик показывает, сколько показано',
  (await page.locator('.book-map__lede').textContent()).includes(String(unsolved)))

await browser.close()
server.kill('SIGKILL')

console.log('')
if (failures.length > 0) {
  console.log(`Не пройдено: ${failures.length}`)
  process.exitCode = 1
} else {
  console.log('Итог: все проверки пройдены')
}
