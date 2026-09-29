export function buildStatistics(chapters) {
  return chapters.reduce((stats, chapter) => {
    stats.chapters += 1
    stats.tasks += chapter.tasks
    stats.solutions += chapter.solutions
    stats.examples += chapter.examples
    stats.mermaid += chapter.mermaid
    stats.miniProjects += chapter.miniProjects
    stats.readingMinutes += chapter.readingMinutes

    if (chapter.access === 'free') stats.freeChapters += 1
    else stats.paidChapters += 1

    return stats
  }, {
    chapters: 0,
    tasks: 0,
    solutions: 0,
    examples: 0,
    mermaid: 0,
    miniProjects: 0,
    readingMinutes: 0,
    freeChapters: 0,
    paidChapters: 0
  })
}
