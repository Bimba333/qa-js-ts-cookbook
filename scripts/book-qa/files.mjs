import path from 'node:path'
import { exists, firstH1, parseSummaryLinks, readText, walk } from './report.mjs'

export function checkFiles(context) {
  const { root, report } = context
  const summary = readText(root, 'SUMMARY.md')
  const summaryLinks = parseSummaryLinks(summary)
    .filter(link => link.path.startsWith('docs/') && link.path.endsWith('.md'))
  const summarySet = new Set(summaryLinks.map(link => link.path))
  const markdownFiles = walk(root, 'docs', file => file.endsWith('.md'))
  const h1ByTitle = new Map()

  for (const link of summaryLinks) {
    if (!exists(root, link.path)) {
      report.fail('Files', `Файл из SUMMARY.md не найден: ${link.path}`)
    }
  }

  for (const file of markdownFiles) {
    const markdown = readText(root, file)

    if (!markdown.trim()) {
      report.fail('Files', `Пустой markdown-файл: ${file}`)
      continue
    }

    const h1 = firstH1(markdown)

    if (!h1) {
      report.fail('Files', `Markdown-файл без H1: ${file}`)
    } else {
      const previous = h1ByTitle.get(h1)

      if (previous) {
        report.warn(`Повторяющийся H1: "${h1}" (${previous}, ${file})`)
      } else {
        h1ByTitle.set(h1, file)
      }
    }

    if (!summarySet.has(file)) {
      report.warn(`Markdown-файл docs/ не указан в SUMMARY.md: ${file}`)
    }
  }

  const jsNumbers = markdownFiles
    .filter(file => file.startsWith('docs/01-javascript/'))
    .map(file => path.basename(file).match(/^(\d+)-/))
    .filter(Boolean)
    .map(match => Number(match[1]))
    .sort((a, b) => a - b)

  for (let expected = 1; expected <= Math.max(...jsNumbers); expected += 1) {
    if (!jsNumbers.includes(expected)) {
      report.fail('Files', `Пропущен номер JavaScript-главы: ${expected}`)
    }
  }

  if (!report.checks.some(check => check.name === 'Files' && check.status === 'FAIL')) {
    report.ok('Files')
  }

  return {
    summaryLinks,
    summarySet,
    markdownFiles
  }
}

