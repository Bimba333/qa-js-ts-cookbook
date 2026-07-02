function progressBar(current, total) {
  if (!total) {
    return ''
  }

  const size = 12
  const filled = Math.max(1, Math.round((current / total) * size))

  return `${'█'.repeat(filled)}${'░'.repeat(size - filled)}`
}

export function applyNavigation(chapters) {
  const jsChapters = chapters.filter(chapter => chapter.part === 'JavaScript')
  const firstBySection = new Map()

  for (const chapter of chapters) {
    const key = `${chapter.part}:${chapter.section}`

    if (!firstBySection.has(key)) {
      firstBySection.set(key, chapter)
    }
  }

  return chapters.map((chapter, index) => {
    const jsIndex = jsChapters.findIndex(item => item.path === chapter.path)
    const current = jsIndex >= 0 ? jsIndex + 1 : null
    const total = jsIndex >= 0 ? jsChapters.length : null
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
            label: 'JavaScript',
            current,
            total,
            bar: progressBar(current, total)
          }
        : null
    }
  })
}
