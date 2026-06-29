import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SUMMARY = path.join(ROOT, 'SUMMARY.md')
const OUT = path.join(ROOT, '.vitepress', 'sidebar.generated.ts')

function readHeading(filePath) {
  if (!fs.existsSync(filePath)) {
    return ''
  }

  const content = fs.readFileSync(filePath, 'utf8')
  const match = content.match(/^#\s+(.+)$/m)

  return match ? match[1].trim() : ''
}

function chapterNumber(filePath) {
  const match = path.basename(filePath).match(/^(\d+)-/)
  return match ? Number(match[1]) : null
}

function normalizePartTitle(title) {
  if (title === 'Часть I. JavaScript') {
    return 'JavaScript'
  }

  return title
}

function normalizeSectionTitle(title) {
  return title.replace(/^Раздел\s+\d+\.\s+/, '').trim()
}

function isTheoryLink(link) {
  return link.startsWith('docs/') && link.endsWith('.md')
}

function pageTitle(link, fallback) {
  const heading = readHeading(path.join(ROOT, link))

  return heading || fallback
}

function sidebarItem(title, link, useChapterPrefix) {
  const n = chapterNumber(link)
  const text = useChapterPrefix && n ? `Глава ${n}. ${title}` : title

  return {
    text,
    link: `/${link.replace(/\.md$/, '')}`
  }
}

function parseSummary() {
  const content = fs.readFileSync(SUMMARY, 'utf8')
  const lines = content.split('\n')
  const sidebar = []
  let currentPart = null
  let currentSection = null

  for (const line of lines) {
    const h1 = line.match(/^#\s+(.+)$/)
    const h2 = line.match(/^##\s+(.+)$/)
    const item = line.match(/^\s*\*\s+\[([^\]]+)]\(([^)]+)\)/)

    if (h1) {
      const title = h1[1].trim()

      if (title === 'SUMMARY' || title === 'JavaScript & TypeScript for Automation QA') {
        currentPart = null
        currentSection = null
        continue
      }

      if (title === 'Введение' || title.startsWith('Часть I. JavaScript')) {
        currentPart = {
          text: normalizePartTitle(title),
          collapsed: false,
          items: []
        }
        sidebar.push(currentPart)
      } else {
        currentPart = null
      }

      currentSection = null
      continue
    }

    if (h2 && currentPart?.text === 'JavaScript') {
      currentSection = {
        text: normalizeSectionTitle(h2[1].trim()),
        collapsed: false,
        items: []
      }
      currentPart.items.push(currentSection)
      continue
    }

    if (!item || !currentPart) {
      continue
    }

    const fallbackTitle = item[1].trim()
    const link = item[2].trim()

    if (!isTheoryLink(link)) {
      continue
    }

    const title = pageTitle(link, fallbackTitle)

    if (currentPart.text === 'Введение') {
      currentPart.items.push(sidebarItem(title, link, false))
      continue
    }

    if (currentPart.text === 'JavaScript' && currentSection) {
      currentSection.items.push(sidebarItem(title, link, true))
    }
  }

  return sidebar
    .map(part => ({
      ...part,
      items: part.items.filter(item => !item.items || item.items.length)
    }))
    .filter(part => part.items.length)
}

const sidebar = parseSummary()

fs.writeFileSync(OUT, `export const sidebar = ${JSON.stringify(sidebar, null, 2)}\n`)
console.log(`Generated ${OUT}`)
