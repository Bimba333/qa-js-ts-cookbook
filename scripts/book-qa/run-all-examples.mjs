/**
 * Прогоняет все запускаемые примеры книги так, как их видит читатель.
 *
 * Скрипт открывает собранные страницы глав, нажимает «Запустить» у каждого
 * примера и записывает вывод. Пример, который падает с ошибкой, — это дефект,
 * видимый читателю, поэтому проверка нужна постоянно, а не только при смене
 * движка выполнения.
 *
 * Результат сохраняется в снимок, чтобы сравнивать поведение до и после
 * изменений: `--out <файл>` задаёт путь, `--baseline <файл>` включает сверку.
 */
import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'

import { chromium } from '@playwright/test'

const ROOT = process.cwd()
const CONCURRENCY = Number(process.env.EXAMPLES_CONCURRENCY ?? 6)

function argValue(name) {
  const index = process.argv.indexOf(name)

  return index === -1 ? undefined : process.argv[index + 1]
}

const outputPath = argValue('--out')
const baselinePath = argValue('--baseline')

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
    return (await fetch(url)).ok
  } catch {
    return false
  }
}

/** Предпросмотр поднимается свой: чужой мог остаться от прежней сборки. */
async function startPreview() {
  const port = await findFreePort()
  const base = `http://127.0.0.1:${port}/qa-js-ts-cookbook`
  const server = spawn('npx', ['vitepress', 'preview', '.', '--port', String(port)], {
    stdio: 'ignore'
  })

  for (let attempt = 0; attempt < 60; attempt += 1) {
    await new Promise(resolve => setTimeout(resolve, 500))

    if (await isReachable(`${base}/docs/01-javascript/01-what-is-javascript`)) {
      return { base, stop: () => server.kill('SIGTERM') }
    }
  }

  server.kill('SIGKILL')
  throw new Error('Не удалось запустить предпросмотр. Сначала выполните npm run docs:build.')
}

/** Главы, в которые встроены примеры. */
function chapterPages() {
  const pages = new Set()

  const walk = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const full = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        walk(full)
        continue
      }

      if (!entry.name.endsWith('.md')) continue

      const markdown = fs.readFileSync(full, 'utf8')
      if (!/examples\/[\w./-]+\.(js|mjs|cjs|ts)/.test(markdown)) continue

      pages.add(path.relative(ROOT, full).replace(/\\/g, '/').replace(/\.md$/, ''))
    }
  }

  walk(path.join(ROOT, 'docs'))

  return [...pages].sort()
}

async function runChapter(context, base, chapter) {
  const page = await context.newPage()
  const records = []

  try {
    await page.goto(`${base}/${chapter}`, { waitUntil: 'load', timeout: 60_000 })

    const runners = page.locator('.code-runner')
    const total = await runners.count()

    for (let index = 0; index < total; index += 1) {
      const runner = runners.nth(index)
      const title = (await runner.locator('.code-runner__title').innerText())
        .replace(/\s+/g, ' ')
        .trim()

      // Node-only примеры показываются только для чтения и не запускаются.
      if ((await runner.locator('.code-runner__local-badge').count()) > 0) {
        records.push({ chapter, title, outcome: 'read-only', text: '' })
        continue
      }

      try {
        const outcomeLocator = runner.locator('.code-runner__output, .code-runner__error').first()

        // Клик может прийти раньше, чем Vue оживит страницу: тогда обработчик
        // ещё не привязан и нажатие пропадает. Поэтому попытка повторяется —
        // иначе гонка гидратации выглядела бы как сломанный пример.
        let settled = false

        for (let attempt = 0; attempt < 4 && !settled; attempt += 1) {
          await runner.locator('.code-runner__button').first().click({ timeout: 10_000 })

          try {
            await outcomeLocator.waitFor({ timeout: attempt === 3 ? 20_000 : 5_000 })
            settled = true
          } catch {
            settled = false
          }
        }

        if (!settled) {
          throw new Error('Пример не дал ни вывода, ни ошибки')
        }

        // Появление первой строки вывода ещё не означает конец выполнения:
        // отложенный вывод приходит позже. Ждём, пока кнопка снова станет
        // активной — это и есть признак завершённого прогона.
        const handle = await runner.elementHandle()

        try {
          await page.waitForFunction(
            element => {
              const button = element.querySelector('.code-runner__button')
              const hasResult = element.querySelector(
                '.code-runner__output, .code-runner__error'
              )

              return Boolean(hasResult) && Boolean(button) && !button.disabled
            },
            handle,
            { timeout: 25_000 }
          )
        } finally {
          await handle.dispose()
        }

        const hasError = (await runner.locator('.code-runner__error').count()) > 0
        const intentional = (await runner.locator('.code-runner__expected-note').count()) > 0
        const text = hasError
          ? (await runner.locator('.code-runner__error pre').innerText()).trim()
          : (await runner.locator('.code-runner__output pre').innerText()).trim()

        records.push({
          chapter,
          title,
          outcome: hasError ? (intentional ? 'intentional-error' : 'error') : 'ok',
          text
        })
      } catch (error) {
        records.push({
          chapter,
          title,
          outcome: 'no-result',
          text: error instanceof Error ? error.message : String(error)
        })
      }
    }
  } catch (error) {
    records.push({
      chapter,
      title: '(страница)',
      outcome: 'page-failed',
      text: error instanceof Error ? error.message : String(error)
    })
  } finally {
    await page.close()
  }

  return records
}

