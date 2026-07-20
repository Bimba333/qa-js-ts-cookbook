import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SUMMARY = path.join(ROOT, 'SUMMARY.md')
const OUT = path.join(ROOT, '.vitepress', 'sidebar.generated.ts')

// Английские названия частей и разделов книги. Названия глав берутся из
// заголовка h1 переведенного файла в en/docs/..., поэтому здесь только
// структурные заголовки, которых немного.
const PART_TITLES_EN = {
  'Введение': 'Introduction',
  'JavaScript': 'JavaScript',
  'TypeScript': 'TypeScript',
  'Automation QA': 'Automation QA',
  'Финальный проект': 'Final Project'
}

const SECTION_TITLES_EN = {
  'Основы языка': 'Language Fundamentals',
  'Управление программой': 'Control Flow',
  'Functions': 'Functions',
  'Objects': 'Objects',
  'Arrays': 'Arrays',
  'Execution Model Revisited': 'Execution Model Revisited',
  'Function Context': 'Function Context',
  'Async JavaScript': 'Async JavaScript',
  'Iteration Protocols': 'Iteration Protocols',
  'Modules': 'Modules',
  'Memory Management': 'Memory Management',
  'Engineering Practice': 'Engineering Practice',
  'JavaScript Conclusion': 'JavaScript Conclusion'
}

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
  return title.replace(/^Часть\s+[IVXLC]+\.\s+/, '').trim()
}

function normalizeSectionTitle(title) {
  return title.replace(/^Раздел\s+\d+\.\s+/, '').trim()
}

function isTheoryLink(link) {
  return link.startsWith('docs/') && link.endsWith('.md')
}

function pageTitle(source, fallback) {
  const heading = readHeading(path.join(ROOT, source))

  return heading || fallback
}

// Собираем нейтральную структуру книги из SUMMARY один раз, затем
// рендерим из нее сайдбар под каждую локаль.
function parseSummary() {
  const content = fs.readFileSync(SUMMARY, 'utf8')
  const lines = content.split('\n')
  const parts = []
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

      currentPart = {
        title: normalizePartTitle(title),
        sections: [],
        items: []
      }
      parts.push(currentPart)
      currentSection = null
      continue
    }

    if (h2 && currentPart) {
      currentSection = {
        title: normalizeSectionTitle(h2[1].trim()),
        items: []
      }
      currentPart.sections.push(currentSection)
      continue
    }

    if (!item || !currentPart) {
      continue
    }

    const link = item[2].trim()

    if (!isTheoryLink(link)) {
      continue
    }

    const entry = {
      link: link.replace(/\.md$/, ''),
      docPath: link,
      fallbackTitle: item[1].trim(),
      number: chapterNumber(link)
    }

    if (currentSection) {
      currentSection.items.push(entry)
    } else {
      currentPart.items.push(entry)
    }
  }

  return parts
}

function renderSidebar(parts, locale) {
  const isEn = locale === 'en'

  const partTitle = title => (isEn ? PART_TITLES_EN[title] || title : title)
  const sectionTitle = title => (isEn ? SECTION_TITLES_EN[title] || title : title)

  // Для английской версии показываем только уже переведенные главы.
  function localizedEntry(entry, useChapterPrefix) {
    if (isEn && !fs.existsSync(path.join(ROOT, 'en', entry.docPath))) {
      return null
    }

    const source = isEn ? path.join('en', entry.docPath) : entry.docPath
    const title = pageTitle(source, entry.fallbackTitle)
    const prefix = useChapterPrefix && entry.number
      ? (isEn ? `Chapter ${entry.number}. ` : `Глава ${entry.number}. `)
      : ''
    const link = isEn ? `/en/${entry.link}` : `/${entry.link}`

    return { text: `${prefix}${title}`, link }
  }

  const sidebar = []

  for (const part of parts) {
    const introPart = part.title === 'Введение'
    const useChapterPrefix = !introPart
    const partItems = []

    for (const entry of part.items) {
      const item = localizedEntry(entry, useChapterPrefix)
      if (item) {
        partItems.push(item)
      }
    }

    for (const section of part.sections) {
      const sectionItems = []

      for (const entry of section.items) {
        const item = localizedEntry(entry, true)
        if (item) {
          sectionItems.push(item)
        }
      }

      if (sectionItems.length) {
        partItems.push({
          text: sectionTitle(section.title),
          collapsed: true,
          items: sectionItems
        })
      }
    }

    if (partItems.length) {
      sidebar.push({
        text: partTitle(part.title),
        collapsed: false,
        items: partItems
      })
    }
  }

  return sidebar
}

const parts = parseSummary()
const sidebar = renderSidebar(parts, 'ru')
const sidebarEn = renderSidebar(parts, 'en')

fs.writeFileSync(
  OUT,
  `export const sidebar = ${JSON.stringify(sidebar, null, 2)}\n\n` +
  `export const sidebarEn = ${JSON.stringify(sidebarEn, null, 2)}\n`
)

console.log(`Generated ${OUT}`)
console.log(`- RU parts: ${sidebar.length}`)
console.log(`- EN parts: ${sidebarEn.length}`)
