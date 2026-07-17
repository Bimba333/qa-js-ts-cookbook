function progressBar(current, total) {
  if (!total) {
    return ''
  }

  const size = 12
  const filled = Math.max(1, Math.round((current / total) * size))

  return `${'█'.repeat(filled)}${'░'.repeat(size - filled)}`
}

export function applyNavigation(chapters) {
  const chaptersByPart = new Map()
  const firstBySection = new Map()

  for (const chapter of chapters) {
    if (!chaptersByPart.has(chapter.part)) {
      chaptersByPart.set(chapter.part, [])
    }
    chaptersByPart.get(chapter.part).push(chapter)

    const key = `${chapter.part}:${chapter.section}`

    if (!firstBySection.has(key)) {
      firstBySection.set(key, chapter)
    }
  }

  return chapters.map((chapter, index) => {
    const partChapters = chaptersByPart.get(chapter.part) || []
    const partIndex = partChapters.findIndex(item => item.path === chapter.path)
    const current = partIndex >= 0 ? partIndex + 1 : null
    const total = partIndex >= 0 ? partChapters.length : null
    const sectionStart = firstBySection.get(`${chapter.part}:${chapter.section}`)

    return {
      ...chapter,
      previous: chapters[index - 1]
        ? {
            title: chapters[index - 1].title,
            number: chapters[index - 1].number,
            link: chapters[index - 1].link
          }
        : null,
      next: chapters[index + 1]
        ? {
            title: chapters[index + 1].title,
            number: chapters[index + 1].number,
            link: chapters[index + 1].link
          }
        : null,
      sectionLink: sectionStart
        ? {
            title: chapter.section,
            link: sectionStart.link
          }
        : null,
      progress: current && total
        ? {
            label: chapter.part,
            current,
            total,
            bar: progressBar(current, total)
          }
        : null
    }
  })
}