const preview = await startPreview()
const browser = await chromium.launch()
const chapters = chapterPages()
const results = []
let done = 0

try {
  const contexts = await Promise.all(
    Array.from({ length: CONCURRENCY }, () => browser.newContext())
  )
  const queue = [...chapters]

  await Promise.all(
    contexts.map(async context => {
      while (queue.length > 0) {
        const chapter = queue.shift()
        results.push(...(await runChapter(context, preview.base, chapter)))
        done += 1

        if (done % 25 === 0) {
          process.stdout.write(`  пройдено глав: ${done}/${chapters.length}\n`)
        }
      }

      await context.close()
    })
  )
} finally {
  await browser.close()
  preview.stop()
}

results.sort((left, right) =>
  `${left.chapter}${left.title}`.localeCompare(`${right.chapter}${right.title}`, 'ru')
)

const broken = results.filter(item => item.outcome === 'error' || item.outcome === 'no-result')
const pageFailures = results.filter(item => item.outcome === 'page-failed')
const intentional = results.filter(item => item.outcome === 'intentional-error')

const readOnly = results.filter(item => item.outcome === 'read-only')

console.log(`\nГлав с примерами: ${chapters.length}`)
console.log(`Блоков всего: ${results.length}`)
console.log(`Только для чтения (Node-only): ${readOnly.length}`)
console.log(`Запущено примеров: ${results.length - pageFailures.length - readOnly.length}`)
console.log(`Успешно: ${results.filter(item => item.outcome === 'ok').length}`)
console.log(`Намеренные ошибки (так задумано): ${intentional.length}`)
console.log(`Сломанные: ${broken.length}`)
console.log(`Не открылись страницы: ${pageFailures.length}`)

for (const item of [...pageFailures, ...broken]) {
  console.log(`\n  ✕ ${item.chapter}\n    ${item.title}\n    ${item.text.split('\n')[0]}`)
}

if (outputPath) {
  fs.writeFileSync(outputPath, `${JSON.stringify(results, null, 2)}\n`, 'utf8')
  console.log(`\nСнимок сохранён: ${path.relative(ROOT, outputPath)}`)
}

if (baselinePath) {
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'))
  const key = item => `${item.chapter}::${item.title}`
  const before = new Map(baseline.map(item => [key(item), item]))
  const changes = []

  for (const item of results) {
    const previous = before.get(key(item))

    if (!previous) {
      changes.push(`новый пример: ${key(item)}`)
      continue
    }

    if (previous.outcome !== item.outcome || previous.text !== item.text) {
      changes.push(
        `${key(item)}\n    было: ${previous.outcome} ${previous.text.split('\n')[0]}\n    стало: ${item.outcome} ${item.text.split('\n')[0]}`
      )
    }
  }

  console.log(`\nРасхождений с эталоном: ${changes.length}`)
  for (const change of changes) console.log(`  • ${change}`)

  if (changes.length > 0) process.exitCode = 1
}

if (broken.length > 0 || pageFailures.length > 0) process.exitCode = 1
