function normalizePartTitle(title) {
  return title.replace(/^Часть\s+[IVXLC]+\.\s+/, '').trim()
}

function normalizeSectionTitle(title) {
  return title.replace(/^Раздел\s+\d+\.\s+/, '').trim()
}

function isBookPart(title) {
  return title === 'Введение' || /^Часть\s+[IVXLC]+\.\s+/.test(title)
}

function isTheoryLink(link) {
  return link.startsWith('docs/') && link.endsWith('.md')
}

export function parseSummary(summaryMarkdown) {
  const lines = summaryMarkdown.split('\n')
  const parts = []
  let currentPart = null
  let currentSection = null

  for (const line of lines) {
    const h1 = line.match(/^#\s+(.+)$/)
    const h2 = line.match(/^##\s+(.+)$/)
    const item = line.match(/^\s*\*\s+\[([^\]]+)]\(([^)]+)\)/)

    if (h1) {
      const title = h1[1].trim()

      if (!isBookPart(title)) {
        currentPart = null
        currentSection = null
        continue
      }

      currentPart = {
        title: normalizePartTitle(title),
        sections: []
      }
      parts.push(currentPart)
      currentSection = currentPart.title === 'Введение'
        ? { title: 'Введение', chapters: [] }
        : null

      if (currentSection) {
        currentPart.sections.push(currentSection)
      }

      continue
    }

    if (h2 && currentPart && currentPart.title !== 'Введение') {
      currentSection = {
        title: normalizeSectionTitle(h2[1].trim()),
        chapters: []
      }
      currentPart.sections.push(currentSection)
      continue
    }

    if (!item || !currentPart || !currentSection) {
      continue
    }

    const title = item[1].trim()
    const link = item[2].trim()

    if (!isTheoryLink(link)) {
      continue
    }

    currentSection.chapters.push({
      fallbackTitle: title,
      path: link
    })
  }

  return parts
    .map(part => ({
      ...part,
      sections: part.sections.filter(section => section.chapters.length)
    }))
    .filter(part => part.sections.length)
}
