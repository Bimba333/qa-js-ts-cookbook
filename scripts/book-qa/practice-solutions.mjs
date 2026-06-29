import path from 'node:path'
import { exists, readText, walk } from './report.mjs'

function workSectionCount(markdown) {
  return [...markdown.matchAll(/^##\s+(.+)$/gm)]
    .map(match => match[1].trim())
    .filter(title => !/^Возможные улучшения$/i.test(title))
    .filter(title => !/^Цели практики$/i.test(title))
    .length
}

export function checkPracticeSolutions(context) {
  const { root, report } = context
  const docs = walk(root, 'docs/01-javascript', file => file.endsWith('.md'))
  const practices = walk(root, 'practice/01-javascript', file => file.endsWith('.md'))
  const solutions = walk(root, 'solutions/01-javascript', file => file.endsWith('.md'))
  const docNames = new Set(docs.map(file => path.basename(file)))
  const practiceNames = new Set(practices.map(file => path.basename(file)))

  for (const doc of docs) {
    const practice = doc.replace(/^docs\//, 'practice/')
    const solution = doc.replace(/^docs\//, 'solutions/')

    if (!exists(root, practice)) {
      report.fail('Practice/Solutions', `Для главы нет practice: ${doc}`)
      continue
    }

    if (!exists(root, solution)) {
      report.fail('Practice/Solutions', `Для practice нет solutions: ${practice}`)
      continue
    }

    const practiceMarkdown = readText(root, practice)
    const solutionMarkdown = readText(root, solution)
    const tasks = workSectionCount(practiceMarkdown)
    const answers = workSectionCount(solutionMarkdown)

    if (!/Ответ/.test(solutionMarkdown)) {
      report.fail('Practice/Solutions', `Solutions не содержит ответы: ${solution}`)
    }

    if (tasks && answers && Math.abs(tasks - answers) > Math.max(2, Math.ceil(tasks * 0.35))) {
      report.warn(`Количество задач и ответов заметно отличается: ${practice} (${tasks}) / ${solution} (${answers})`)
    }
  }

  for (const practice of practices) {
    if (!docNames.has(path.basename(practice))) {
      report.fail('Practice/Solutions', `Practice без теоретической главы: ${practice}`)
    }
  }

  for (const solution of solutions) {
    if (!practiceNames.has(path.basename(solution))) {
      report.fail('Practice/Solutions', `Solutions без practice: ${solution}`)
    }
  }

  if (!report.checks.some(check => check.name === 'Practice/Solutions' && check.status === 'FAIL')) {
    report.ok('Practice/Solutions')
  }
}
