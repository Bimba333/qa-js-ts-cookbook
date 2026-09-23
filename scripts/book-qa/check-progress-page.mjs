import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import net from 'node:net'

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
const context = await browser.newContext()
const page = await context.newPage()

const failures = []
const check = (name, condition) => {
  if (condition) console.log(`  ✓  ${name}`)
  else { console.log(`  ✕  ${name}`); failures.push(name) }
}

await page.goto(`${base}/docs/progress`, { waitUntil: 'load' })
await page.waitForTimeout(800)

const totalText = await page.locator('.progress-board__label').innerText()
check('страница показывает общее число задач', /решено из \d+/.test(totalText))
check('сначала решено ноль', (await page.locator('.progress-board__value').innerText()).trim() === '0')
check('есть части книги', (await page.locator('.progress-board__part').count()) >= 3)
check('предложено, с чего продолжить', (await page.locator('.progress-board__hint a').count()) === 1)

// Прогресс, записанный решением задачи, должен попасть на страницу.
await page.evaluate(() => {
  window.localStorage.setItem('book:task-progress:v1', JSON.stringify({
    'js-07-counter': { status: 'solved', attempts: 1, hintsUsed: 0 },
    'js-10-tdz-is-observable': { status: 'attempted', attempts: 2, hintsUsed: 1 }
  }))
})
await page.reload({ waitUntil: 'load' })
await page.waitForTimeout(800)

check('решённая задача учтена', (await page.locator('.progress-board__value').innerText()).trim() === '1')
check('начатая задача показана отдельно',
  (await page.locator('.progress-board__hint').first().innerText()).includes('Начато, но не решено: 1'))

// Снимок должен пережить очистку хранилища: это его единственная задача.
const [download] = await Promise.all([
  page.waitForEvent('download'),
  page.getByRole('button', { name: 'Сохранить снимок' }).click()
])

const snapshotPath = await download.path()
check('снимок сохраняется файлом', download.suggestedFilename() === 'js-ts-qa-book-progress.json')

page.once('dialog', dialog => dialog.accept())
await page.getByRole('button', { name: 'Очистить' }).click()
await page.waitForTimeout(300)
check('очистка обнуляет счётчик',
  (await page.locator('.progress-board__value').innerText()).trim() === '0')

await page.locator('input[type="file"]').setInputFiles(snapshotPath)
await page.waitForTimeout(300)

check('перенос снимка возвращает решённое',
  (await page.locator('.progress-board__value').innerText()).trim() === '1')
check('о переносе сообщается',
  (await page.locator('.progress-board__message').innerText()).includes('Перенесено задач: 2'))

// Испорченный файл не должен ломать страницу.
await page.locator('input[type="file"]').setInputFiles({
  name: 'broken.json',
  mimeType: 'application/json',
  buffer: Buffer.from('{"version":1}')
})
await page.waitForTimeout(300)
check('непонятный снимок отклоняется с объяснением',
  (await page.locator('.progress-board__message').innerText()).includes('не похож на прогресс'))
check('прогресс после отказа сохранился',
  (await page.locator('.progress-board__value').innerText()).trim() === '1')

// Учётная запись: проверяется против запущенного сервиса прогресса.
const PLATFORM = process.env.PLATFORM_BASE_URL ?? 'http://127.0.0.1:4320'
const platformUp = await reachable(`${PLATFORM}/health/ready`)

if (!platformUp) {
  console.log('  —   сервис прогресса не запущен, проверки учётной записи пропущены')
  console.log('      поднимите его командой npm run platform:up')
} else {
  const email = `reader-${Date.now()}@example.test`
  const password = 'educational-password'

  await page.evaluate(base => {
    window.localStorage.setItem('book:sync-settings:v1', JSON.stringify({
      provider: 'service', baseUrl: base, projectUrl: '', anonKey: ''
    }))
  }, PLATFORM)

  await page.reload({ waitUntil: 'load' })
  await page.waitForTimeout(500)

  await page.getByLabel('Почта').fill(email)
  await page.getByLabel('Пароль').fill(password)
  await page.getByRole('button', { name: 'Создать запись' }).click()
  await page.waitForTimeout(1200)

  check('регистрация из книги проходит',
    (await page.locator('.account-panel__message').innerText()).includes('Вход выполнен'))
  check('после входа показан адрес',
    (await page.locator('.account-panel__signed').innerText()).includes(email))

  // Второе устройство: чистый контекст, тот же читатель.
  const second = await browser.newContext()
  const secondPage = await second.newPage()

  await secondPage.goto(`${base}/docs/progress`, { waitUntil: 'load' })
  await secondPage.evaluate(platform => {
    window.localStorage.setItem('book:sync-settings:v1', JSON.stringify({
      provider: 'service', baseUrl: platform, projectUrl: '', anonKey: ''
    }))
  }, PLATFORM)
  await secondPage.reload({ waitUntil: 'load' })
  await secondPage.waitForTimeout(500)

  check('на втором устройстве прогресса нет',
    (await secondPage.locator('.progress-board__value').innerText()).trim() === '0')

  await secondPage.getByLabel('Почта').fill(email)
  await secondPage.getByLabel('Пароль').fill(password)
  await secondPage.getByRole('button', { name: 'Войти' }).click()
  await secondPage.waitForTimeout(1200)

  check('вход на втором устройстве приносит прогресс',
    (await secondPage.locator('.progress-board__value').innerText()).trim() === '1')

  await secondPage.getByRole('button', { name: 'Выйти' }).click()
  await secondPage.waitForTimeout(600)

  check('после выхода прогресс остаётся в браузере',
    (await secondPage.locator('.progress-board__value').innerText()).trim() === '1')

  await second.close()
}

await browser.close()
server.kill('SIGTERM')

console.log(failures.length === 0 ? 'Страница прогресса работает' : `Сбоев: ${failures.length}`)
process.exit(failures.length === 0 ? 0 : 1)
