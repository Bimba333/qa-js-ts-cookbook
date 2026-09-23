import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DIST = path.join(ROOT, '.vitepress', 'dist')
const errors = []

function fail(message) {
  errors.push(message)
}

function exists(filePath) {
  return fs.existsSync(filePath)
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function walk(dir) {
  if (!exists(dir)) {
    return []
  }

  const result = []

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      result.push(...walk(fullPath))
    } else {
      result.push(fullPath)
    }
  }

  return result
}

function htmlForMarkdown(markdownPath) {
  return path.join(DIST, markdownPath.replace(/^docs\//, 'docs/').replace(/\.md$/, '.html'))
}

const indexPath = path.join(DIST, 'index.html')

if (!exists(indexPath)) {
  fail('Не найден .vitepress/dist/index.html')
} else {
  const indexHtml = read(indexPath)

  // Главная — рабочий стол: она должна показывать объём книги и вход в работу.
  // Блок статистики из плагина на ней больше не нужен: числа считает компонент.
  if (!indexHtml.includes('home-board__title')) {
    fail('На главной странице нет рабочего стола')
  }

  if (!indexHtml.includes('home-board__facts')) {
    fail('На главной странице нет сводки по объёму книги')
  }

  if (!/Начать с введения|Продолжить/.test(indexHtml)) {
    fail('На главной странице нет входа в работу')
  }
}

// Английская главная осталась на прежней раскладке: у неё свой блок статистики.
const enIndexPath = path.join(DIST, 'en', 'index.html')

if (exists(enIndexPath) && !read(enIndexPath).includes('book-stats')) {
  fail('На английской главной нет блока статистики книги')
}

const jsHtmlFiles = walk(path.join(DIST, 'docs', '01-javascript'))
  .filter(file => file.endsWith('.html'))

if (!jsHtmlFiles.length) {
  fail('Не найдена ни одна собранная JavaScript-глава')
}

const sampleChapter = 'docs/01-javascript/01-what-is-javascript.md'
const sampleHtmlPath = htmlForMarkdown(sampleChapter)

if (!exists(sampleHtmlPath)) {
  fail(`Не найдена собранная проверочная глава: ${sampleHtmlPath}`)
} else {
  const html = read(sampleHtmlPath)
  const solutionPath = sampleChapter.replace(/^docs\//, 'solutions/')

  if (!html.includes('book-chapter-card')) {
    fail('В проверочной JavaScript-главе нет карточки главы Book Engine')
  }

  if (!html.includes('book-chapter-card__progress')) {
    fail('В проверочной JavaScript-главе нет индикатора прогресса Book Engine')
  }

  if (!html.includes('book-embedded--practice')) {
    fail('В проверочной JavaScript-главе нет встроенного блока практики')
  }

  if (!html.includes('code-runner')) {
    fail('В проверочной JavaScript-главе нет признаков CodeRunner')
  }

  if (!html.includes('Запустить')) {
    fail('В проверочной JavaScript-главе нет кнопки запуска CodeRunner')
  }

  if (exists(path.join(ROOT, solutionPath)) && !html.includes('book-answer')) {
    fail('Для проверочной JavaScript-главы есть решения, но в HTML нет book-answer')
  }

  for (const rawPath of ['practice/01-javascript', 'solutions/01-javascript']) {
    if (html.includes(rawPath)) {
      fail(`В HTML найден сырой путь: ${rawPath}`)
    }
  }

  if (html.includes('```mermaid')) {
    fail('В HTML найден сырой Mermaid-блок')
  }
}

if (errors.length) {
  console.error('Smoke build failed:')

  for (const error of errors) {
    console.error(`- ${error}`)
  }

  process.exit(1)
}

console.log('Smoke build passed')
