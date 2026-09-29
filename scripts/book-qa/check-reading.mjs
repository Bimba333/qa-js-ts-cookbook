/**
 * Проверка условий чтения: мера строки, вертикальный ритм, плотность таблиц,
 * оглавление главы и полоса прочитанного.
 *
 * Числа здесь не выдуманы, а измерены до правок: строка 75 знаков при 17px/28px
 * уже была в норме, поэтому меру строки проверка ЗАЩИЩАЕТ, а не меняет. Правки
 * касались того, что мешало на самом деле — ориентира внутри главы на 30 000
 * пикселей и плотности таблиц.
 */
import { chromium } from '@playwright/test'
import { spawn } from 'node:child_process'
import net from 'node:net'

const LONG_CHAPTER = '/docs/01-javascript/07-scope'
const TABLE_CHAPTER = '/docs/01-javascript/06-variables'

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
  up = await reachable(`${base}${LONG_CHAPTER}`)
}
if (!up) { server.kill('SIGKILL'); throw new Error('предпросмотр не поднялся') }

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const failures = []
const check = (name, condition, detail) => {
  if (condition) console.log(`  ✓  ${name}`)
  else {
    console.log(`  ✕  ${name}${detail === undefined ? '' : ` (${detail})`}`)
    failures.push(name)
  }
}

await page.goto(`${base}${LONG_CHAPTER}`, { waitUntil: 'load' })
await page.waitForTimeout(800)

const reading = await page.evaluate(() => {
  const num = value => Math.round(parseFloat(value) * 10) / 10
  const paragraphs = [...document.querySelectorAll('.vp-doc p')].filter(node => node.offsetParent !== null)
  const long = paragraphs.find(node => node.textContent.length > 200) ?? paragraphs[0]
  const style = getComputedStyle(long)

  const probe = document.createElement('span')
  probe.textContent = 'абвгдежзийклмнопрстуфхцчшщъыьэюя'
  probe.style.font = style.font
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  document.body.append(probe)
  const charWidth = probe.getBoundingClientRect().width / 32
  probe.remove()

  let gap = null
  for (let index = 0; index < paragraphs.length - 1; index += 1) {
    const current = paragraphs[index].getBoundingClientRect()
    const nextOne = paragraphs[index + 1].getBoundingClientRect()

    if (nextOne.top > current.bottom && nextOne.top - current.bottom < 120) {
      gap = Math.round(nextOne.top - current.bottom)
      break
    }
  }

  // Списки самой главы, а не служебных компонентов.
  const contentList = [...document.querySelectorAll('.vp-doc > div > ul, .vp-doc > div > ol')]
    .find(list => list.offsetParent !== null && list.children.length > 1)

  return {
    charsPerLine: Math.round(long.getBoundingClientRect().width / charWidth),
    fontSize: num(style.fontSize),
    lineHeight: num(style.lineHeight),
    paragraphGap: gap,
    listSpacing: contentList ? num(getComputedStyle(contentList.children[1]).marginTop) : null,
    pageHeight: Math.round(document.documentElement.scrollHeight)
  }
})

check('мера строки в пределах 55–85 знаков',
  reading.charsPerLine >= 55 && reading.charsPerLine <= 85, `${reading.charsPerLine}`)
check('межстрочный интервал не меньше 1.5',
  reading.lineHeight / reading.fontSize >= 1.5,
  `${reading.lineHeight}/${reading.fontSize}`)
check('абзацы отделены сильнее, чем строки внутри абзаца',
  reading.paragraphGap >= reading.lineHeight, `${reading.paragraphGap} против ${reading.lineHeight}`)
check('пункты списка не слипаются',
  reading.listSpacing === null || reading.listSpacing >= 4, `${reading.listSpacing}`)

// Оглавление главы: длинная глава без ориентира и есть главная трудность чтения.
const outlineLinks = page.locator('.chapter-outline__list a')
check('у длинной главы есть оглавление', (await outlineLinks.count()) >= 3)

const targets = await outlineLinks.evaluateAll(links => links.map(link => link.getAttribute('href')))
const resolved = await page.evaluate(
  hashes => hashes.every(hash => document.querySelector(hash) !== null),
  targets
)
check('все ссылки оглавления ведут к существующим разделам', resolved)

check('оглавление показывает число разделов и долю прочитанного',
  /\d+ разделов · прочитано \d+%/.test(await page.locator('.chapter-outline__count').textContent()))

const barBefore = await page.locator('.chapter-outline__bar i').evaluate(node => node.style.width)
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2))
await page.waitForTimeout(400)
const barAfter = await page.locator('.chapter-outline__bar i').evaluate(node => node.style.width)
check('полоса прочитанного растёт при прокрутке',
  parseInt(barAfter, 10) > parseInt(barBefore, 10), `${barBefore} → ${barAfter}`)

// Оглавление следует за полосой шагов: у скрытого раздела ссылки быть не должно.
const stepButtons = page.locator('.chapter-steps__step')

if ((await stepButtons.count()) > 1) {
  const before = await outlineLinks.count()
  await stepButtons.last().click()
  await page.waitForTimeout(500)
  const after = await outlineLinks.count()

  check('оглавление следует за полосой шагов', after !== before, `${before} → ${after}`)
}

// Плотность таблиц: их в книге стало много, и читать их приходится глазами.
await page.goto(`${base}${TABLE_CHAPTER}`, { waitUntil: 'load' })
await page.waitForTimeout(700)

const table = await page.evaluate(() => {
  const cell = [...document.querySelectorAll('.vp-doc td')].find(node => node.offsetParent !== null)
  const header = [...document.querySelectorAll('.vp-doc th')].find(node => node.offsetParent !== null)

  if (!cell || !header) return null

  const row = cell.closest('tr')
  const rows = [...row.parentElement.children]
  const evenRow = rows[1] ?? null

  return {
    padding: getComputedStyle(cell).padding,
    headerAlign: getComputedStyle(header).textAlign,
    zebra: evenRow ? getComputedStyle(evenRow.querySelector('td')).backgroundColor : null
  }
})

check('в таблице есть отбивка ячеек', table !== null && /8px/.test(table.padding), table?.padding)
check('заголовки таблицы выровнены по левому краю', table?.headerAlign === 'left')
check('чётные строки таблицы подсвечены',
  table?.zebra !== null && table?.zebra !== 'rgba(0, 0, 0, 0)', table?.zebra)

await browser.close()
server.kill('SIGKILL')

console.log('')
console.log(`Справка: строка ${reading.charsPerLine} знаков, ${reading.fontSize}px/${reading.lineHeight}px, ` +
  `высота главы ${reading.pageHeight} px`)

if (failures.length > 0) {
  console.log(`Не пройдено: ${failures.length}`)
  process.exitCode = 1
} else {
  console.log('Итог: все проверки пройдены')
}
