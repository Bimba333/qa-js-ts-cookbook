import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, '.vitepress', 'sidebar.generated.ts')

const sections = [
  {
    title: 'Введение',
    dir: 'docs/00-introduction',
    base: '/docs/00-introduction/',
    type: 'intro'
  },
  {
    title: 'JavaScript',
    dir: 'docs/01-javascript',
    base: '/docs/01-javascript/',
    type: 'theory'
  }
]

function readHeading(filePath) {
  if (!fs.existsSync(filePath)) return ''

  const content = fs.readFileSync(filePath, 'utf8')
  const match = content.match(/^#\s+(.+)$/m)

  return match ? match[1].trim() : ''
}

function chapterNumber(fileName) {
  const match = fileName.match(/^(\d+)-/)
  return match ? Number(match[1]) : null
}

function theoryTitleByFileName(fileName) {
  const theoryPath = path.join(ROOT, 'docs/01-javascript', fileName)
  const heading = readHeading(theoryPath)

  return heading || fileName
    .replace(/\.md$/, '')
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
}

function titleFor(section, fileName) {
  const n = chapterNumber(fileName)

  if (section.type === 'intro') {
    return readHeading(path.join(ROOT, section.dir, fileName))
  }

  const title = theoryTitleByFileName(fileName)

  if (section.type === 'theory') {
    return n ? `Глава ${n}. ${title}` : title
  }

  if (section.type === 'practice') {
    return n ? `Практика. Глава ${n}. ${title}` : `Практика. ${title}`
  }

  if (section.type === 'solutions') {
    return n ? `Решения. Глава ${n}. ${title}` : `Решения. ${title}`
  }

  return title
}

function readItems(section) {
  const absDir = path.join(ROOT, section.dir)

  if (!fs.existsSync(absDir)) return []

  return fs
    .readdirSync(absDir)
    .filter(file => file.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map(file => ({
      text: titleFor(section, file),
      link: `${section.base}${file.replace(/\.md$/, '')}${section.type === 'practice' ? '#практика' : section.type === 'solutions' ? '#решения' : ''}`
    }))
}

const sidebar = sections.map(section => ({
  text: section.title,
  collapsed: false,
  items: readItems(section)
}))

fs.writeFileSync(OUT, `export const sidebar = ${JSON.stringify(sidebar, null, 2)}\n`)
console.log(`Generated ${OUT}`)
