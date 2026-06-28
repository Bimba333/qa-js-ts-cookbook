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
  }
]

function getTitleFromMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const match = content.match(/^#\s+(.+)$/m)

  if (match) {
    return match[1].trim()
  }

  return path
    .basename(filePath)
    .replace(/\.md$/, '')
    .replace(/^\d+-/, '')
    .replace(/-/g, ' ')
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
    .map(file => {
      const absFile = path.join(absDir, file)

      return {
        text: getTitleFromMarkdown(absFile),
        link: `${section.base}${file.replace(/\.md$/, '')}`
      }
    })
}

const sidebar = sections.map(section => ({
  text: section.title,
  collapsed: false,
  items: readItems(section)
}))

fs.writeFileSync(
  OUT,
  `export const sidebar = ${JSON.stringify(sidebar, null, 2)}\n`
)

console.log(`Generated ${OUT}`)