import fs from 'node:fs'
import path from 'node:path'

function titleFromFile(filePath) {
  return path
    .basename(filePath)
    .replace(/\.(md|js|ts|json)$/, '')
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
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

export function exampleCardPlugin(md) {
  const defaultFence = md.renderer.rules.fence

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const content = token.content.trim()

    if (content.includes('\n')) {
      return defaultFence(tokens, idx, options, env, self)
    }

    if (/^node examples\/.+\.(js|ts)$/.test(content)) {
      return ''
    }

    const isMarkdownPath = /^(docs|practice|solutions)\/.+\.md$/.test(content)
    const isExamplePath = /^examples\/.+\.(js|ts|json)$/.test(content)
    const isPlaygroundPath = /^playground\/.+\.(js|ts)$/.test(content)

    if (isMarkdownPath) {
      const href = `/qa-javascript-book/${content.replace(/\.md$/, '')}`
      const title = titleFromMarkdown(content)

      return `
<div class="book-link-card">
  <div class="book-link-card__title">${md.utils.escapeHtml(title)}</div>
  <a class="book-link-card__button" href="${href}">Открыть</a>
</div>
`
    }

    if (isExamplePath) {
      const absPath = path.join(process.cwd(), content)

      if (!fs.existsSync(absPath)) {
        return `<div class="example-card">Файл примера не найден</div>`
      }

      const source = fs.readFileSync(absPath, 'utf8')
      const sourceB64 = Buffer.from(source, 'utf8').toString('base64')
      const title = titleFromFile(content)

      return `
<CodeRunner
  title="${md.utils.escapeHtml(title)}"
  source-b64="${sourceB64}"
  readonly
/>
`
    }

    if (isPlaygroundPath) {
      const title = titleFromFile(content)
      const template = `// Напишите код для задания: ${content}
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