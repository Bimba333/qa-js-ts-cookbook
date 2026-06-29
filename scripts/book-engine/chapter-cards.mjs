export function applyChapterCardData(chapters) {
  return chapters.map(chapter => ({
    ...chapter,
    card: {
      chapterLabel: chapter.number ? `Глава ${chapter.number}` : chapter.part,
      title: chapter.title,
      reading: chapter.readingMinutes,
      examples: chapter.examples,
      tasks: chapter.tasks,
      solutions: chapter.solutions,
      mermaid: chapter.mermaid
    }
  }))
}
