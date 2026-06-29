import fs from 'node:fs'
import path from 'node:path'
import { readText, stripFences, walk } from './report.mjs'

function slug(value) {
  return value
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[`*_[\]().,:;!?'"«»]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function anchors(markdown) {
  return new Set([...markdown.matchAll(/^#{1,6}\s+(.+)$/gm)].map(match => slug(match[1].trim())))
}

function markdownLinks(markdown) {
  return [...stripFences(markdown).matchAll(/(?<!!)\[[^\]]+]\(([^)]+)\)/g)]
    .map(match => match[1].trim())
    .filter(link => link && !link.startsWith('http://') && !link.startsWith('https://') && !link.startsWith('mailto:'))
}

export function checkLinks(context) {
  const { root, report } = context
  const files = walk(root, '.', file => file.endsWith('.md'))

  for (const file of files) {
    const markdown = readText(root, file)

    for (const rawLink of markdownLinks(markdown)) {
      if (/mkdocs/i.test(rawLink)) {
        report.fail('Links', `Ссылка содержит mkdocs: ${file} -> ${rawLink}`)
      }

      if (rawLink.startsWith('/Users/')) {
        report.fail('Links', `Локальный абсолютный путь в ссылке: ${file} -> ${rawLink}`)
        continue
      }

      const [targetPart, anchorPart] = rawLink.split('#')

      if (!targetPart && anchorPart) {
        if (!anchors(markdown).has(slug(anchorPart))) {
          report.fail('Links', `Несуществующий anchor: ${file} -> ${rawLink}`)
        }

        continue
      }

      if (!targetPart || targetPart.startsWith('#')) {
        continue
      }

      const normalizedTarget = decodeURIComponent(targetPart)
      const resolved = path.normalize(path.join(path.dirname(file), normalizedTarget)).replace(/\\/g, '/')

      if (!fs.existsSync(path.join(root, resolved))) {
        report.fail('Links', `Битая markdown-ссылка: ${file} -> ${rawLink}`)
        continue
      }

      if (anchorPart && resolved.endsWith('.md')) {
        const targetMarkdown = readText(root, resolved)

        if (!anchors(targetMarkdown).has(slug(anchorPart))) {
          report.fail('Links', `Несуществующий anchor: ${file} -> ${rawLink}`)
        }
      }
    }
  }

  if (!report.checks.some(check => check.name === 'Links' && check.status === 'FAIL')) {
    report.ok('Links')
  }
}

