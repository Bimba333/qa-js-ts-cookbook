/**
 * Проверка интерактивных блоков: запускаемый пример, карточка задачи,
 * песочница и схема должны читаться как одна семья.
 *
 * Проверяется не «красиво», а измеримое: одинаковая рамка и радиус, подпись
 * блока одним и тем же моноширинным стилем, отсутствие чужих фирменных цветов
 * (правило книги — синий единственный акцент, зелёный и красный только для
 * результата проверки) и ограниченная высота схемы.
 */
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import net from 'node:net'

const EXAMPLE_CHAPTER = '/docs/01-javascript/52-filter'
const TASK_CHAPTER = '/docs/01-javascript/07-scope'

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
  up = await reachable(`${base}${EXAMPLE_CHAPTER}`)
}
if (!up) { server.kill('SIGKILL'); throw new Error('предпросмотр не поднялся') }

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

// Главы книги платные: проверка блоков не про доступ, поэтому состояние
// подписчика ставится до загрузки страницы.
await context.addInitScript(() => {
  const until = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  window.localStorage.setItem('book:sync-session:v1', JSON.stringify({
    token: 'blocks-check', email: 'blocks@check.test'
  }))
  window.localStorage.setItem('book:entitlement:v1', JSON.stringify({
    subscribed: true, plan: 'check', validUntil: until, checkedAt: until
  }))
})

const page = await context.newPage()

const failures = []
const check = (name, condition, detail) => {
  if (condition) console.log(`  ✓  ${name}`)
  else {
    console.log(`  ✕  ${name}${detail === undefined ? '' : ` (${detail})`}`)
    failures.push(name)
  }
}

await page.goto(`${base}${EXAMPLE_CHAPTER}`, { waitUntil: 'load' })
await page.waitForTimeout(1200)

const blocks = await page.evaluate(() => {
  const visible = selector => [...document.querySelectorAll(selector)].filter(node => node.offsetParent !== null)
  const box = node => {
    const style = getComputedStyle(node)

    return {
      radius: style.borderTopLeftRadius,
      borderWidth: style.borderTopWidth,
      height: Math.round(node.getBoundingClientRect().height)
    }
  }

  const runners = visible('.code-runner')
  const charts = visible('.book-mermaid')
  const labels = visible('.book-block__label, .code-runner__badge')

  return {
    runner: runners[0] ? box(runners[0]) : null,
    runnerHeights: runners.map(node => Math.round(node.getBoundingClientRect().height)),
    chart: charts[0] ? box(charts[0]) : null,
    chartSvgHeight: charts[0]?.querySelector('svg')
      ? Math.round(charts[0].querySelector('svg').getBoundingClientRect().height)
      : null,
    labelStyles: labels.map(node => {
      const style = getComputedStyle(node)

      return `${style.fontFamily.split(',')[0]}|${style.fontSize}|${style.textTransform}`
    }),
    badgeBackground: visible('.code-runner__badge')[0]
      ? getComputedStyle(visible('.code-runner__badge')[0]).backgroundColor
      : null,
    docHeight: document.documentElement.scrollHeight
  }
})

check('у примера и схемы одинаковая рамка',
  blocks.runner?.borderWidth === blocks.chart?.borderWidth,
  `${blocks.runner?.borderWidth} против ${blocks.chart?.borderWidth}`)
check('у примера и схемы одинаковый радиус',
  blocks.runner?.radius === blocks.chart?.radius,
  `${blocks.runner?.radius} против ${blocks.chart?.radius}`)
check('подписи блоков оформлены одинаково',
  new Set(blocks.labelStyles).size === 1, blocks.labelStyles.join(' / '))
check('метка языка не приносит чужой фирменный цвет',
  blocks.badgeBackground === 'rgba(0, 0, 0, 0)', blocks.badgeBackground)
check('высота схемы в тексте ограничена',
  blocks.chartSvgHeight !== null && blocks.chartSvgHeight <= 430, `${blocks.chartSvgHeight}`)
check('пример из десятка строк укладывается в 400 пикселей',
  Math.max(...blocks.runnerHeights) <= 400, `${Math.max(...blocks.runnerHeights)}`)

// Схема открывается в просмотрщике: именно поэтому высоту в тексте можно
// ограничивать без потери подробностей.
await page.locator('.book-mermaid__open').first().click()
await page.waitForTimeout(400)
check('схема открывается во весь экран', (await page.locator('.book-mermaid-viewer').count()) === 1)
await page.keyboard.press('Escape')
await page.waitForTimeout(200)

// Карточка задачи — того же семейства.
await page.goto(`${base}${TASK_CHAPTER}`, { waitUntil: 'load' })
await page.waitForTimeout(900)

const steps = page.locator('.chapter-steps__step')

if ((await steps.count()) > 1) {
  await steps.nth(2).click()
  await page.waitForTimeout(700)

  const task = await page.evaluate(() => {
    const card = [...document.querySelectorAll('.code-task')].find(node => node.offsetParent !== null)

    if (!card) return null

    const style = getComputedStyle(card)
    const badge = card.querySelector('.code-task__badge')

    return {
      radius: style.borderTopLeftRadius,
      badge: badge
        ? `${getComputedStyle(badge).fontFamily.split(',')[0]}|${getComputedStyle(badge).fontSize}`
        : null
    }
  })

  check('карточка задачи в том же семействе', task !== null && task.radius === blocks.runner?.radius,
    `${task?.radius} против ${blocks.runner?.radius}`)
  check('метки задачи моноширинные 11px', task?.badge?.includes('11px'), task?.badge)
}

await browser.close()
server.kill('SIGKILL')

console.log('')
console.log(`Справка: примеры ${blocks.runnerHeights.join(', ')} px; схема ${blocks.chartSvgHeight} px`)

if (failures.length > 0) {
  console.log(`Не пройдено: ${failures.length}`)
  process.exitCode = 1
} else {
  console.log('Итог: все проверки пройдены')
}
