import { fencedBlocks, firstH1, readText, walk } from './report.mjs'

export function checkMarkdown(context) {
  const { root, report } = context
  const markdownFiles = context.markdownFiles || walk(root, 'docs', file => file.endsWith('.md'))

  for (const file of markdownFiles) {
    const markdown = readText(root, file)
    const h1Count = (markdown.match(/^#\s+/gm) || []).length

    if (h1Count !== 1) {
      report.warn(`Файл должен иметь один основной H1: ${file} (${h1Count})`)
    }

    if (!firstH1(markdown)) {
      report.fail('Markdown', `Не найден H1: ${file}`)
    }

    for (const block of fencedBlocks(markdown)) {
      if (!block.info && !block.body.trim()) {
        report.warn(`Пустой code fence: ${file}`)
      }
    }
  }

  if (!report.checks.some(check => check.name === 'Markdown' && check.status === 'FAIL')) {
    report.ok('Markdown')
  }
}

