import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const OUT = path.join(ROOT, '.vitepress', 'sidebar.generated.ts')

const sections = [
  {
    title: 'Введение',
    dir: 'docs/00-introduction',
    base: '/docs/00-introduction/'
  },
  {
    title: 'JavaScript',
    dir: 'docs/01-javascript',
    base: '/docs/01-javascript/'
  },
  {
    title: 'Практика',
    dir: 'practice/01-javascript',
    base: '/practice/01-javascript/'
  },
  {
    title: 'Решения',
    dir: 'solutions/01-javascript',
    base: '/solutions/01-javascript/'
  },
  {
    title: 'Примеры',
    dir: 'examples/01-javascript',
    base: '/examples/01-javascript/'
  }
]

function fileTitle(fileName) {
  return fileName
    .replace(/\.md$/, '')
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase())
}

function readItems(section) {
  const absDir = path.join(ROOT, section.dir)

  if (!fs.existsSync(absDir)) {
    return []
  }

  return fs
    .readdirSync(absDir)
    .filter(file => file.endsWith('.md'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map(file => ({
      text: fileTitle(file),
      link: `${section.base}${file.replace(/\.md$/, '')}`
    }))
}

const sidebar = sections.map(section => ({
  text: section.title,
  collapsed: false,
  items: readItems(section)
}))

const content = `export const sidebar = ${JSON.stringify(sidebar, null, 2)}\n`

fs.writeFileSync(OUT, content)
console.log(`Generated ${OUT}`)
