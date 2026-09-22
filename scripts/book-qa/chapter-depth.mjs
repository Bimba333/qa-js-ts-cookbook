/**
 * Измеряет глубину глав по тому, что видит читатель.
 *
 * Служебные разделы плагин скрывает, поэтому их объём в метрику не входит:
 * иначе «углубление» можно было бы изобразить, наращивая невидимый текст.
 */
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const ROOT = process.cwd()

const HIDDEN = new Set([
  'Время изучения',
  'Навигация',
  'Связь с предыдущей главой',
  'Предварительные требования',
  'Цели обучения',
  'Цель главы',
  'Мотивация',
  'Практика',
  'Решения'
])

/** Разделы, которых чаще всего не хватает тонким главам. */
const VALUABLE = [
  { key: 'theory', titles: ['Теория'] },
  { key: 'examples', titles: ['Примеры кода', 'Практические примеры', 'Практический пример'] },
  { key: 'mistakes', titles: ['Типичные ошибки', 'Распространённые ошибки', 'Распространенные ошибки'] },
  { key: 'myths', titles: ['Распространенные мифы', 'Распространённые мифы'] },
  { key: 'faq', titles: ['Частые вопросы'] },
  { key: 'selfCheck', titles: ['Проверьте себя', 'Quick Check', 'Быстрая проверка'] },
  { key: 'qa', titles: ['Automation QA', 'Использование в Automation QA'] }
]

function parseChapter(file) {
  const text = fs.readFileSync(file, 'utf8')
  const lines = text.split('\n')
  const sections = []
  let current = null

  for (const line of lines) {
    const heading = /^## (.+)/.exec(line)

    if (heading) {
      if (current) sections.push(current)
      current = { title: heading[1].trim(), lines: [], subheadings: 0 }
      continue
    }

    if (!current) continue
    if (/^### /.test(line)) current.subheadings += 1
    current.lines.push(line)
  }

  if (current) sections.push(current)

  const visible = sections.filter(section => !HIDDEN.has(section.title))
  const words = section => section.lines.join(' ').split(/\s+/).filter(Boolean).length
  const visibleWords = visible.reduce((sum, section) => sum + words(section), 0)

  const found = {}
  for (const group of VALUABLE) {
    const section = sections.find(item => group.titles.includes(item.title))
    found[group.key] = section ? words(section) : 0
  }

  const theorySection = sections.find(item => item.title === 'Теория')

  return {
    file: path.relative(ROOT, file).replace(/\\/g, '/'),
    visibleWords,
    theoryWords: found.theory,
    theorySubsections: theorySection?.subheadings ?? 0,
    hasDiagram: /```mermaid/.test(text),
    hasRunnableExample: /```text\s*\nexamples\//.test(text),
    sections: found
  }
}

function collect(directory) {
  return fs
    .readdirSync(directory)
    .filter(name => name.endsWith('.md'))
    .sort()
    .map(name => parseChapter(path.join(directory, name)))
}

const parts = [
  { name: 'JavaScript', dir: 'docs/01-javascript' },
  { name: 'TypeScript', dir: 'docs/02-typescript' },
  { name: 'Automation QA', dir: 'docs/03-automation-qa' }
]

const all = []

console.log('Видимый объём глав (без служебных разделов)\n')

for (const part of parts) {
  const chapters = collect(path.join(ROOT, part.dir))
  all.push(...chapters)

  const median = [...chapters].sort((a, b) => a.visibleWords - b.visibleWords)[
    Math.floor(chapters.length / 2)
  ]
  const thin = chapters.filter(chapter => chapter.visibleWords < 600).length

  console.log(
    `${part.name.padEnd(15)} глав: ${String(chapters.length).padStart(3)} | ` +
      `медиана: ${String(median.visibleWords).padStart(5)} слов | ` +
      `тоньше 600 слов: ${thin}`
  )
}

const missing = key => all.filter(chapter => chapter.sections[key] === 0).length

console.log('\nГлав без ключевых разделов:')
console.log(`  без «Частых вопросов»:        ${missing('faq')} из ${all.length}`)
console.log(`  без разбора мифов:            ${missing('myths')} из ${all.length}`)
console.log(`  без самопроверки:             ${missing('selfCheck')} из ${all.length}`)
console.log(`  без запускаемого примера:     ${all.filter(c => !c.hasRunnableExample).length} из ${all.length}`)
console.log(`  без диаграммы:                ${all.filter(c => !c.hasDiagram).length} из ${all.length}`)

const limit = Number(process.argv[2] ?? 20)
const thinnest = [...all].sort((a, b) => a.visibleWords - b.visibleWords).slice(0, limit)

console.log(`\nСамые тонкие главы (${limit}):`)
for (const chapter of thinnest) {
  console.log(
    `  ${String(chapter.visibleWords).padStart(4)} слов | теория ${String(chapter.theoryWords).padStart(4)} ` +
      `(${chapter.theorySubsections} подразделов) | ${chapter.file}`
  )
}
