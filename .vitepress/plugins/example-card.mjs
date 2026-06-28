import fs from 'node:fs'
import path from 'node:path'

const BOOK_BASE = '/qa-javascript-book/'
const EMBED_TYPES = new Set(['practice', 'solutions'])

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

function exampleTitle(filePath) {
  const n = chapterNumberFromPath(filePath)
  const title = titleFromFile(filePath)

  return n ? `Пример ${n}. ${title}` : `Пример. ${title}`
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
    embeddedMarkdown: true
  })

  return `
<details class="book-answer">
  <summary>Ответ</summary>
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

  if (!practiceTasks.length || !solutionTasks.length) {
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
  return filePath.replace(/^practice\//, 'solutions/')
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

  if (!markdown) {
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
  return /^examples\/.+\.(js|ts|json)$/.test(filePath)
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
    .filter(file => /\.(js|ts|json)$/.test(file))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map(file => `${dirPath}${file}`)
}

function renderExample(md, filePath, env) {
  const absPath = path.join(process.cwd(), filePath)

  if (!fs.existsSync(absPath)) {
    return '<div class="example-card">Пример не найден.</div>'
  }

  env.embeddedExamples ||= new Set()
  env.embeddedExamples.add(filePath)

  const source = fs.readFileSync(absPath, 'utf8')
  const sourceB64 = Buffer.from(source, 'utf8').toString('base64')
  const title = exampleTitle(filePath)

  return `
<CodeRunner
  title="${md.utils.escapeHtml(title)}"
  source-b64="${sourceB64}"
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
  return /^node examples\/.+\.(js|ts|json)$/.test(line.trim())
}

function examplePathFromNodeCommand(line) {
  return line.trim().replace(/^node\s+/, '')
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
  return /^(Практика|Решения|Примеры) находятся в(?: отдельном)? файле:?$/.test(content.trim()) ||
    /^(Практика|Решения|Примеры) находится в(?: отдельном)? файле:?$/.test(content.trim()) ||
    /^(Практика|Решения|Примеры) к этой главе находится в(?: отдельном)? файле:?$/.test(content.trim()) ||
    /^(Практика|Решения|Примеры) к этой главе находятся в(?: отдельном)? файле:?$/.test(content.trim()) ||
    /^(Практика|Решения|Примеры) находятся в:?$/.test(content.trim()) ||
    /^(Практика|Решения|Примеры) находится в:?$/.test(content.trim()) ||
    /^Запуск:$/.test(content.trim())
}

function isSupportHeading(content) {
  return /^(Практика|Решения|Примеры)$/.test(content.trim())
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

function renderMermaid(md, content) {
  const sourceB64 = Buffer.from(content, 'utf8').toString('base64')

  return `
<MermaidChart source-b64="${sourceB64}" />
`
}

export function exampleCardPlugin(md) {
  const defaultFence = md.renderer.rules.fence
  const defaultCodeInline = md.renderer.rules.code_inline

  md.core.ruler.after('inline', 'book_hide_repository_labels', state => {
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
          headingOpen.hidden = true
          headingInline.hidden = true
          headingInline.content = ''
          headingInline.children = []
          headingClose.hidden = true
        }
      }
    }
  })

  md.renderer.rules.code_inline = (tokens, idx, options, env, self) => {
    const token = tokens[idx]

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

    if (shouldHideSupportParagraph(token.content)) {
      return ''
    }

    return defaultInline
      ? defaultInline(tokens, idx, options, env, self)
      : self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const content = token.content.trim()

    if (token.info.trim() === 'mermaid') {
      return renderMermaid(md, token.content)
    }

    const nodeCommandExamples = renderNodeExampleCommands(md, content, env)

    if (nodeCommandExamples !== null) {
      return nodeCommandExamples
    }

    if (content.includes('\n')) {
      if ((token.info === '' || token.info === 'text') && /\b(docs|practice|solutions|examples|playground)\//.test(content)) {
        token.content = sanitizeRepositoryPaths(token.content)
      }

      return defaultFence(tokens, idx, options, env, self)
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
      const title = 'Песочница'
      const template = `// Напишите код для задания.
console.log('Проверьте доступность process:', typeof process !== 'undefined')
console.log('Проверьте доступность document:', typeof document !== 'undefined')
console.log('Проверьте доступность window:', typeof window !== 'undefined')`

      const sourceB64 = Buffer.from(template, 'utf8').toString('base64')

      return `
<CodeRunner
  title="${md.utils.escapeHtml(title)}"
  source-b64="${sourceB64}"
/>
`
    }

    return defaultFence(tokens, idx, options, env, self)
  }
}
