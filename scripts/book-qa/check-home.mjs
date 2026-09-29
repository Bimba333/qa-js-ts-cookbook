/**
 * Проверка главной страницы.
 *
 * Главная должна отвечать на три вопроса за один экран: что это, для кого и что
 * открыто без оплаты. Числа при этом обязаны совпадать с собранной книгой —
 * иначе страница начинает обещать не то, что в ней есть.
 */
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'

const generated = fs.readFileSync('.vitepress/book.generated.mjs', 'utf8')
const book = JSON.parse(generated.slice(generated.indexOf('{')).trim())
const tasks = JSON.parse(fs.readFileSync('.vitepress/tasks.generated.json', 'utf8'))
const taskCount = Object.values(tasks).reduce((sum, list) => sum + list.length, 0)

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
  up = await reachable(`${base}/`)
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

await page.goto(`${base}/`, { waitUntil: 'load' })
await page.waitForTimeout(800)

const text = await page.locator('.home-board').textContent()

check('заголовок называет результат, а не тему',
  (await page.locator('.home-board__title').textContent()).includes('фреймворк'))
check('сказано, для кого книга', text.includes('тестировщика'))

const facts = await page.locator('.home-board__facts dd').allTextContents()
check('число глав совпадает со сборкой', facts[0].trim() === String(book.statistics.chapters))
check('число задач совпадает со сборкой', facts[1].trim() === String(taskCount))
check('число примеров совпадает со сборкой', facts[2].trim() === String(book.statistics.examples))

check('есть блок «чем отличается»', (await page.locator('.home-board__why-grid article').count()) === 4)

const tiers = await page.locator('.home-board__tier').count()
check('показаны три уровня доступа', tiers === 3)

const tierValues = await page.locator('.home-board__tier-value').allTextContents()
check('бесплатных глав столько же, сколько в сборке',
  tierValues[0].trim() === String(book.statistics.freeChapters))
check('подписка обещает все главы',
  tierValues[2].trim() === String(book.statistics.chapters))

check('гостю предложен вход', (await page.locator('.home-board__cta--ghost').textContent()).includes('Войти'))
check('есть маршрут из четырёх частей', (await page.locator('.home-board__part').count()) === 4)
check('честно сказано, чего в книге нет', (await page.locator('.home-board__limits li').count()) >= 3)

// Ссылки компонентов не проходят через разметку, поэтому префикс base им нужно
// добавлять руками — забытый withBase даёт 404 на развёрнутом сайте.
const hrefs = await page.locator('.home-board a').evaluateAll(
  links => links.map(link => link.getAttribute('href'))
)
check('все ссылки главной с префиксом base',
  hrefs.every(href => href.startsWith('/qa-js-ts-cookbook/')))

// Подписчик видит другое состояние блока подписки.
await page.evaluate(() => {
  const until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  window.localStorage.setItem('book:sync-session:v1', JSON.stringify({ token: 'x', email: 'a@b.test' }))
  window.localStorage.setItem('book:entitlement:v1', JSON.stringify({
    subscribed: true, plan: 'dev', validUntil: until, checkedAt: new Date().toISOString()
  }))
})
await page.reload({ waitUntil: 'load' })
await page.waitForTimeout(800)

check('подписчику сказано, что подписка активна',
  (await page.locator('.home-board__tier--paid').textContent()).includes('активна'))
check('подписчику не предлагают войти заново',
  !(await page.locator('.home-board__cta--ghost').textContent()).includes('Войти'))

await browser.close()
server.kill('SIGKILL')

console.log('')
if (failures.length > 0) {
  console.log(`Не пройдено: ${failures.length}`)
  process.exitCode = 1
} else {
  console.log('Итог: все проверки пройдены')
}
