/**
 * Проверка трёх состояний доступа: гость, вошедший читатель, подписчик.
 *
 * Проверяется то, что читатель ВИДИТ. То, что текст платной главы лежит в
 * статической сборке, — известное ограничение, и проверка на него не
 * закрывает глаза: отдельный пункт убеждается, что содержимое действительно
 * присутствует в HTML, то есть замок остаётся интерфейсным.
 */
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'

// Главы для проверки берутся из сборки, а не вписаны руками: состав уровней
// задаёт book.access.mjs и меняется в любой момент. Если платных глав нет
// вообще (всё открыто для локальной работы), проверять здесь нечего.
const generated = fs.readFileSync('.vitepress/book.generated.mjs', 'utf8')
const book = JSON.parse(generated.slice(generated.indexOf('{')).trim())
const chapters = Object.values(book.chapters)

const firstWith = level => chapters.find(chapter => chapter.access === level)?.link ?? null

const FREE_CHAPTER = firstWith('free')
const PAID_CHAPTER = firstWith('paid')

if (!PAID_CHAPTER) {
  console.log('Все главы открыты (book.access.mjs): проверять разграничение доступа нечего.')
  process.exit(0)
}

if (!FREE_CHAPTER) {
  console.log('Нет ни одной открытой главы: проверка ожидает хотя бы одну бесплатную.')
  process.exit(1)
}

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
  up = await reachable(`${base}${FREE_CHAPTER}`)
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

const open = async path => {
  await page.goto(`${base}${path}`, { waitUntil: 'load' })
  await page.waitForTimeout(700)
}

const asGuest = async () => {
  await page.evaluate(() => {
    window.localStorage.removeItem('book:sync-session:v1')
    window.localStorage.removeItem('book:entitlement:v1')
  })
}

// --- гость на бесплатной главе
await open(FREE_CHAPTER)
await asGuest()
await open(FREE_CHAPTER)

check('на бесплатной главе панели доступа нет', (await page.locator('.chapter-access').count()) === 0)
check('текст бесплатной главы виден', (await page.locator('.chapter-access-hidden').count()) === 0)

// --- гость на платной главе
await open(PAID_CHAPTER)

const guestPanel = page.locator('.chapter-access')
const panelText = async () => (await page.locator('.chapter-access').textContent()).toLowerCase()
check('на платной главе есть панель доступа', (await guestPanel.count()) === 1)
check('панель называет границу', (await panelText()).includes('входит в подписку'))
check('гостю сказано про прогресс', (await panelText()).includes('не сохраняется'))
check('содержимое платной главы скрыто', (await page.locator('.chapter-access-hidden').count()) > 5)
const headingInfo = await page.evaluate(() => {
  const heading = document.querySelector('.vp-doc h1')

  if (!heading) return { found: false }

  return {
    found: true,
    visible: heading.offsetParent !== null,
    parentClass: heading.parentElement?.className ?? '',
    ownClass: heading.className
  }
})
check('заголовок главы остаётся виден', headingInfo.found && headingInfo.visible)
if (!headingInfo.visible) console.log('      структура заголовка:', JSON.stringify(headingInfo))

const visibleParagraphs = await page.locator('.vp-doc > div > p:not(.chapter-access-hidden)').count()
check('видны первые абзацы, а не весь текст', visibleParagraphs > 0 && visibleParagraphs <= 3)

// --- вошедший читатель без подписки
await page.evaluate(() => {
  window.localStorage.setItem('book:sync-session:v1', JSON.stringify({ token: 'x', email: 'a@b.test' }))
})
await open(PAID_CHAPTER)

const signedPanel = await panelText()
check('вошедшему сказано, что прогресс сохраняется', signedPanel.includes('прогресс сохраняется'))
check('вошедшему без подписки текст по-прежнему скрыт',
  (await page.locator('.chapter-access-hidden').count()) > 5)

// --- подписчик
await page.evaluate(() => {
  const until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  window.localStorage.setItem('book:entitlement:v1', JSON.stringify({
    subscribed: true, plan: 'dev', validUntil: until, checkedAt: new Date().toISOString()
  }))
})
await open(PAID_CHAPTER)

const subscriberPanel = await panelText()
check('подписчику глава открыта', subscriberPanel.includes('открыта'))
check('подписчику текст виден', (await page.locator('.chapter-access-hidden').count()) === 0)
check('подписчику показан срок', /\d{2}\.\d{2}\.\d{4}/.test(subscriberPanel))

// --- служебные страницы под правила доступа не попадают
await open('/docs/progress')
check('страница прогресса не закрыта подпиской',
  (await page.locator('.chapter-access').count()) === 0 &&
  (await page.locator('.chapter-access-hidden').count()) === 0)

// --- честность: замок интерфейсный, текст в сборке есть
const html = await (await fetch(`${base}${PAID_CHAPTER}`)).text()
check('текст платной главы присутствует в статической сборке (известное ограничение)',
  html.length > 20000)

await browser.close()
server.kill('SIGKILL')

console.log('')
if (failures.length > 0) {
  console.log(`Не пройдено: ${failures.length}`)
  process.exitCode = 1
} else {
  console.log('Итог: все проверки пройдены')
}
