import path from 'node:path'

const WORDS_PER_MINUTE = 180

function firstHeading(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m)

  return match ? match[1].trim() : ''
}

function chapterNumber(filePath) {
  const match = path.basename(filePath).match(/^(\d+)-/)

  return match ? Number(match[1]) : null
}

function stripCode(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, ' ')
}

function wordCount(markdown) {
  return stripCode(markdown)
    .replace(/[^\p{L}\p{N}_-]+/gu, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length
}

function count(pattern, markdown) {
  return (markdown.match(pattern) || []).length
}

function countExamples(markdown) {
  return count(/^```(?:text)?\nexamples\/.+\.(?:js|ts|json)\n```/gm, markdown) +
    count(/^```(?:text)?\nexamples\/.+\/\n```/gm, markdown) +
    count(/^node examples\/.+\.(?:js|ts|json)$/gm, markdown)
}

function countPracticeTasks(markdown) {
  const h3Tasks = count(/^###\s+/gm, markdown)
  const orderedQuestions = count(/^\d+\.\s+/gm, markdown)
  const miniProjects = count(/^##\s+Мини-проект/gm, markdown)

  return h3Tasks + orderedQuestions + miniProjects
}

function countSolutions(markdown) {
  const answerHeadings = count(/^###\s+/gm, markdown)
  const answerLabels = count(/^Ответ:?/gm, markdown)
  const miniProjects = count(/^##\s+Мини-проект/gm, markdown)

  return Math.max(answerHeadings, answerLabels, miniProjects)
}

export function buildChapterMetadata(chapter, context) {
  const { fileCache, partTitle, sectionTitle, sectionIndex, chapterIndex } = context
  const markdown = fileCache.read(chapter.path)
  const practicePath = chapter.path.replace(/^docs\//, 'practice/')
  const solutionPath = chapter.path.replace(/^docs\//, 'solutions/')
  const practiceMarkdown = fileCache.read(practicePath)
  const solutionMarkdown = fileCache.read(solutionPath)
  const title = firstHeading(markdown) || chapter.fallbackTitle
  const words = wordCount(markdown)
  const examples = countExamples(markdown)
  const mermaid = count(/```mermaid/g, markdown) +
    count(/```mermaid/g, practiceMarkdown) +
    count(/```mermaid/g, solutionMarkdown)
  const h2 = count(/^##\s+/gm, markdown)
  const h3 = count(/^###\s+/gm, markdown)

  return {
    path: chapter.path,
    link: `/${chapter.path.replace(/\.md$/, '')}`,
    title,
    number: chapterNumber(chapter.path),
    part: partTitle,
    section: sectionTitle,
    sectionIndex,
    chapterIndex,
    wordCount: words,
    readingMinutes: Math.max(1, Math.ceil(words / WORDS_PER_MINUTE)),
    h2,
    h3,
    examples,
    tasks: practiceMarkdown ? countPracticeTasks(practiceMarkdown) : 0,
    solutions: solutionMarkdown ? countSolutions(solutionMarkdown) : 0,
    mermaid,
    miniProjects: practiceMarkdown ? count(/^##\s+Мини-проект/gm, practiceMarkdown) : 0
  }
}
