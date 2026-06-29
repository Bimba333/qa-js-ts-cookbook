import childProcess from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { readText, stripFences, walk } from './report.mjs'

function referencedExamplePaths(markdown) {
  const clean = stripFences(markdown)
  const matches = [
    ...markdown.matchAll(/```(?:text)?\n(examples\/[^\n]+)\n```/g),
    ...clean.matchAll(/node\s+(examples\/[^\s)]+)\b/g),
    ...clean.matchAll(/\((examples\/[^)]+)\)/g)
  ]

  return matches.map(match => match[1].trim())
}

function isIntentionalInvalid(filePath, code) {
  return /INTENTIONAL SYNTAX ERROR|EDUCATIONAL INVALID EXAMPLE/.test(code) ||
    /(?:syntax-error|invalid|broken)/i.test(filePath)
}

function isNodeOnly(code) {
  return /process\b|require\s*\(|from ['"](?:node:)?(?:fs|path)['"]|import\s+(?:fs|path)\b|__dirname|__filename/.test(code)
}

function checkSyntax(filePath) {
  return childProcess.spawnSync(process.execPath, ['--check', filePath], {
    encoding: 'utf8'
  })
}

export function checkExamples(context) {
  const { root, report } = context
  const markdownFiles = walk(root, '.', file => file.endsWith('.md'))
  const referenced = new Set()

  for (const file of markdownFiles) {
    const markdown = readText(root, file)

    for (const reference of referencedExamplePaths(markdown)) {
      const normalized = reference.replace(/^\.\//, '').replace(/\/$/, '')
      const abs = path.join(root, normalized)

      if (!fs.existsSync(abs)) {
        report.fail('Examples', `Путь examples не существует: ${file} -> ${reference}`)
        continue
      }

      if (fs.statSync(abs).isDirectory()) {
        for (const child of walk(root, normalized, item => /\.(?:js|mjs|cjs|json)$/.test(item))) {
          referenced.add(child)
        }
      } else {
        referenced.add(normalized)
      }
    }
  }

  const exampleFiles = walk(root, 'examples', file => /\.(?:js|mjs|cjs)$/.test(file))

  for (const file of exampleFiles) {
    const code = readText(root, file)

    if (!code.trim()) {
      report.fail('Examples', `Пустой example-файл: ${file}`)
      continue
    }

    if (!referenced.has(file)) {
      report.warn(`Example не найден в ссылках глав или практики: ${file}`)
    }

    if (isIntentionalInvalid(file, code)) {
      continue
    }

    const result = checkSyntax(path.join(root, file))

    if (result.status !== 0) {
      report.fail('Examples', `Синтаксическая ошибка в example: ${file}\n${result.stderr.trim()}`)
    }

    if (isNodeOnly(code)) {
      continue
    }
  }

  if (!report.checks.some(check => check.name === 'Examples' && check.status === 'FAIL')) {
    report.ok('Examples')
  }
}

