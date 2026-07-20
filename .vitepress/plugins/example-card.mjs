import fs from 'node:fs'
import path from 'node:path'
import { bookEngineData } from '../book.generated.mjs'

const BOOK_BASE = '/qa-js-ts-cookbook/'
const EMBED_TYPES = new Set(['practice', 'solutions'])

// Локаль страницы определяется префиксом пути: en/docs/... — английская
// версия, docs/... — русская (root-локаль).
function localeOf(pagePath) {
  return String(pagePath || '').startsWith('en/') ? 'en' : 'ru'
}

// Английские страницы лежат в en/docs|practice|solutions/..., но метаданные
// главы, счетчики и структура берутся из русского движка по базовому пути
// без префикса локали.
function basePath(pagePath) {
  return String(pagePath || '').replace(/^en\//, '')
}

// Строки интерфейса, которые плагин вставляет в отрендеренный HTML.
const UI = {
  ru: {
    readingSuffix: 'мин чтения',
    examples: 'Примеров',
    tasks: 'Задач',
    diagrams: 'Диаграмм',
    tasksHeading: 'Задачи',
    tasksHeadingId: 'задачи',
    chapterProgressLabel: 'Прогресс части книги',
    chapterInfoLabel: 'Информация о главе',
    of: 'из',
    chapters: 'глав',
    part: label => (label === 'Введение' ? 'Введение' : `Часть «${escapeHtml(label)}»`),
    showAnswer: 'Показать ответ',
    example: 'Пример',
    exampleGeneric: 'Пример'
  },
  en: {
    readingSuffix: 'min read',
    examples: 'Examples',
    tasks: 'Tasks',
    diagrams: 'Diagrams',
    tasksHeading: 'Tasks',
    tasksHeadingId: 'tasks',
    chapterProgressLabel: 'Book part progress',
    chapterInfoLabel: 'Chapter information',
    of: 'of',
    chapters: 'chapters',
    part: label => {
      const map = { 'Введение': 'Introduction', 'Финальный проект': 'Final Project' }
      const en = map[label] || label
      return en === 'Introduction' ? 'Introduction' : `Part «${escapeHtml(en)}»`
    },
    showAnswer: 'Show answer',
    example: 'Example',
    exampleGeneric: 'Example'
  }
}

function ui(locale) {
  return UI[locale] || UI.ru
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function normalizePagePath(value) {
  if (!value) {
    return ''
  }

  let result = String(value)

  if (path.isAbsolute(result)) {
    result = path.relative(process.cwd(), result)
  }

  result = result.replace(/\\/g, '/').replace(/^\//, '')

  if (result.endsWith('.html')) {
    result = result.replace(/\.html$/, '.md')
  }

  if (!result.endsWith('.md')) {
    result = `${result}.md`
  }

  return result
}

function pagePathFromEnv(env) {
  const candidates = [
    env.relativePath,
    env.path,
    env.filePath,
    env.id
  ]

  for (const candidate of candidates) {
    const normalized = normalizePagePath(candidate)

    if (
      bookEngineData.chapters[basePath(normalized)] ||
      normalized === 'index.md' ||
      normalized === 'en/index.md'
    ) {
      return normalized
    }
  }

  return ''
}

function renderBookStat(label, value) {
  return `
    <div class="book-stat">
      <div class="book-stat__value">${escapeHtml(value)}</div>
      <div class="book-stat__label">${escapeHtml(label)}</div>
    </div>
`
}

const STATS_LABELS = {
  ru: {
    heading: 'Статистика книги',
    chapters: 'Всего глав',
    tasks: 'Всего задач',
    solutions: 'Всего решений',
    examples: 'Всего примеров',
    mermaid: 'Всего Mermaid',
    miniProjects: 'Всего мини-проектов',
    reading: 'Общее время чтения',
    minutes: min => `${min} минут`
  },
  en: {
    heading: 'Book at a glance',
    chapters: 'Chapters',
    tasks: 'Tasks',
    solutions: 'Solutions',
    examples: 'Examples',
    mermaid: 'Mermaid diagrams',
    miniProjects: 'Mini-projects',
    reading: 'Total reading time',
    minutes: min => `${min} min`
  }
}

function renderBookStats(locale = 'ru') {
  const stats = bookEngineData.statistics
  const t = STATS_LABELS[locale] || STATS_LABELS.ru

  return `
<section class="book-stats" aria-label="${t.heading}">
  <h2>${t.heading}</h2>
  <div class="book-stats__grid">
    ${renderBookStat(t.chapters, stats.chapters)}
    ${renderBookStat(t.tasks, stats.tasks)}
    ${renderBookStat(t.solutions, stats.solutions)}
    ${renderBookStat(t.examples, stats.examples)}
    ${renderBookStat(t.mermaid, stats.mermaid)}
    ${renderBookStat(t.miniProjects, stats.miniProjects)}
    ${renderBookStat(t.reading, t.minutes(stats.readingMinutes))}
  </div>
</section>
`
}

function localizedChapterLabel(label, locale) {
  if (locale !== 'en') {
    return label
  }

  return String(label)
    .replace(/^Глава\b/, 'Chapter')
    .replace(/^Раздел\b/, 'Section')
}

function renderChapterCard(chapter, locale = 'ru', displayTitle) {
  if (!chapter?.card) {
    return ''
  }

  const t = ui(locale)
  const meta = [`<span>⏱ ${chapter.card.reading} ${t.readingSuffix}</span>`]

  if (chapter.card.examples) {
    meta.push(`<span>📄 ${t.examples}: ${chapter.card.examples}</span>`)
  }

  if (chapter.card.tasks) {
    meta.push(`<span>📝 ${t.tasks}: ${chapter.card.tasks}</span>`)
  }

  if (chapter.card.mermaid) {
    meta.push(`<span>📊 ${t.diagrams}: ${chapter.card.mermaid}</span>`)
  }

  let progress = ''

  if (chapter.progress) {
    const { label, current, total } = chapter.progress
    const percent = Math.round((current / total) * 100)
    const partLabel = t.part(label)

    progress = `
      <div class="book-chapter-card__progress" aria-label="${t.chapterProgressLabel}">
        <div class="book-chapter-card__progress-track"><i style="width:${percent}%"></i></div>
        <span class="book-chapter-card__progress-text">${partLabel}: ${current} ${t.of} ${total} ${t.chapters}</span>
      </div>
`
  }

  const title = displayTitle || chapter.card.title

  return `
<section class="book-chapter-card" aria-label="${t.chapterInfoLabel}">
  <div class="book-chapter-card__eyebrow">${escapeHtml(localizedChapterLabel(chapter.card.chapterLabel, locale))}</div>
  <h1 class="book-chapter-card__title">${escapeHtml(title)}</h1>
  <div class="book-chapter-card__meta">
    ${meta.join('\n    ')}
  </div>
  ${progress}
</section>
`
}

function htmlToken(state, content) {
  const token = new state.Token('html_block', '', 0)
  token.content = content
  return token
}

// Служебные секции глав, которые не должны попадать на сайт: вводные
// сноски перед теорией утомляют, время чтения есть в карточке главы,
// а для переходов есть кнопки внизу страницы.
const HIDDEN_SECTION_TITLES = new Set([
  'Время изучения',
  'Навигация',
  'Связь с предыдущей главой',
  'Предварительные требования',
  'Цели обучения',
  'Цель главы',
  'Мотивация',
  // Английские эквиваленты служебных секций — прячем так же, как русские.
  'Study time',
  'Navigation',
  'Link to the previous chapter',
  'Prerequisites',
  'Learning goals',
  'Chapter goal',
  'Motivation'
])

function hideServiceSections(state) {
  const tokens = state.tokens

  for (let i = 0; i < tokens.length - 2; i++) {
    const open = tokens[i]
    const inline = tokens[i + 1]
    const close = tokens[i + 2]

    if (
      open.type !== 'heading_open' ||
      open.tag !== 'h2' ||
      inline.type !== 'inline' ||
      !HIDDEN_SECTION_TITLES.has(inline.content.trim()) ||
      close.type !== 'heading_close'
    ) {
      continue
    }

    for (let j = i; j < tokens.length; j++) {
      const token = tokens[j]

      if (j > i && token.type === 'heading_open' && (token.tag === 'h1' || token.tag === 'h2')) {
        break
      }

      token.hidden = true

      if (token.type === 'inline') {
        token.content = ''
        token.children = []
      }
    }
  }
}

function titleFromFile(filePath) {
  return path
    .basename(filePath)
    .replace(/\.(md|js|ts|json)$/, '')
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function titleFromMarkdown(filePath) {
  const absPath = path.join(process.cwd(), filePath)

  if (!fs.existsSync(absPath)) {
    return titleFromFile(filePath)
  }

  const content = fs.readFileSync(absPath, 'utf8')
  const heading = content.match(/^#\s+(.+)$/m)

  return heading ? heading[1].trim() : titleFromFile(filePath)
}

function chapterNumberFromPath(filePath) {
  const match = path.basename(filePath).match(/^(\d+)-/)
  return match ? Number(match[1]) : null
}

function exampleTitle(filePath, locale = 'ru') {
  const n = chapterNumberFromPath(filePath)
  const title = titleFromFile(filePath)
  const t = ui(locale)

  return n ? `${t.example} ${n}. ${title}` : `${t.exampleGeneric}. ${title}`
}

function stripFirstHeading(markdown) {
  return markdown.replace(/^#\s+.+\n+/, '')
}

function demoteHeadings(markdown) {
  return markdown.replace(/^(#{1,5})\s+/gm, '#$1 ')
}

function normalizeTitle(value) {
  return value
    .toLowerCase()
    .replace(/перед запуском/g, '')
    .replace(/[ё]/g, 'е')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

function splitByHeading(markdown, level) {
  const marker = '#'.repeat(level)
  const lines = markdown.split('\n')
  const sections = []
  let current = null

  for (const line of lines) {
    const match = line.match(new RegExp(`^${marker}\\s+(.+)$`))

    if (match) {
      if (current) {
        sections.push(current)
      }

      current = {
        title: match[1].trim(),
        body: []
      }

      continue
    }

    if (current) {
      current.body.push(line)
    } else if (line.trim()) {
      current = {
        title: '',
        body: [line]
      }
    }
  }

  if (current) {
    sections.push(current)
  }

  return sections
}

function renderAnswerDetails(md, markdown, env) {
  const rendered = md.render(markdown.trim(), {
    ...env,
    embeddedMarkdown: true,
    answerDetails: true
  })

  const summary = ui(env.bookLocale).showAnswer

  return `
<details class="book-answer">
  <summary>${summary}</summary>
  <div class="book-answer__content">
${rendered}
  </div>
</details>
`
}

function mergeSectionWithAnswers(md, practiceSection, solutionSection, env) {
  const practiceBody = practiceSection.body.join('\n').trimEnd()

  if (!solutionSection) {
    return `## ${practiceSection.title}\n\n${practiceBody}`.trimEnd()
  }

  const solutionBody = solutionSection.body.join('\n').trim()
  const practiceTasks = splitByHeading(practiceBody, 3)
  const solutionTasks = splitByHeading(solutionBody, 3)
  const hasPracticeTasks = practiceTasks.some(section => section.title)

  if (!hasPracticeTasks || !solutionTasks.length) {
    return `## ${practiceSection.title}\n\n${practiceBody}\n\n${renderAnswerDetails(md, solutionBody, env)}`.trimEnd()
  }

  const solutionsByTitle = new Map(
    solutionTasks
      .filter(section => section.title)
      .map(section => [normalizeTitle(section.title), section])
  )
  const used = new Set()
  const merged = []

  for (const task of practiceTasks) {
    if (!task.title) {
      merged.push(task.body.join('\n').trimEnd())
      continue
    }

    const key = normalizeTitle(task.title)
    const answer = solutionsByTitle.get(key)
    const taskMarkdown = `### ${task.title}\n\n${task.body.join('\n').trimEnd()}`.trimEnd()

    if (answer) {
      used.add(key)
      merged.push(`${taskMarkdown}\n\n${renderAnswerDetails(md, answer.body.join('\n'), env)}`)
    } else {
      merged.push(taskMarkdown)
    }
  }

  const remainingAnswers = solutionTasks
    .filter(section => section.title && !used.has(normalizeTitle(section.title)))
    .map(section => `### ${section.title}\n\n${section.body.join('\n').trimEnd()}`.trimEnd())
    .join('\n\n')

  if (remainingAnswers.trim()) {
    merged.push(renderAnswerDetails(md, remainingAnswers, env))
  }

  return `## ${practiceSection.title}\n\n${merged.filter(Boolean).join('\n\n')}`.trimEnd()
}

function solutionPathForPractice(filePath) {
  return filePath.replace(/(^|\/)practice\//, '$1solutions/')
}

function mergePracticeWithAnswers(md, practiceMarkdown, solutionMarkdown, env) {
  if (!solutionMarkdown) {
    return practiceMarkdown
  }

  const practice = stripFirstHeading(practiceMarkdown)
  const solution = stripFirstHeading(solutionMarkdown)
  const practiceSections = splitByHeading(practice, 2)
  const solutionSections = splitByHeading(solution, 2)
  const solutionsByTitle = new Map(
    solutionSections
      .filter(section => section.title)
      .map(section => [normalizeTitle(section.title), section])
  )

  return practiceSections
    .map(section => mergeSectionWithAnswers(
      md,
      section,
      solutionsByTitle.get(normalizeTitle(section.title)),
      env
    ))
    .join('\n\n')
}

function markdownPathType(filePath) {
  if (filePath.startsWith('practice/')) return 'practice'
  if (filePath.startsWith('solutions/')) return 'solutions'
  if (filePath.startsWith('docs/')) return 'docs'
  return ''
}

function readMarkdown(filePath) {
  const absPath = path.join(process.cwd(), filePath)

  if (!fs.existsSync(absPath)) {
    return ''
  }

  return fs.readFileSync(absPath, 'utf8')
}

function renderEmbeddedMarkdown(md, filePath, type, env) {
  const markdown = readMarkdown(filePath)

  if (!markdown || !stripFirstHeading(markdown).trim()) {
    return ''
  }

  const solutionPath = type === 'practice' ? solutionPathForPractice(filePath) : ''
  const solutionMarkdown = solutionPath ? readMarkdown(solutionPath) : ''
  const sourceMarkdown = type === 'practice'
    ? mergePracticeWithAnswers(md, markdown, solutionMarkdown, env)
    : stripFirstHeading(markdown)
  const title = ''
  const normalized = demoteHeadings(sourceMarkdown)

  if (solutionPath && solutionMarkdown) {
    env.inlineSolutionPaths ||= new Set()
    env.inlineSolutionPaths.add(solutionPath)
  }

  const rendered = md.render(normalized, {
    ...env,
    embeddedMarkdown: true,
    embeddedSource: filePath
  })
    .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gs, '<div class="book-embedded__heading">$1</div>')
    .replace(/<a class="header-anchor"[^>]*>.*?<\/a>/gs, '')

  return `
<section class="book-embedded book-embedded--${type}">
  ${title}
  ${rendered}
</section>
`
}

function renderTheoryCard(md, filePath) {
  const title = titleFromMarkdown(filePath)
  const chapterNumber = chapterNumberFromPath(filePath)
  const label = chapterNumber ? 'Глава книги' : 'Раздел книги'
  const href = `${BOOK_BASE}${filePath.replace(/\.md$/, '')}`

  return `
<div class="book-link-card">
  <div class="book-link-card__eyebrow">${label}</div>
  <div class="book-link-card__title">${md.utils.escapeHtml(title)}</div>
  <a class="book-link-card__button" href="${href}">Открыть</a>
</div>
`
}

function isExampleFile(filePath) {
  return /^examples\/.+\.(js|mjs|cjs|ts|json)$/.test(filePath)
}

function isExampleDir(filePath) {
  return /^examples\/.+\/$/.test(filePath)
}

function exampleFilesFromDir(dirPath) {
  const absPath = path.join(process.cwd(), dirPath)

  if (!fs.existsSync(absPath) || !fs.statSync(absPath).isDirectory()) {
    return []
  }

  return fs
    .readdirSync(absPath)
    .filter(file => /\.(js|mjs|cjs|ts|json)$/.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map(file => `${dirPath}${file}`)
}

function renderExample(md, filePath, env) {
  const absPath = path.join(process.cwd(), filePath)

  if (!fs.existsSync(absPath)) {
    return '<div class="example-card">Пример не найден.</div>'
  }

  // JSON — данные, а не исполняемый код: показываем без кнопки запуска.
  if (/\.json$/.test(filePath)) {
    return renderStaticExample(md, filePath, env.bookLocale)
  }

  env.embeddedExamples ||= new Set()
  env.embeddedExamples.add(filePath)

  const source = fs.readFileSync(absPath, 'utf8')
  const sourceB64 = Buffer.from(source, 'utf8').toString('base64')
  const title = exampleTitle(filePath, env.bookLocale)
  const lang = /\.ts$/.test(filePath) ? 'ts' : 'js'

  return `
<CodeRunner
  title="${md.utils.escapeHtml(title)}"
  source-b64="${sourceB64}"
  lang="${lang}"
  readonly
/>
`
}

function renderExampleDir(md, dirPath, env) {
  const files = exampleFilesFromDir(dirPath)

  if (!files.length) {
    return ''
  }

  env.embeddedExampleDirs ||= new Set()
  env.embeddedExampleDirs.add(dirPath)

  return files.map(file => renderExample(md, file, env)).join('\n')
}

function isNodeExampleCommand(line) {
  return /^(node|tsc|npx tsc|npx tsx|tsx|ts-node|npx ts-node) examples\/.+\.(js|mjs|cjs|ts|json)$/.test(line.trim())
}

function examplePathFromNodeCommand(line) {
  return line.trim().replace(/^(npx\s+)?(node|tsc|tsx|ts-node)\s+/, '')
}

function renderNodeExampleCommands(md, content, env) {
  const lines = content
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  if (!lines.length || !lines.every(isNodeExampleCommand)) {
    return null
  }

  const rendered = []

  for (const line of lines) {
    const filePath = examplePathFromNodeCommand(line)

    if (env.embeddedExamples?.has(filePath)) {
      continue
    }

    rendered.push(renderExample(md, filePath, env))
  }

  return rendered.join('\n')
}

function shouldHideSupportParagraph(content) {
  const text = content.trim()

  return /^(Практика|Решения|Примеры)( к этой главе)? наход(ится|ятся) в(( отдельном)? файле|( отдельной)? папке)?:?$/.test(text) ||
    /^Запуск:$/.test(text) ||
    /^Файл:$/.test(text) ||
    /^Создайте файл:?$/.test(text) ||
    /^Создайте файл( в)? `?playground\/[^`]*`?:?$/.test(text) ||
    /^Запускайте (их|команды|примеры) из корня проекта\.?$/.test(text) ||
    /^(Команда запуска|Запустите|Запуск) из корня проекта:?\.?$/.test(text)
}

function isSupportHeading(content) {
  return /^(Практика|Решения|Примеры)$/.test(content.trim())
}

function setTokenAttr(token, name, value) {
  if (!token) return

  const index = token.attrIndex(name)

  if (index >= 0) {
    token.attrs[index][1] = value
  } else {
    token.attrPush([name, value])
  }
}

function renameInlineToken(token, value) {
  token.content = value

  if (!token.children?.length) {
    return
  }

  let textWasSet = false

  for (const child of token.children) {
    if (!textWasSet && child.type === 'text') {
      child.content = value
      child.hidden = false
      textWasSet = true
      continue
    }

    child.content = ''
    child.hidden = true
  }
}

function publicLabelForPath(value) {
  if (/^docs\//.test(value) || value === 'docs/') return 'глава книги'
  if (/^practice\//.test(value) || value === 'practice/') return 'практика'
  if (/^solutions\//.test(value) || value === 'solutions/') return 'решения'
  if (/^examples\//.test(value) || value === 'examples/') return 'пример'
  if (/^playground\//.test(value) || value === 'playground/') return 'песочница'
  return value
}

function sanitizeRepositoryPaths(content) {
  return content
    .replace(/\bdocs\/[^\s`]*/g, 'глава книги')
    .replace(/\bpractice\/[^\s`]*/g, 'практика')
    .replace(/\bsolutions\/[^\s`]*/g, 'решения')
    .replace(/\bexamples\/[^\s`]*/g, 'пример')
    .replace(/\bplayground\/[^\s`]*/g, 'песочница')
    .replace(/^docs\/$/gm, 'Главы книги')
    .replace(/^practice\/$/gm, 'Практика')
    .replace(/^solutions\/$/gm, 'Решения')
    .replace(/^examples\/$/gm, 'Примеры')
    .replace(/^playground\/$/gm, 'Песочница')
}

function renderStaticExample(md, filePath, locale = 'ru') {
  const absPath = path.join(process.cwd(), filePath)

  if (!fs.existsSync(absPath)) {
    return ''
  }

  const source = stripRepositoryDirs(fs.readFileSync(absPath, 'utf8'))
  const title = exampleTitle(filePath, locale)

  return `
<div class="book-static-example">
  <div class="book-static-example__title">${md.utils.escapeHtml(title)}</div>
  <pre v-pre><code>${md.utils.escapeHtml(source)}</code></pre>
</div>
`
}

function stripRepositoryDirs(content) {
  return content.replace(/(\.\.\/)*\b(docs|practice|solutions|examples|playground)\/(?:[\w.-]+\/)*/g, '')
}

function renderMermaid(md, content) {
  const sourceB64 = Buffer.from(content, 'utf8').toString('base64')

  return `
<MermaidChart source-b64="${sourceB64}" />
`
}

export function exampleCardPlugin(md) {
  const defaultFence = md.renderer.rules.fence
  const defaultCodeInline = md.renderer.rules.code_inline

  md.core.ruler.after('inline', 'book_engine_blocks', state => {
    if (state.env.embeddedMarkdown) {
      return
    }

    const currentPath = pagePathFromEnv(state.env)
    const locale = localeOf(currentPath)
    const base = basePath(currentPath)
    // Пробрасываем локаль во вложенные md.render (практика, решения, ответы).
    state.env.bookLocale = locale

    if (base === 'index.md') {
      const insertAfter = state.tokens.findIndex(token => token.type === 'heading_close' && token.tag === 'h1')
      const stats = htmlToken(state, renderBookStats(locale))

      if (insertAfter >= 0) {
        state.tokens.splice(insertAfter + 1, 0, stats)
      } else {
        state.tokens.unshift(stats)
      }

      return
    }

    const chapter = bookEngineData.chapters[base]

    if (!chapter) {
      return
    }

    const h1Index = state.tokens.findIndex(token => token.type === 'heading_open' && token.tag === 'h1')

    // Заголовок h1 переведенной страницы используем как название в карточке.
    let displayTitle
    if (h1Index >= 0) {
      if (locale === 'en') {
        const heading = state.tokens[h1Index + 1].content.trim()
        if (heading) {
          displayTitle = heading
        }
      }

      state.tokens[h1Index].hidden = true
      state.tokens[h1Index + 1].hidden = true
      // markdown-it рендерит children inline-токена напрямую, поэтому
      // одного hidden недостаточно — очищаем содержимое заголовка.
      state.tokens[h1Index + 1].content = ''
      state.tokens[h1Index + 1].children = []
      state.tokens[h1Index + 2].hidden = true
    }

    state.tokens.unshift(htmlToken(state, renderChapterCard(chapter, locale, displayTitle)))

    // Новые главы не ссылаются на файл практики явно — подключаем задачи
    // автоматически, если файл практики существует и не пуст.
    const practicePrefix = locale === 'en' ? 'en/practice/' : 'practice/'
    const hasPracticeFence = state.tokens.some(
      token => token.type === 'fence' && new RegExp(`^(en/)?practice/`).test(token.content.trim())
    )

    if (!hasPracticeFence) {
      const practicePath = base.replace(/^docs\//, practicePrefix)
      const embedded = renderEmbeddedMarkdown(md, practicePath, 'practice', state.env)

      if (embedded) {
        const t = ui(locale)
        state.tokens.push(
          htmlToken(state, `<h2 id="${t.tasksHeadingId}" tabindex="-1">${t.tasksHeading}</h2>`),
          htmlToken(state, embedded)
        )
      }
    }
  })

  md.core.ruler.after('book_engine_blocks', 'book_hide_service_sections', state => {
    if (state.env.embeddedMarkdown) {
      return
    }

    hideServiceSections(state)
  })

  md.core.ruler.after('inline', 'book_hide_repository_labels', state => {
    if (PATH_SANITIZE_EXEMPT.has(pagePathFromEnv(state.env))) {
      return
    }

    for (let i = 0; i < state.tokens.length - 2; i++) {
      const open = state.tokens[i]
      const inline = state.tokens[i + 1]
      const close = state.tokens[i + 2]

      if (
        open.type === 'paragraph_open' &&
        inline.type === 'inline' &&
        close.type === 'paragraph_close' &&
        shouldHideSupportParagraph(inline.content)
      ) {
        open.hidden = true
        inline.hidden = true
        inline.content = ''
        inline.children = []
        close.hidden = true

        const headingOpen = state.tokens[i - 3]
        const headingInline = state.tokens[i - 2]
        const headingClose = state.tokens[i - 1]

        if (
          headingOpen?.type === 'heading_open' &&
          headingInline?.type === 'inline' &&
          headingClose?.type === 'heading_close' &&
          isSupportHeading(headingInline.content)
        ) {
          if (headingInline.content.trim() === 'Практика') {
            renameInlineToken(headingInline, 'Задачи')
            setTokenAttr(headingOpen, 'id', 'задачи')
          } else {
            headingOpen.hidden = true
            headingInline.hidden = true
            headingInline.content = ''
            headingInline.children = []
            headingClose.hidden = true
          }
        }
      }
    }
  })

  // В главе про рабочее окружение пути вида playground/hello.js — учебный
  // материал про файловую систему, а не ссылки на файлы репозитория.
  const PATH_SANITIZE_EXEMPT = new Set([
    'docs/00-introduction/04-development-environment.md',
    'en/docs/00-introduction/04-development-environment.md'
  ])

  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    if (PATH_SANITIZE_EXEMPT.has(pagePathFromEnv(env))) {
      return defaultCodeInline
        ? defaultCodeInline(tokens, idx, options, env, self)
        : `<code>${md.utils.escapeHtml(token.content)}</code>`
    }

    if (/^(docs|practice|solutions|examples|playground)\//.test(token.content)) {
      return `<code>${md.utils.escapeHtml(publicLabelForPath(token.content))}</code>`
    }

    return defaultCodeInline
      ? defaultCodeInline(tokens, idx, options, env, self)
      : `<code>${md.utils.escapeHtml(token.content)}</code>`
  }

  const defaultInline = md.renderer.rules.inline

  md.renderer.rules.inline = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    if (token.hidden) {
      return ''
    }

    if (!PATH_SANITIZE_EXEMPT.has(pagePathFromEnv(env)) && shouldHideSupportParagraph(token.content)) {
      return ''
    }

    return defaultInline
      ? defaultInline(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

    if (token.hidden) {
      return ''
    }

    const content = token.content.trim()

    if (token.info.trim() === 'mermaid') {
      return renderMermaid(md, token.content)
    }

    if (PATH_SANITIZE_EXEMPT.has(pagePathFromEnv(env))) {
      // Пути в этой главе — учебный материал, но практика и решения
      // встраиваются как обычно.
      if (/^practice\/.+\.md$/.test(content)) {
        return renderEmbeddedMarkdown(md, content, 'practice', env)
      }

      if (/^solutions\/.+\.md$/.test(content)) {
        return ''
      }

      return defaultFence(tokens, idx, options, env, self)
    }

    const nodeCommandExamples = renderNodeExampleCommands(md, content, env)

    if (nodeCommandExamples !== null) {
      return nodeCommandExamples
    }

    const isShellFence = /^(bash|sh|shell|zsh|console|cmd)$/.test(token.info.trim())

    if (isShellFence && /\b(docs|practice|solutions|examples|playground)\//.test(token.content)) {
      token.content = stripRepositoryDirs(token.content)
    }

    if (content.includes('\n')) {
      if ((token.info === '' || token.info === 'text') && /\b(docs|practice|solutions|examples|playground)\//.test(content)) {
        token.content = sanitizeRepositoryPaths(token.content)
      }

      return defaultFence(tokens, idx, options, env, self)
    }

    if (/^examples\/.+\.md$/.test(content)) {
      return ''
    }

    // Служебные файлы (support/) — инфраструктура примеров, не учебный контент.
    if (/^examples\/.+\/support\//.test(content)) {
      return ''
    }

    if (/^examples\/.+\.(yml|yaml|proto|sql|txt)$/.test(content)) {
      return renderStaticExample(md, content, env.bookLocale)
    }

    if ((token.info === '' || token.info === 'text') && /^(docs|practice|solutions|examples|playground)\/[^\s]*\/?$/.test(content) && !/\.(md|js|mjs|cjs|ts|json)$/.test(content) && !isExampleDir(content)) {
      return ''
    }

    const isMarkdownPath = /^(docs|practice|solutions)\/.+\.md$/.test(content)
    const isPlaygroundPath = /^playground\/.+\.(js|ts)$/.test(content)

    if (isMarkdownPath) {
      const type = markdownPathType(content)

      if (type === 'solutions') {
        return ''
      }

      if (EMBED_TYPES.has(type)) {
        return renderEmbeddedMarkdown(md, content, type, env)
      }

      return renderTheoryCard(md, content)
    }

    if (isExampleDir(content)) {
      return renderExampleDir(md, content, env)
    }

    if (isExampleFile(content)) {
      if (env.embeddedExamples?.has(content)) {
        return ''
      }

      return renderExample(md, content, env)
    }

    if (isPlaygroundPath) {
      if (env.answerDetails) {
        return ''
      }

      const title = 'Песочница'
      const template = `// Напишите здесь решение задачи и нажмите «Запустить».
console.log('Песочница готова к работе!')`

      const sourceB64 = Buffer.from(template, 'utf8').toString('base64')
      const lang = /\.ts$/.test(content) ? 'ts' : 'js'

      return `
<CodeRunner
  title="${md.utils.escapeHtml(title)}"
  source-b64="${sourceB64}"
  lang="${lang}"
/>
`
    }

    return defaultFence(tokens, idx, options, env, self)
  }
}
