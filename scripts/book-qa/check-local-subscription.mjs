/**
 * Проверка локального прохождения книги.
 *
 * Отвечает на вопрос «могу ли я развернуть книгу у себя и пройти её целиком»:
 * читатель регистрируется в книге, выдаёт себе подписку локальной кнопкой и
 * открывает платную главу. Проверка требует поднятого сервиса
 * (`npm run platform:up`); без него она честно пропускается, а не молча
 * притворяется пройденной.
 */
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import net from 'node:net'

const PLATFORM = process.env.PLATFORM_BASE_URL ?? 'http://127.0.0.1:4320'

const generated = fs.readFileSync('.vitepress/book.generated.mjs', 'utf8')
const book = JSON.parse(generated.slice(generated.indexOf('{')).trim())
const paid = Object.values(book.chapters).find(chapter => chapter.access === 'paid')

if (!paid) {
  console.log('Все главы открыты (book.access.mjs): подписка для локального чтения не нужна.')
  process.exit(0)
}

const platformUp = await (async () => {
  try {
    return (await fetch(`${PLATFORM}/health/ready`)).ok
  } catch {
    return false
  }
})()

if (!platformUp) {
  console.log(`Сервис учётных записей не отвечает на ${PLATFORM}.`)
  console.log('Запустите его командой npm run platform:up и повторите проверку.')
  process.exit(0)
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
  up = await reachable(`${base}/docs/progress`)
}
if (!up) { server.kill('SIGKILL'); throw new Error('предпросмотр не поднялся') }

const browser = await chromium.launch()
const page = await browser.newPage()

const failures = []
const check = (name, condition, detail) => {
  if (condition) console.log(`  ✓  ${name}`)
  else {
    console.log(`  ✕  ${name}${detail === undefined ? '' : ` (${detail})`}`)
    failures.push(name)
  }
}

// 1. Гость упирается в подписку на платной главе.
await page.goto(`${base}${paid.link}`, { waitUntil: 'load' })
await page.waitForTimeout(700)
check('гостю платная глава закрыта', (await page.locator('.chapter-access-hidden').count()) > 5)

// 2. Регистрация в книге против локального сервиса.
await page.goto(`${base}/docs/progress`, { waitUntil: 'load' })
await page.waitForTimeout(700)

await page.selectOption('.account-panel select', 'service')
await page.fill('.account-panel input[type="url"], .account-panel input[placeholder*="http"]', PLATFORM)
await page.click('.account-panel button:has-text("Сохранить")').catch(() => {})

const email = `local-${Date.now()}@book.test`
await page.fill('.account-panel input[type="email"]', email)
await page.fill('.account-panel input[type="password"]', 'local-password-1')
await page.click('.account-panel button:has-text("Создать запись")')
await page.waitForTimeout(1500)

check('регистрация из книги прошла',
  (await page.locator('.account-panel__signed').count()) === 1,
  await page.locator('.account-panel__problem').textContent().catch(() => ''))
check('сказано, что подписки пока нет',
  (await page.locator('.account-panel__subscription').textContent()).includes('Подписки нет'))

// 3. Выдача подписки локальной кнопкой.
await page.click('.account-panel button:has-text("Выдать подписку локально")')
await page.waitForTimeout(1500)

check('подписка выдана',
  (await page.locator('.account-panel__subscription').textContent()).includes('активна'))

// 4. Платная глава открыта, работают шаги и примеры.
await page.goto(`${base}${paid.link}`, { waitUntil: 'load' })
await page.waitForTimeout(900)

check('платная глава открылась', (await page.locator('.chapter-access-hidden').count()) === 0)
check('панель доступа сообщает об открытой главе',
  (await page.locator('.chapter-access').textContent()).toLowerCase().includes('открыта'))
check('полоса шагов главы работает', (await page.locator('.chapter-steps__step').count()) >= 2)

await browser.close()
server.kill('SIGKILL')

console.log('')
if (failures.length > 0) {
  console.log(`Не пройдено: ${failures.length}`)
  process.exitCode = 1
} else {
  console.log('Итог: книгу можно пройти локально целиком')
}
