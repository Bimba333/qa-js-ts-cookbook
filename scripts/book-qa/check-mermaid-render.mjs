import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import net from 'node:net'

const chapters = process.argv.slice(2)

const freePort = () => new Promise(resolve => {
  const server = net.createServer()
  server.listen(0, () => { const { port } = server.address(); server.close(() => resolve(port)) })
})

const port = await freePort()
const server = spawn('npx', ['vitepress', 'preview', '.', '--port', String(port)], { stdio: 'ignore' })
const base = `http://127.0.0.1:${port}/qa-js-ts-cookbook`

const reachable = async url => {
  try { const response = await fetch(url); return response.ok } catch { return false }
}

let up = false
for (let attempt = 0; attempt < 60 && !up; attempt += 1) {
  await new Promise(resolve => setTimeout(resolve, 500))
  up = await reachable(`${base}/docs/02-typescript/117-enum`)
}
if (!up) { server.kill('SIGKILL'); throw new Error('предпросмотр не поднялся') }

const browser = await chromium.launch()
const context = await browser.newContext()
let failures = 0

for (const chapter of chapters) {
  const page = await context.newPage()
  await page.goto(`${base}/${chapter}`, { waitUntil: 'load' })
  await page.waitForTimeout(1500)

  const total = await page.locator('.book-mermaid__canvas').count()
  const rendered = await page.locator('.book-mermaid__canvas svg').count()
  const errorText = await page.locator('.book-mermaid').first().innerText().catch(() => '')

  const ok = total > 0 && rendered === total && !/syntax error/i.test(errorText)
  if (!ok) { failures += 1; console.log(`СБОЙ ${chapter}: блоков ${total}, отрисовано ${rendered}`) }
  else console.log(`ok   ${chapter}: ${rendered}/${total}`)

  await page.close()
}

await browser.close()
server.kill('SIGTERM')
console.log(failures === 0 ? 'Все диаграммы отрисованы' : `Сбоев: ${failures}`)
process.exit(failures === 0 ? 0 : 1)
